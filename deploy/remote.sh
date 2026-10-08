#!/usr/bin/env bash
# Runs ON THE SERVER from ~/hacktoberfest (copied there by deploy.sh). No root needed if the
# user is in the docker group.
#   bash ~/hacktoberfest/remote.sh up <tag>   trial-run <tag>, switch to it only if it's healthy
#   bash ~/hacktoberfest/remote.sh rollback   switch back to the previous tag
#   bash ~/hacktoberfest/remote.sh status     show running tag and health
#   bash ~/hacktoberfest/remote.sh logs       follow the container logs
set -euo pipefail

cd "$(dirname "$0")"
CONTAINER="gdg-hacktoberfest"
TRIAL="gdg-hacktoberfest-trial"
IMAGE="gdg-hacktoberfest"
# Port: from the environment, else the one saved by the last deploy, else 3210
saved_port() { if [[ -f .env ]]; then sed -n 's/^APP_PORT=//p' .env; fi; }
APP_PORT="${APP_PORT:-$(saved_port)}"
APP_PORT="${APP_PORT:-3210}"
TRIAL_PORT="${TRIAL_PORT:-3211}"

if docker compose version >/dev/null 2>&1; then
  dc() { docker compose -p hacktoberfest "$@"; }
elif command -v docker-compose >/dev/null 2>&1; then
  dc() { docker-compose -p hacktoberfest "$@"; }
else
  echo "Docker Compose is not installed on this server." >&2
  exit 1
fi

current_tag() { if [[ -f .env ]]; then sed -n 's/^TAG=//p' .env; fi; }
previous_tag() { if [[ -f .previous-tag ]]; then cat .previous-tag; fi; }

wait_healthy() {
  local name="$1" status="starting"
  for _ in $(seq 1 45); do
    status="$(docker inspect -f '{{.State.Health.Status}}' "$name" 2>/dev/null || echo missing)"
    [[ "$status" == "healthy" ]] && return 0
    [[ "$status" == "unhealthy" || "$status" == "missing" ]] && break
    sleep 2
  done
  echo "$name is '$status'." >&2
  docker logs --tail 30 "$name" >&2 2>/dev/null || true
  return 1
}

switch_to() {
  printf 'TAG=%s\nAPP_PORT=%s\n' "$1" "$APP_PORT" >.env
  dc up -d
  wait_healthy "$CONTAINER"
}

case "${1:-}" in
  up)
    tag="${2:?usage: remote.sh up <tag>}"
    docker image inspect "$IMAGE:$tag" >/dev/null 2>&1 || {
      echo "Image $IMAGE:$tag is not on this server." >&2
      exit 1
    }
    live="$(current_tag)"

    # 1. Trial run on a spare port, same restrictions as production. The live site is untouched.
    echo "==> Trial run of $tag on 127.0.0.1:$TRIAL_PORT"
    docker rm -f "$TRIAL" >/dev/null 2>&1 || true
    docker run -d --name "$TRIAL" -p "127.0.0.1:$TRIAL_PORT:3000" \
      --read-only --tmpfs /tmp --cap-drop ALL --security-opt no-new-privileges:true \
      --memory 256m --init "$IMAGE:$tag" >/dev/null
    if ! wait_healthy "$TRIAL"; then
      docker rm -f "$TRIAL" >/dev/null 2>&1 || true
      echo "==> $tag failed its trial run. Live site unchanged (${live:-nothing deployed yet})." >&2
      exit 1
    fi
    docker rm -f "$TRIAL" >/dev/null

    # 2. Switch production (a couple of seconds; Apache shows the maintenance page meanwhile).
    echo "==> Switching live site to $tag"
    if ! switch_to "$tag"; then
      if [[ -n "$live" ]]; then
        echo "==> Switch failed, restoring $live" >&2
        switch_to "$live" || echo "!! Restore failed too. Check: bash remote.sh logs" >&2
      fi
      exit 1
    fi
    if [[ -n "$live" && "$live" != "$tag" ]]; then echo "$live" >.previous-tag; fi
    echo "$tag" >>.deployed-tags

    # 3. Remove old versions of OUR image only: tags this script deployed, except the live one,
    #    the previous one, and the three most recent deploys. Nothing else is ever deleted.
    keep=" $(current_tag) $(previous_tag) $(tail -n 3 .deployed-tags | tr '\n' ' ') "
    sort -u .deployed-tags | while read -r old; do
      if [[ "$keep" != *" $old "* ]]; then
        docker rmi "$IMAGE:$old" >/dev/null 2>&1 || true
        sed -i "/^$old\$/d" .deployed-tags
      fi
    done
    echo "==> Live: $tag"
    ;;
  rollback)
    target="$(previous_tag)"
    now="$(current_tag)"
    if [[ -z "$target" ]]; then
      echo "No previous version recorded." >&2
      exit 1
    fi
    echo "==> Rolling back $now -> $target"
    switch_to "$target"
    echo "$now" >.previous-tag
    echo "==> Live: $target"
    ;;
  status)
    echo "Tag:      $(current_tag)"
    echo "Previous: $(previous_tag)"
    echo "Health:   $(docker inspect -f '{{.State.Health.Status}} (restarts: {{.RestartCount}})' "$CONTAINER" 2>/dev/null || echo 'not running')"
    ;;
  logs)
    docker logs -f --tail 100 "$CONTAINER"
    ;;
  *)
    sed -n '2,8p' "$0"
    exit 1
    ;;
esac

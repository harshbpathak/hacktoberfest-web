#!/usr/bin/env bash
# Build the site image on this machine, copy it to the server over SSH, and switch the running
# container to it. If the new version isn't healthy within 90s, the server restores the old one.
#   deploy/deploy.sh                    deploys the current commit
#   SERVER=user@host deploy/deploy.sh   different server
#   APP_PORT=3100 deploy/deploy.sh      if port 3000 is taken on the server (remembered after)
set -euo pipefail

SERVER="${SERVER:-gdg@14.139.56.17}"
REMOTE_DIR="hacktoberfest"
IMAGE="gdg-hacktoberfest"

cd "$(dirname "$0")/.."

if [[ -n "$(git status --porcelain)" ]]; then
  echo "You have uncommitted changes. Commit first so every deploy maps to a git commit." >&2
  exit 1
fi
TAG="$(git rev-parse --short HEAD)"

echo "==> Building $IMAGE:$TAG"
docker build --platform linux/amd64 -t "$IMAGE:$TAG" .

echo "==> Copying deploy files to $SERVER:~/$REMOTE_DIR"
ssh "$SERVER" "mkdir -p ~/$REMOTE_DIR"
scp -q -r deploy/compose.yaml deploy/remote.sh deploy/server-setup.sh deploy/apache deploy/maintenance \
  "$SERVER:~/$REMOTE_DIR/"

echo "==> Uploading image (about 60 MB compressed)"
docker save "$IMAGE:$TAG" | gzip | ssh "$SERVER" "gunzip | docker load"

echo "==> Switching to $TAG"
ssh "$SERVER" "${APP_PORT:+APP_PORT=$APP_PORT }bash ~/$REMOTE_DIR/remote.sh up $TAG"

#!/usr/bin/env bash
# One-time Apache setup for gdg.nith.ac.in (event site). Run ON THE SERVER, as root:
#   sudo bash ~/hacktoberfest/server-setup.sh
# Safe for the other sites on this Apache: it only adds one site, checks the whole config before
# reloading, and reloads gracefully (open connections finish, nothing restarts).
set -euo pipefail

DOMAIN="gdg.nith.ac.in"
HERE="$(cd "$(dirname "$0")" && pwd)"

if [[ $EUID -ne 0 ]]; then
  echo "Run with sudo: sudo bash $0" >&2
  exit 1
fi

echo "==> Enabling Apache modules this site needs (proxy, proxy_http, headers)"
# These only take effect where a site uses them, so other sites behave exactly as before.
a2enmod -q proxy proxy_http headers

echo "==> Installing maintenance page"
install -d -m 755 /var/www/hacktoberfest-maintenance
install -m 644 "$HERE/maintenance/index.html" /var/www/hacktoberfest-maintenance/index.html

echo "==> Installing site config"
install -m 644 "$HERE/apache/$DOMAIN.conf" "/etc/apache2/sites-available/$DOMAIN.conf"
a2ensite -q "$DOMAIN"

echo "==> Checking the full Apache config"
if ! apache2ctl configtest; then
  echo "Config test failed; disabling $DOMAIN so the other sites keep working." >&2
  a2dissite -q "$DOMAIN"
  exit 1
fi

echo "==> Graceful reload"
systemctl reload apache2

echo "Done. Test from the server: curl -sI -H 'Host: $DOMAIN' http://127.0.0.1/"

#!/usr/bin/env bash
# Switch the server back to the previously deployed version (takes a few seconds).
set -euo pipefail
SERVER="${SERVER:-gdg@14.139.56.17}"
ssh "$SERVER" "bash ~/hacktoberfest/remote.sh rollback"

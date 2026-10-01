# Deploying hacktoberfest.gdg.nith.ac.in

The site runs as a Docker container on the GDG server (`14.139.56.17`). The server's existing
Apache handles HTTPS and forwards `hacktoberfest.gdg.nith.ac.in` to the container, which only
listens on `127.0.0.1:3000`.

```
Visitor ── HTTPS ──▶ Apache (80/443, certificate) ──▶ 127.0.0.1:3000 ──▶ container gdg-hacktoberfest
```

## What the deploy touches on the server

| Touches                                                                                                             | Never touches                                                                                    |
| ------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------ |
| `~/hacktoberfest/` in the `gdg` user's home                                                                         | Other users' files                                                                               |
| The container `gdg-hacktoberfest` (and a short-lived `gdg-hacktoberfest-trial`)                                     | Any other container, volume or network                                                           |
| Images named `gdg-hacktoberfest:*`; old ones it deployed itself are removed, keeping the last 3                     | Any other image (no `docker system prune`)                                                       |
| One Apache site, `hacktoberfest.gdg.nith.ac.in`, plus `/var/www/hacktoberfest-maintenance/` (one-time `sudo` setup) | Other Apache sites; Apache is checked with `configtest` and reloaded gracefully, never restarted |

## Safety built in

- **Trial run first.** Each new version starts on `127.0.0.1:3001` with production limits. The live
  site only switches if the trial passes its health check, so a broken build never reaches visitors.
- **Self-healing.** The container restarts after a crash or a server reboot, and Docker checks
  the home page every 30 seconds.
- **Contained.** 256 MB memory and half a CPU at most, read-only filesystem, non-root user, no Linux
  capabilities, logs capped at 30 MB.
- **Maintenance page.** During the couple of seconds a switch takes, or if the container is down,
  Apache shows a "back in a minute" page instead of an error.
- **Rollback.** One command returns to the previous version in a few seconds.

## One-time setup

1. **DNS (NITH Computer Centre).** An A record `hacktoberfest.gdg.nith.ac.in → 14.139.56.17`
   (or a wildcard `*.gdg.nith.ac.in`). Check: `dig +short hacktoberfest.gdg.nith.ac.in`.
2. **SSH key from the deploying laptop** (asks for the `gdg` password once):
   ```bash
   ssh-copy-id -i ~/.ssh/id_ed25519.pub gdg@14.139.56.17
   ```
3. **Docker access without sudo** (if `docker ps` fails as `gdg`): `sudo usermod -aG docker gdg`,
   then log out and back in.
4. **First deploy** from the laptop: `deploy/deploy.sh`. This also copies the setup files to
   `~/hacktoberfest/` on the server.
5. **Apache site** (on the server):
   ```bash
   sudo bash ~/hacktoberfest/server-setup.sh
   ```
6. **HTTPS**, once DNS resolves (on the server):
   ```bash
   sudo certbot --apache -d hacktoberfest.gdg.nith.ac.in --redirect
   sudo certbot renew --dry-run
   ```
7. **Uptime monitor.** Add `https://hacktoberfest.gdg.nith.ac.in` to a free monitor such as
   UptimeRobot, with email alerts to gdg@nith.ac.in.

## Everyday use

Commit your change, then from the repo on the laptop:

```bash
deploy/deploy.sh      # build, upload, trial-run, switch
deploy/rollback.sh    # back to the previous version
```

On the server (no laptop needed):

```bash
bash ~/hacktoberfest/remote.sh status     # running version and health
bash ~/hacktoberfest/remote.sh logs       # follow logs
bash ~/hacktoberfest/remote.sh rollback   # previous version
```

## Troubleshooting

| Symptom                              | Check                                                                           |
| ------------------------------------ | ------------------------------------------------------------------------------- |
| Maintenance page stays up            | `bash ~/hacktoberfest/remote.sh status`, then `logs`                            |
| Apache error for the domain          | `sudo tail -50 /var/log/apache2/hacktoberfest-error.log`                        |
| Deploy says "failed its trial run"   | The live site is unchanged; read the logs it printed, fix, commit, deploy again |
| Certificate problems                 | `sudo certbot certificates` and `sudo certbot renew --dry-run`                  |
| Port 3000 already used on the server | `APP_PORT=3100 deploy/deploy.sh` and change the port in the Apache site file    |

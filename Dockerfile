# syntax=docker/dockerfile:1.7

# ---- Build: install from bun.lock, build a self-hosted Node server ----
FROM node:22-bookworm-slim AS build
COPY --from=oven/bun:1.3-slim /usr/local/bin/bun /usr/local/bin/bun
WORKDIR /app
COPY package.json bun.lock bunfig.toml ./
RUN bun install --frozen-lockfile
COPY . .
# Nitro's standalone Node server instead of the default Cloudflare Workers target
ENV NITRO_PRESET=node-server
RUN npm run build

# ---- Runtime: only the bundled server output (no node_modules needed) ----
FROM node:22-alpine AS runtime
ENV NODE_ENV=production \
    HOST=0.0.0.0 \
    PORT=3000
WORKDIR /app
COPY --from=build --chown=node:node /app/.output ./.output
USER node
EXPOSE 3000
HEALTHCHECK --interval=30s --timeout=5s --start-period=15s --retries=3 \
  CMD wget -q -O /dev/null http://127.0.0.1:3000/ || exit 1
CMD ["node", ".output/server/index.mjs"]

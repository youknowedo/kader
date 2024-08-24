# Use the official Bun image
FROM oven/bun:1-alpine AS base

WORKDIR /apps/server
COPY . .

# Install dependencies
FROM base AS install
RUN bun install --frozen-lockfile

WORKDIR /

FROM base AS build
RUN bun run build:server

ENV NODE_ENV=production
USER bun
EXPOSE 3000/tcp
ENTRYPOINT [ "bun", "run", "start:server" ]

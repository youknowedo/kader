# Use the official Bun image
FROM oven/bun:1-alpine AS base

WORKDIR /

# Install dependencies
FROM base AS install
COPY package.json bun.lockb ./
RUN bun install --frozen-lockfile

# Copy source code
FROM base AS prerelease
COPY --from=install /apps/server/node_modules node_modules
COPY . .

# Final stage
FROM base AS release
COPY --from=install /apps/server/node_modules node_modules
COPY --from=prerelease /apps/server .

# Run the app
ENV NODE_ENV=production
USER bun
EXPOSE 3000/tcp
ENTRYPOINT [ "bun", "run", "start" ]

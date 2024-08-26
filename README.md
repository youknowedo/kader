# Kader

This is an official starter Turborepo.

### Apps and Packages

-   [`app`](./apps/app/): PWA-enabled offline first SvelteKit app for QR generation and scanning
-   [`server`](./apps/server/): API using ExpressJS and tRPC
-   [`web`](./apps/web/): SvelteKit website and dashboard
-   [`@kader/shared`](./packages/shared/): Shared functions and types
-   [`@kader/ui`](./packages/ui/): Shared Svelte components, mainly customized [shadcn-svelte](https://www.shadcn-svelte.com/) components

## Requirements

-   [PostgreSQL](https://www.postgresql.org/) database
-   [MinIO](https://min.io/) instance: Hosts all of the images

## How to run

### Development

-   Rename [`server/.env.example`](./apps/server/.env.example) to `.env`
-   Fill in database and MinIO credentials
-   Run `bun i` and `bun dev`, or equivalent in [root](./)
-   Open localhost port [:3001](http://localhost:3001) for [app](./apps/app/) and [:3002](http://localhost:3001) for web. The API is hosted on port [:3000](http://localhost:3000)

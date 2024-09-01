Made for Hack Club Arcade with GitHub Copilot as an assistant

# Kader

Offline first membership identification app. Enables vendors to identify real members and what benefits they are entitled to.

## Confessions

Used GitHub Copilot as an assistant and followed [lucia auth](https://lucia-auth.com/guides/email-and-password/) guides for some functionalities.

### Apps and Packages

-   [`app`](./apps/app/): PWA-enabled offline first SvelteKit app for QR generation and scanning
-   [`server`](./apps/server/): API using ExpressJS and tRPC
-   [`web`](./apps/web/): SvelteKit website and dashboard
-   [`@kader/shared`](./packages/shared/): Shared functions and types
-   [`@kader/ui`](./packages/ui/): Shared Svelte components, mainly customized [shadcn-svelte](https://www.shadcn-svelte.com/) components

### Requirements

-   [PostgreSQL](https://www.postgresql.org/) database
-   [MinIO](https://min.io/) instance: Hosts all of the images
-   [Bun](https://bun.sh/): Used as package manager and for building

## How to run

### Development

-   Rename [`server/.env.example`](./apps/server/.env.example) to `.env`
-   Fill in database and MinIO credentials
-   Run `bun i` and `bun dev`, or equivalent in [root](./)
-   Open localhost port [:3001](http://localhost:3001) for [app](./apps/app/) and [:3002](http://localhost:3001) for [web](./apps/web). The [server API](./apps/server) is hosted on port [:3000](http://localhost:3000)

### Production

-   Rename [`server/.env.example`](./apps/server/.env.example) to `.env`
-   Fill in database and MinIO credentials and app and/or web urls
-   Rename [`app/.env.example`](./apps/app/.env.example) and [`web/.env.example`](./apps/web/.env.example) to `.env`
-   Fill in the server API URL
-   Run `bun i` and `bun run build`, or equivalent in [root](./)

## License

Licensed under the [MIT License](./LICENSE).

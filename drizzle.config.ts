import { defineConfig } from 'drizzle-kit';

export default defineConfig({
	schema: ['./src/lib/schema.ts', './node_modules/@youknowedo/shared/dist/server/schema.js'],
	out: './drizzle',
	dialect: 'postgresql',
	dbCredentials: {
		url: process.env.POSTGRES_URL ?? ''
	}
});

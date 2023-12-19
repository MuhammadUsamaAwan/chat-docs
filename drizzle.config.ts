import type { Config } from 'drizzle-kit';

export default {
  schema: './src/db/schema.ts',
  driver: 'better-sqlite',
  out: './drizzle',
  dbCredentials: {
    url: 'sqlite.db',
  },
} satisfies Config;

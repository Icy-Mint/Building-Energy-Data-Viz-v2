import type { Config } from 'drizzle-kit';

// For Drizzle migrations, use DATABASE_URL if provided, otherwise construct from Supabase env vars
// DATABASE_URL should be in format: postgresql://postgres.[project-ref]:[password]@aws-0-[region].pooler.supabase.com:6543/postgres
// Or direct: postgresql://postgres:[password]@db.[project-ref].supabase.co:5432/postgres
const connectionString = process.env.DATABASE_URL;

if (!connectionString) {
  throw new Error('DATABASE_URL environment variable is required for Drizzle migrations. See README for setup instructions.');
}

export default {
  schema: './db/schema.ts',
  out: './drizzle',
  dialect: 'postgresql',
  dbCredentials: {
    url: connectionString,
  },
} satisfies Config;


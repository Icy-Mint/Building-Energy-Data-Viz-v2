import { drizzle } from 'drizzle-orm/node-postgres';
import { Pool } from 'pg';
import * as schema from './schema';

// Use DATABASE_URL if provided, otherwise construct from Supabase env vars
// For Supabase, you can use either:
// 1. Connection pooler: postgresql://postgres.[project-ref]:[password]@aws-0-[region].pooler.supabase.com:6543/postgres
// 2. Direct connection: postgresql://postgres:[password]@db.[project-ref].supabase.co:5432/postgres
// 
// To get your connection string:
// 1. Go to Supabase Dashboard > Settings > Database
// 2. Copy the connection string under "Connection string" > "URI"
// 3. Replace [YOUR-PASSWORD] with your database password or service role key
// 4. Set it as DATABASE_URL in .env.local

const connectionString = process.env.DATABASE_URL;

if (!connectionString) {
  throw new Error(
    'DATABASE_URL environment variable is required. ' +
    'Set it in .env.local with your Supabase PostgreSQL connection string.'
  );
}

const pool = new Pool({
  connectionString,
  ssl: {
    rejectUnauthorized: false,
  },
});

export const db = drizzle(pool, { schema });


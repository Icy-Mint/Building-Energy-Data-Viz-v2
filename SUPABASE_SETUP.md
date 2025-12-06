# Supabase Setup Guide

This document outlines the setup steps required for the database layer integration.

## 1. Environment Variables

Add the following environment variables to your `.env.local` file:

```env
# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=https://[your-project-ref].supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key_here
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key_here

# Database Connection String
# Get this from Supabase Dashboard > Settings > Database > Connection string (URI)
# Replace [YOUR-PASSWORD] with your database password or service role key
DATABASE_URL=postgresql://postgres:[YOUR-PASSWORD]@db.[your-project-ref].supabase.co:5432/postgres

# Alternative: Use connection pooler (recommended for production)
# DATABASE_URL=postgresql://postgres.[your-project-ref]:[YOUR-PASSWORD]@aws-0-[region].pooler.supabase.com:6543/postgres
```

### How to Get Your Connection String:

1. Go to your Supabase project dashboard
2. Navigate to **Settings** > **Database**
3. Under **Connection string**, select **URI**
4. Copy the connection string
5. Replace `[YOUR-PASSWORD]` with your database password (found in the same section) or service role key

## 2. Create Storage Bucket

1. Go to **Storage** in your Supabase dashboard
2. Click **New bucket**
3. Name: `csv_uploads`
4. Set as **Public** (or Private with RLS policies - see below)
5. Click **Create bucket**

## 3. Run Database Migrations

After installing dependencies, run Drizzle migrations to create the database tables:

```bash
# Install dependencies first
npm install

# Generate migration files
npx drizzle-kit generate

# Apply migrations to your database
npx drizzle-kit push
```

Or use Drizzle Studio to inspect your database:

```bash
npx drizzle-kit studio
```

## 4. Row Level Security (RLS) Policies

### For the `files` table:

```sql
-- Enable RLS
ALTER TABLE files ENABLE ROW LEVEL SECURITY;

-- Policy: Users can only see their own files
CREATE POLICY "Users can view own files"
ON files FOR SELECT
USING (auth.uid() = user_id);

-- Policy: Users can insert their own files
CREATE POLICY "Users can insert own files"
ON files FOR INSERT
WITH CHECK (auth.uid() = user_id);

-- Policy: Users can update their own files
CREATE POLICY "Users can update own files"
ON files FOR UPDATE
USING (auth.uid() = user_id);

-- Policy: Users can delete their own files
CREATE POLICY "Users can delete own files"
ON files FOR DELETE
USING (auth.uid() = user_id);
```

### For the `dashboards` table:

```sql
-- Enable RLS
ALTER TABLE dashboards ENABLE ROW LEVEL SECURITY;

-- Policy: Users can only see their own dashboards
CREATE POLICY "Users can view own dashboards"
ON dashboards FOR SELECT
USING (auth.uid() = user_id);

-- Policy: Users can insert their own dashboards
CREATE POLICY "Users can insert own dashboards"
ON dashboards FOR INSERT
WITH CHECK (auth.uid() = user_id);

-- Policy: Users can update their own dashboards
CREATE POLICY "Users can update own dashboards"
ON dashboards FOR UPDATE
USING (auth.uid() = user_id);

-- Policy: Users can delete their own dashboards
CREATE POLICY "Users can delete own dashboards"
ON dashboards FOR DELETE
USING (auth.uid() = user_id);
```

### For the `users` table:

```sql
-- Enable RLS
ALTER TABLE users ENABLE ROW LEVEL SECURITY;

-- Policy: Users can view their own profile
CREATE POLICY "Users can view own profile"
ON users FOR SELECT
USING (auth.uid() = id);

-- Policy: Users can update their own profile
CREATE POLICY "Users can update own profile"
ON users FOR UPDATE
USING (auth.uid() = id);
```

## 5. Storage Bucket Policies (if using Private bucket)

If you set the `csv_uploads` bucket as Private, add these policies:

```sql
-- Policy: Users can upload files to their own folder
CREATE POLICY "Users can upload own files"
ON storage.objects FOR INSERT
WITH CHECK (
  bucket_id = 'csv_uploads' AND
  (storage.foldername(name))[1] = auth.uid()::text
);

-- Policy: Users can view their own files
CREATE POLICY "Users can view own files"
ON storage.objects FOR SELECT
USING (
  bucket_id = 'csv_uploads' AND
  (storage.foldername(name))[1] = auth.uid()::text
);

-- Policy: Users can delete their own files
CREATE POLICY "Users can delete own files"
ON storage.objects FOR DELETE
USING (
  bucket_id = 'csv_uploads' AND
  (storage.foldername(name))[1] = auth.uid()::text
);
```

## 6. Authentication Integration

The current implementation uses a placeholder for user ID. You need to integrate your authentication system:

### Option A: Supabase Auth

If using Supabase Auth, update `lib/upload.ts`:

```typescript
import { createClient } from '@supabase/supabase-js';

export async function getCurrentUserId(): Promise<string | null> {
  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );
  
  const { data: { user } } = await supabase.auth.getUser();
  return user?.id || null;
}
```

### Option B: BetterAuth

If using BetterAuth, update `lib/upload.ts`:

```typescript
import { auth } from '@/lib/auth'; // Adjust path as needed

export async function getCurrentUserId(): Promise<string | null> {
  const session = await auth();
  return session?.user?.id || null;
}
```

Then update `components/Upload.tsx` to use the auth function:

```typescript
// Replace the placeholder userId line with:
const userId = await getCurrentUserId();
```

## 7. Testing

1. Start your development server: `npm run dev`
2. Navigate to the upload page
3. Upload a CSV file
4. Check Supabase Storage to verify the file was uploaded
5. Check the `files` table in Supabase to verify metadata was saved

## Troubleshooting

### Connection Issues

- Verify your `DATABASE_URL` is correct
- Check that your Supabase project is active
- Ensure your IP is allowed (if IP restrictions are enabled)

### RLS Policy Errors

- Make sure RLS is enabled on all tables
- Verify policies are created correctly
- Check that `auth.uid()` matches the `user_id` in your tables

### Storage Upload Failures

- Verify the bucket name is exactly `csv_uploads`
- Check bucket permissions (Public vs Private)
- Ensure storage policies are set if using Private bucket

### Migration Issues

- Make sure you're using the correct database connection string
- Verify Drizzle schema matches your database structure
- Check for any existing tables that might conflict


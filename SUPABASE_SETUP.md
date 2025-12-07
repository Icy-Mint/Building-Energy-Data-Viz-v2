# Supabase Setup Guide

This document outlines the setup steps required for the database layer integration.

> **Note**: All SQL files referenced in this guide are located in the `db/` folder:
> - `db/supabase-schema.sql` - Database table creation
> - `db/supabase-rls-policies.sql` - Row Level Security policies

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

## 3. Create Database Tables

You have two options to create the database tables:

### Option A: Using SQL Files (Recommended)

1. Open Supabase Dashboard > **SQL Editor**
2. Copy and paste the contents of `db/supabase-schema.sql`
3. Click **Run** to create all tables
4. Run the verification queries at the bottom of the file to confirm tables were created

### Option B: Using Drizzle Migrations

After installing dependencies, run Drizzle migrations:

```bash
# Install dependencies first
npm install

# Generate migration files
npm run db:generate

# Apply migrations to your database
npm run db:push
```

Or use Drizzle Studio to inspect your database:

```bash
npm run db:studio
```

> **Note**: The SQL files in `db/` folder are ready to use and include verification queries. This is the recommended approach for initial setup.

## 4. Row Level Security (RLS) Policies

After creating the tables, you need to enable RLS policies. The complete SQL script is available in `db/supabase-rls-policies.sql`.

**To apply RLS policies:**

1. Open Supabase Dashboard > **SQL Editor**
2. Copy and paste the contents of `db/supabase-rls-policies.sql`
3. Click **Run** to enable all RLS policies

The script includes:
- RLS policies for `files` table (SELECT, INSERT, UPDATE, DELETE)
- RLS policies for `dashboards` table (SELECT, INSERT, UPDATE, DELETE)
- RLS policies for `users` table (SELECT, UPDATE)
- Storage bucket policies (if using Private bucket)

> **Note**: All policies ensure users can only access their own data using `auth.uid() = user_id` checks.

## 5. Storage Bucket Policies (if using Private bucket)

If you set the `csv_uploads` bucket as Private, storage policies are included in `db/supabase-rls-policies.sql`. The policies ensure:
- Users can upload files to their own folder (`{userId}/filename.csv`)
- Users can only view their own files
- Users can only delete their own files

> **Note**: If using a Public bucket, storage policies are not required. The application uses service role key for uploads, which bypasses RLS.

## 6. Authentication Integration

✅ **Authentication is already integrated!** The project uses Supabase Auth with:

- **Client-side auth** (`lib/supabase/client.ts`): For React components
- **Server-side auth** (`lib/supabase/auth.ts`): For API routes
- **Automatic user ID retrieval**: Both Upload component and API routes use auth

### Enable Supabase Authentication

1. Go to Supabase Dashboard > **Authentication** > **Providers**
2. Enable **Email** provider
3. Configure email templates if needed

### Sync Auth Users to Database (Recommended)

To automatically create user records when users sign up, run this SQL in Supabase SQL Editor:

```sql
-- Function to handle new user creation
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.users (id, email, created_at)
  VALUES (NEW.id, NEW.email, NOW())
  ON CONFLICT (id) DO NOTHING;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger to call function on new auth user
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();
```

This ensures that when a user signs up via Supabase Auth, a corresponding record is created in your `users` table.

See `AUTH_SETUP.md` for detailed authentication usage and examples.

## 7. Testing

1. **Test database connection**:
   ```bash
   npm run dev
   # Visit http://localhost:3000/api/test-db
   # Should return JSON with database connection status
   ```

2. **Test authentication** (if you have a login page):
   - Sign up or sign in with a test account
   - Verify user appears in Supabase Dashboard > Authentication > Users

3. **Test file upload**:
   - Navigate to the upload page (`/upload`)
   - Sign in if not already authenticated
   - Upload a CSV file
   - Check Supabase Storage to verify the file was uploaded
   - Check the `files` table in Supabase to verify metadata was saved

4. **Verify RLS policies**:
   - Try accessing files from a different user account
   - Should only see your own files

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


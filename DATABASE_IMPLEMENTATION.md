# Database Layer Implementation Summary

This document summarizes the database layer implementation for the Energy Analysis Viz project.

## Files Created

### Database Schema & Configuration

1. **`db/schema.ts`** - Drizzle ORM schema definitions
   - `users` table: User accounts
   - `files` table: CSV file metadata
   - `dashboards` table: Dashboard configurations and insights

2. **`db/index.ts`** - Database connection instance
   - Exports `db` instance using Drizzle with PostgreSQL
   - Uses connection pooling for performance

3. **`drizzle.config.ts`** - Drizzle Kit configuration
   - Configured for PostgreSQL
   - Uses `DATABASE_URL` environment variable

### Supabase Integration

4. **`lib/supabase/server.ts`** - Supabase server-side client
   - `supabaseAdmin`: Service role client (bypasses RLS)
   - `supabaseClient`: Anon key client (respects RLS)

### API Routes

5. **`app/api/upload/route.ts`** - File upload API endpoint
   - `POST /api/upload`: Upload CSV files to Supabase Storage and save metadata
   - `GET /api/upload?userId=...`: Retrieve user's uploaded files
   - Handles file validation, storage upload, and database insertion
   - Includes error handling and cleanup on failure

### Helper Functions

6. **`lib/upload.ts`** - Client-side upload helper
   - `uploadCsvFile()`: Upload file and get metadata
   - Re-exports `getCurrentUserId()` and `getCurrentUser()` from auth helpers

### Authentication

7. **`lib/supabase/client.ts`** - Client-side auth helpers
   - `getCurrentUserId()`: Gets authenticated user ID (browser)
   - `getCurrentUser()`: Gets authenticated user object (browser)
   - `signIn()`, `signUp()`, `signOut()`: Auth functions

8. **`lib/supabase/auth.ts`** - Server-side auth helpers
   - `getCurrentUserId()`: Gets authenticated user ID from session (server)
   - `getCurrentUser()`: Gets authenticated user from session (server)

### Documentation

7. **`SUPABASE_SETUP.md`** - Complete setup guide
   - Environment variable configuration
   - Storage bucket setup
   - RLS policy SQL scripts
   - Authentication integration examples

## Files Modified

1. **`components/Upload.tsx`**
   - Added upload status tracking (uploading/success/error)
   - Integrated `uploadCsvFile()` helper function
   - Uses `getCurrentUserId()` for authentication
   - Shows error if user is not authenticated
   - Added UI feedback for upload status
   - Maintains backward compatibility with existing sessionStorage workflow

2. **`app/api/upload/route.ts`**
   - Updated to use server-side `getCurrentUserId()` for authentication
   - Verifies authentication before processing uploads
   - Returns 401 if user is not authenticated
   - More secure - doesn't trust client-provided userId

3. **`package.json`**
   - Added dependencies:
     - `@supabase/supabase-js`: Supabase client library
     - `drizzle-orm`: ORM for database operations
     - `pg`: PostgreSQL client
     - `dotenv`: Environment variable loading
   - Added dev dependencies:
     - `drizzle-kit`: Database migration tool
     - `@types/pg`: TypeScript types for PostgreSQL
   - Added scripts:
     - `npm run db:generate`: Generate migration files
     - `npm run db:push`: Apply migrations to database
     - `npm run db:studio`: Open Drizzle Studio

## Database Schema

### `users` Table
```typescript
{
  id: string (primary key)        // User ID from auth system
  email: string                    // User email
  createdAt: timestamp            // Account creation date
}
```

### `files` Table
```typescript
{
  id: serial (primary key)        // Auto-incrementing file ID
  userId: string (foreign key)    // References users.id
  fileName: string                 // Original file name
  filePath: string                 // Path in Supabase Storage
  fileSize: number                 // File size in bytes
  uploadedAt: timestamp           // Upload timestamp
}
```

### `dashboards` Table
```typescript
{
  id: serial (primary key)        // Auto-incrementing dashboard ID
  userId: string (foreign key)    // References users.id
  fileId: number (foreign key)     // References files.id
  title: string                   // Dashboard title
  insights: jsonb                 // AI-generated insights (optional)
  createdAt: timestamp           // Creation timestamp
}
```

## Workflow

1. **User uploads CSV file**
   - User must be authenticated (signed in)
   - File selected in Upload component
   - On form submit, `getCurrentUserId()` verifies authentication
   - `uploadCsvFile()` is called (no userId parameter needed)
   - API route verifies authentication server-side
   - File is uploaded to Supabase Storage bucket `csv_uploads`
   - File metadata is inserted into `files` table with authenticated user ID
   - File ID is stored in sessionStorage for dashboard reference

2. **File storage structure**
   - Files stored at: `{userId}/{timestamp}-{filename}.csv`
   - Enables user-specific file organization
   - Supports RLS policies for access control

3. **Dashboard creation** (future)
   - Dashboard records can reference uploaded files via `file_id`
   - Insights can be stored as JSON in `insights` column

## Security Considerations

### Row Level Security (RLS)

All tables have RLS policies that ensure:
- Users can only access their own files (`files.user_id = auth.uid()`)
- Users can only access their own dashboards (`dashboards.user_id = auth.uid()`)
- Users can only view their own profile (`users.id = auth.uid()`)

See `SUPABASE_SETUP.md` for complete RLS policy SQL scripts.

### API Route Security

- The upload API route uses `supabaseAdmin` (service role) for storage operations
- Authentication is verified server-side using `getCurrentUserId()` from `lib/supabase/auth.ts`
- User ID is retrieved from auth session (cookies), not from request body
- Returns 401 Unauthorized if user is not authenticated
- RLS policies ensure users can only access their own data

## Next Steps

### Required Setup

1. **Install dependencies**:
   ```bash
   npm install
   ```

2. **Configure environment variables** (see `SUPABASE_SETUP.md`):
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - `SUPABASE_SERVICE_ROLE_KEY`
   - `DATABASE_URL`

3. **Create Supabase Storage bucket**:
   - Name: `csv_uploads`
   - Set as Public or Private (with RLS policies)

4. **Run database migrations**:
   ```bash
   npm run db:push
   ```

5. **Set up RLS policies** (see `SUPABASE_SETUP.md` for SQL scripts)

### Integration Tasks

1. **Enable Supabase Authentication**:
   - Go to Supabase Dashboard > Authentication > Providers
   - Enable Email provider
   - See `AUTH_SETUP.md` for detailed setup

2. **Sync Auth Users** (Optional but recommended):
   - Run the database trigger SQL to auto-create user records
   - See `SUPABASE_SETUP.md` section 6 for SQL script

3. **Dashboard creation**:
   - Create API route to save dashboard records
   - Link dashboards to uploaded files
   - Store AI-generated insights

## Testing

1. **Test database connection**:
   ```bash
   npm run dev
   # Visit http://localhost:3000/api/test-db
   ```

2. **Test authentication**:
   - Create a test user in Supabase Dashboard or use sign-up
   - Sign in to the application
   - Verify user ID is retrieved correctly

3. **Test file upload**:
   - Navigate to `/upload` page (must be authenticated)
   - Upload a CSV file
   - Verify:
     - File appears in Supabase Storage
     - Metadata appears in `files` table with correct user_id
     - Upload status shows success in UI
     - File ID is stored in sessionStorage

4. **Test RLS policies**:
   - Sign in as different user
   - Try to access files - should only see own files

## Production Deployment

### Vercel Environment Variables

Add all environment variables to Vercel dashboard:
- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- `SUPABASE_SERVICE_ROLE_KEY`
- `DATABASE_URL`

### Database Migrations

Run migrations before deploying:
```bash
npm run db:push
```

Or use Drizzle migrations in CI/CD pipeline.

### Storage Bucket

Ensure `csv_uploads` bucket exists in production Supabase project.

## Architecture Decisions

1. **Drizzle ORM**: Chosen for type safety and excellent TypeScript support
2. **Supabase Storage**: Integrated file storage with built-in CDN
3. **Connection Pooling**: Using Supabase connection pooler for better performance
4. **RLS Policies**: Database-level security for multi-tenant data isolation
5. **Backward Compatibility**: Existing sessionStorage workflow still works alongside new database storage

## Notes

- **Authentication is fully integrated** - Users must be logged in to upload files
- The implementation maintains backward compatibility with the existing sessionStorage-based workflow
- Files are stored in Supabase Storage AND processed locally for immediate dashboard viewing
- The `files` table serves as a permanent record of uploaded files
- User ID is retrieved from auth session on both client and server for security
- RLS policies ensure data isolation between users
- Future enhancements can include file versioning, sharing, and advanced dashboard management

## Related Documentation

- **[SUPABASE_SETUP.md](../SUPABASE_SETUP.md)**: Complete Supabase setup guide
- **[AUTH_SETUP.md](../AUTH_SETUP.md)**: Authentication setup and usage guide
- **[README.md](../README.md)**: Main project documentation


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
   - `getCurrentUserId()`: Placeholder for auth integration (TODO)

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
   - Added UI feedback for upload status
   - Maintains backward compatibility with existing sessionStorage workflow

2. **`package.json`**
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
   - File selected in Upload component
   - On form submit, `uploadCsvFile()` is called
   - File is uploaded to Supabase Storage bucket `csv_uploads`
   - File metadata is inserted into `files` table
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
- In production, add authentication middleware to verify user identity
- Currently accepts `userId` from request - should be replaced with session-based auth

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

1. **Replace placeholder user ID**:
   - Update `components/Upload.tsx` line with `const userId = 'temp-user-id'`
   - Replace with actual auth implementation (see `lib/upload.ts` for examples)

2. **Add authentication middleware**:
   - Verify user identity in API routes
   - Get userId from auth session instead of request body

3. **Dashboard creation**:
   - Create API route to save dashboard records
   - Link dashboards to uploaded files
   - Store AI-generated insights

## Testing

1. Start development server: `npm run dev`
2. Navigate to `/upload` page
3. Upload a CSV file
4. Verify:
   - File appears in Supabase Storage
   - Metadata appears in `files` table
   - Upload status shows success in UI
   - File ID is stored in sessionStorage

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

- The implementation maintains backward compatibility with the existing sessionStorage-based workflow
- Files are stored in Supabase Storage AND processed locally for immediate dashboard viewing
- The `files` table serves as a permanent record of uploaded files
- Future enhancements can include file versioning, sharing, and advanced dashboard management


# Authentication Setup Guide

This guide explains how to set up and use Supabase Authentication in your Energy Analysis Viz application.

## Overview

The authentication system uses Supabase Auth with separate client-side and server-side helpers:

- **Client-side** (`lib/supabase/client.ts`): For React components in the browser
- **Server-side** (`lib/supabase/auth.ts`): For API routes and server components

## Files Created

1. **`lib/supabase/client.ts`** - Client-side auth helpers
   - `createBrowserClient()`: Creates Supabase client for browser
   - `getCurrentUserId()`: Gets authenticated user ID
   - `getCurrentUser()`: Gets authenticated user object
   - `signIn()`: Sign in with email/password
   - `signUp()`: Sign up with email/password
   - `signOut()`: Sign out current user

2. **`lib/supabase/auth.ts`** - Server-side auth helpers
   - `createServerClient()`: Creates Supabase client for server
   - `getCurrentUserId()`: Gets authenticated user ID from session
   - `getCurrentUser()`: Gets authenticated user from session

## Setup Steps

### 1. Enable Supabase Authentication

1. Go to your Supabase Dashboard
2. Navigate to **Authentication** > **Providers**
3. Enable **Email** provider (or other providers you want to use)
4. Configure email templates if needed

### 2. Environment Variables

Make sure these are set in your `.env.local`:

```env
NEXT_PUBLIC_SUPABASE_URL=https://[your-project].supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key_here
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key_here
```

### 3. Update Database Schema

Ensure your `users` table is synced with Supabase Auth users. You can either:

**Option A: Use Supabase Auth users table directly**
- Supabase automatically creates an `auth.users` table
- Your `public.users` table can reference `auth.users.id`

**Option B: Sync users on signup**
- Create a database trigger or function to sync auth users to your `users` table

Example trigger (run in Supabase SQL Editor):

```sql
-- Function to handle new user creation
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.users (id, email, created_at)
  VALUES (NEW.id, NEW.email, NOW());
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger to call function on new auth user
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();
```

## Usage Examples

### Client-Side (React Components)

```typescript
'use client';

import { getCurrentUserId, signIn, signOut } from '@/lib/supabase/client';

export default function MyComponent() {
  const handleLogin = async () => {
    const { data, error } = await signIn('user@example.com', 'password');
    if (error) {
      console.error('Login error:', error);
    } else {
      console.log('Logged in:', data.user);
    }
  };

  const handleGetUserId = async () => {
    const userId = await getCurrentUserId();
    if (userId) {
      console.log('Current user ID:', userId);
    } else {
      console.log('Not logged in');
    }
  };

  return (
    <div>
      <button onClick={handleLogin}>Sign In</button>
      <button onClick={handleGetUserId}>Get User ID</button>
      <button onClick={signOut}>Sign Out</button>
    </div>
  );
}
```

### Server-Side (API Routes)

```typescript
import { getCurrentUserId } from '@/lib/supabase/auth';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  const userId = await getCurrentUserId();
  
  if (!userId) {
    return NextResponse.json(
      { error: 'Unauthorized' },
      { status: 401 }
    );
  }

  // User is authenticated, proceed with request
  return NextResponse.json({ userId });
}
```

## Integration Points

### Upload Component

The `components/Upload.tsx` component:
- ✅ Uses `getCurrentUserId()` from client-side auth (`lib/supabase/client.ts`)
- ✅ Automatically gets the authenticated user ID
- ✅ Shows error message if user is not logged in
- ✅ Prevents file upload if user is not authenticated

### Upload API Route

The `app/api/upload/route.ts` route:
- ✅ Uses `getCurrentUserId()` from server-side auth (`lib/supabase/auth.ts`)
- ✅ Verifies authentication before processing uploads
- ✅ Returns 401 Unauthorized if user is not authenticated
- ✅ Retrieves user ID from auth session (cookies), not from request body
- ✅ More secure - doesn't trust client-provided user ID

### File Upload Helper

The `lib/upload.ts` helper:
- ✅ No longer requires `userId` parameter
- ✅ Re-exports auth functions for easy import
- ✅ User ID is retrieved server-side automatically

## Creating a Login Page (Optional)

You can create a login page using the auth helpers:

```typescript
'use client';

import { useState } from 'react';
import { signIn, signUp } from '@/lib/supabase/client';
import { useRouter } from 'next/navigation';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isSignUp, setIsSignUp] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const { data, error } = isSignUp 
      ? await signUp(email, password)
      : await signIn(email, password);

    if (error) {
      alert(error.message);
    } else {
      router.push('/upload');
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <input
        type="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        placeholder="Email"
        required
      />
      <input
        type="password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        placeholder="Password"
        required
      />
      <button type="submit">
        {isSignUp ? 'Sign Up' : 'Sign In'}
      </button>
      <button type="button" onClick={() => setIsSignUp(!isSignUp)}>
        {isSignUp ? 'Already have an account?' : 'Need an account?'}
      </button>
    </form>
  );
}
```

## Security Notes

1. **Never expose service role key** - Only use `NEXT_PUBLIC_SUPABASE_ANON_KEY` in client-side code
2. **Server-side auth** - Always verify authentication in API routes using server-side helpers
3. **RLS policies** - Ensure your RLS policies are set up correctly (see `supabase-rls-policies.sql`)
4. **Session management** - Supabase handles session cookies automatically

## Testing

1. Create a test user in Supabase Dashboard > Authentication > Users
2. Or use the sign-up function in your app
3. Try uploading a file - it should work if authenticated
4. Sign out and try uploading - should show "Unauthorized" error

## Troubleshooting

### "Missing NEXT_PUBLIC_SUPABASE_URL"
- Check your `.env.local` file has the correct environment variables
- Restart your dev server after adding env vars

### "Unauthorized" errors
- Make sure user is logged in
- Check that Supabase Auth is enabled in your project
- Verify RLS policies allow the operation

### User not syncing to `users` table
- Run the database trigger SQL (see Setup Step 3)
- Or manually create user records when they sign up

## Next Steps

1. ✅ **Authentication is integrated** - The system is ready to use
2. **Create login/signup pages** - Use the example code above or build your own UI
3. **Add protected route middleware** - Protect routes that require authentication
4. **Add user profile management** - Allow users to view/edit their profile
5. **Implement password reset functionality** - Use Supabase Auth password reset
6. **Add email verification** - Configure email templates in Supabase Dashboard

## Quick Start Checklist

- [ ] Enable Email provider in Supabase Dashboard > Authentication > Providers
- [ ] Set environment variables in `.env.local`
- [ ] Run database schema (`db/supabase-schema.sql`)
- [ ] Run RLS policies (`db/supabase-rls-policies.sql`)
- [ ] Create storage bucket `csv_uploads`
- [ ] (Optional) Set up user sync trigger (see `SUPABASE_SETUP.md`)
- [ ] Test authentication with sign up/sign in
- [ ] Test file upload functionality

## Related Documentation

- **[SUPABASE_SETUP.md](../SUPABASE_SETUP.md)**: Complete Supabase setup guide
- **[DATABASE_IMPLEMENTATION.md](../DATABASE_IMPLEMENTATION.md)**: Database architecture details
- **[README.md](../README.md)**: Main project documentation


-- ============================================
-- Row Level Security (RLS) Policies
-- Energy Analysis Viz - Supabase Setup
-- ============================================
-- 
-- This file contains all RLS policies for the database tables.
-- Run this script in your Supabase SQL Editor after creating the tables.
--
-- Prerequisites:
-- 1. Tables must be created (users, files, dashboards)
-- 2. Supabase Auth must be enabled
-- ============================================

-- ============================================
-- FILES TABLE POLICIES
-- ============================================

-- Enable RLS on files table
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

-- ============================================
-- DASHBOARDS TABLE POLICIES
-- ============================================

-- Enable RLS on dashboards table
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

-- ============================================
-- USERS TABLE POLICIES
-- ============================================

-- Enable RLS on users table
ALTER TABLE users ENABLE ROW LEVEL SECURITY;

-- Policy: Users can view their own profile
CREATE POLICY "Users can view own profile"
ON users FOR SELECT
USING (auth.uid() = id);

-- Policy: Users can update their own profile
CREATE POLICY "Users can update own profile"
ON users FOR UPDATE
USING (auth.uid() = id);

-- ============================================
-- STORAGE BUCKET POLICIES (Optional)
-- ============================================
-- 
-- Only use these if you set the csv_uploads bucket as Private.
-- If the bucket is Public, these policies are not needed.
-- ============================================

-- Policy: Users can upload files to their own folder
CREATE POLICY "Users can upload own files to storage"
ON storage.objects FOR INSERT
WITH CHECK (
  bucket_id = 'csv_uploads' AND
  (storage.foldername(name))[1] = auth.uid()::text
);

-- Policy: Users can view their own files in storage
CREATE POLICY "Users can view own files in storage"
ON storage.objects FOR SELECT
USING (
  bucket_id = 'csv_uploads' AND
  (storage.foldername(name))[1] = auth.uid()::text
);

-- Policy: Users can delete their own files from storage
CREATE POLICY "Users can delete own files from storage"
ON storage.objects FOR DELETE
USING (
  bucket_id = 'csv_uploads' AND
  (storage.foldername(name))[1] = auth.uid()::text
);

-- ============================================
-- NOTES
-- ============================================
--
-- To verify policies are working:
-- 1. Test as authenticated user - should see only own data
-- 2. Test as different user - should not see other user's data
-- 3. Test unauthenticated - should not see any data
--
-- To drop all policies (if needed):
-- DROP POLICY IF EXISTS "Users can view own files" ON files;
-- DROP POLICY IF EXISTS "Users can insert own files" ON files;
-- DROP POLICY IF EXISTS "Users can update own files" ON files;
-- DROP POLICY IF EXISTS "Users can delete own files" ON files;
-- DROP POLICY IF EXISTS "Users can view own dashboards" ON dashboards;
-- DROP POLICY IF EXISTS "Users can insert own dashboards" ON dashboards;
-- DROP POLICY IF EXISTS "Users can update own dashboards" ON dashboards;
-- DROP POLICY IF EXISTS "Users can delete own dashboards" ON dashboards;
-- DROP POLICY IF EXISTS "Users can view own profile" ON users;
-- DROP POLICY IF EXISTS "Users can update own profile" ON users;
-- DROP POLICY IF EXISTS "Users can upload own files to storage" ON storage.objects;
-- DROP POLICY IF EXISTS "Users can view own files in storage" ON storage.objects;
-- DROP POLICY IF EXISTS "Users can delete own files from storage" ON storage.objects;
-- ============================================


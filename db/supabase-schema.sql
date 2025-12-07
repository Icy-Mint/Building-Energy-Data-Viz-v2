-- ============================================
-- Database Schema
-- Energy Analysis Viz - Supabase Setup
-- ============================================
-- 
-- This file creates all required database tables.
-- Run this script in your Supabase SQL Editor before running RLS policies.
--
-- Order matters: tables are created in dependency order
-- (users -> files -> dashboards)
-- ============================================

-- ============================================
-- USERS TABLE
-- ============================================

CREATE TABLE IF NOT EXISTS users (
  id TEXT PRIMARY KEY,
  email TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW()
);

-- Add index on email for faster lookups
CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);

-- ============================================
-- FILES TABLE
-- ============================================

CREATE TABLE IF NOT EXISTS files (
  id SERIAL PRIMARY KEY,
  user_id TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  file_name TEXT NOT NULL,
  file_path TEXT NOT NULL,
  file_size INTEGER NOT NULL,
  uploaded_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW()
);

-- Add indexes for better query performance
CREATE INDEX IF NOT EXISTS idx_files_user_id ON files(user_id);
CREATE INDEX IF NOT EXISTS idx_files_uploaded_at ON files(uploaded_at);

-- ============================================
-- DASHBOARDS TABLE
-- ============================================

CREATE TABLE IF NOT EXISTS dashboards (
  id SERIAL PRIMARY KEY,
  user_id TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  file_id INTEGER NOT NULL REFERENCES files(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  insights JSONB,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW()
);

-- Add indexes for better query performance
CREATE INDEX IF NOT EXISTS idx_dashboards_user_id ON dashboards(user_id);
CREATE INDEX IF NOT EXISTS idx_dashboards_file_id ON dashboards(file_id);
CREATE INDEX IF NOT EXISTS idx_dashboards_created_at ON dashboards(created_at);

-- ============================================
-- VERIFICATION QUERIES
-- Run these to confirm your tables were created
-- ============================================

-- Query 1: Check if all tables exist
SELECT table_name, table_type
FROM information_schema.tables 
WHERE table_schema = 'public' 
  AND table_name IN ('users', 'files', 'dashboards')
ORDER BY table_name;

-- Expected result: 3 rows showing users, files, dashboards

-- Query 2: Check table columns
SELECT 
  table_name,
  column_name,
  data_type,
  is_nullable
FROM information_schema.columns
WHERE table_schema = 'public'
  AND table_name IN ('users', 'files', 'dashboards')
ORDER BY table_name, ordinal_position;

-- Expected result: Shows all columns for each table

-- Query 3: Check indexes
SELECT 
  tablename,
  indexname,
  indexdef
FROM pg_indexes
WHERE schemaname = 'public'
  AND tablename IN ('users', 'files', 'dashboards')
ORDER BY tablename, indexname;

-- Expected result: Shows all indexes (idx_users_email, idx_files_user_id, etc.)

-- Query 4: Check foreign key constraints
SELECT
  tc.table_name,
  kcu.column_name,
  ccu.table_name AS foreign_table_name,
  ccu.column_name AS foreign_column_name
FROM information_schema.table_constraints AS tc
JOIN information_schema.key_column_usage AS kcu
  ON tc.constraint_name = kcu.constraint_name
JOIN information_schema.constraint_column_usage AS ccu
  ON ccu.constraint_name = tc.constraint_name
WHERE tc.constraint_type = 'FOREIGN KEY'
  AND tc.table_schema = 'public'
  AND tc.table_name IN ('users', 'files', 'dashboards')
ORDER BY tc.table_name;

-- Expected result: Shows foreign keys (files.user_id -> users.id, etc.)

-- Query 5: Quick summary
SELECT 
  'Tables created' AS status,
  COUNT(*) AS count
FROM information_schema.tables 
WHERE table_schema = 'public' 
  AND table_name IN ('users', 'files', 'dashboards');

-- Expected result: count = 3

-- ============================================
-- NOTES
-- ============================================
--
-- After running this schema:
-- 1. Run the verification queries above to confirm tables were created
-- 2. Run supabase-rls-policies.sql to enable RLS
-- 3. Create the csv_uploads storage bucket in Supabase Dashboard
--
-- IF ALL QUERIES RETURN RESULTS, YOU'RE READY FOR:
-- ✅ Step 1: Run RLS policies (supabase-rls-policies.sql)
-- ✅ Step 2: Create storage bucket (csv_uploads)
-- ✅ Step 3: Run storage policies
--
-- To drop all tables (if needed):
-- DROP TABLE IF EXISTS dashboards CASCADE;
-- DROP TABLE IF EXISTS files CASCADE;
-- DROP TABLE IF EXISTS users CASCADE;
-- ============================================


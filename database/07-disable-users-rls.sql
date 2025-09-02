-- Temporary fix: Disable RLS on users table for development
-- This allows user creation during signup
-- You can re-enable it later once everything is working

ALTER TABLE users DISABLE ROW LEVEL SECURITY;
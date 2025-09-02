-- Fix user insertion policy
-- This allows new users to be created during signup

DROP POLICY IF EXISTS "Users can insert own profile" ON users;

CREATE POLICY "Users can insert own profile" ON users FOR INSERT WITH CHECK (
  auth.uid() = id
);
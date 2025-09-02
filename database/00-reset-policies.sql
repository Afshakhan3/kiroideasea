-- Run this first to clean up any existing policies
-- This will remove all policies so we can start fresh

DO $$ 
DECLARE
    r RECORD;
BEGIN
    -- Drop all existing policies on our tables
    FOR r IN (SELECT schemaname, tablename, policyname FROM pg_policies WHERE tablename IN ('users', 'ideas', 'likes', 'comments', 'messages'))
    LOOP
        EXECUTE 'DROP POLICY IF EXISTS "' || r.policyname || '" ON ' || r.schemaname || '.' || r.tablename;
    END LOOP;
END $$;
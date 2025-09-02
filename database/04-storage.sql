-- Create storage bucket for videos (run this in Supabase Storage section, not SQL editor)
-- INSERT INTO storage.buckets (id, name, public) VALUES ('idea-videos', 'idea-videos', true);

-- Storage policies (run these in SQL editor after creating the bucket)
CREATE POLICY "Anyone can view videos" ON storage.objects FOR SELECT USING (bucket_id = 'idea-videos');
CREATE POLICY "Authenticated users can upload videos" ON storage.objects FOR INSERT WITH CHECK (
  bucket_id = 'idea-videos' AND auth.role() = 'authenticated'
);
CREATE POLICY "Users can update own videos" ON storage.objects FOR UPDATE USING (
  bucket_id = 'idea-videos' AND auth.uid()::text = (storage.foldername(name))[1]
);
CREATE POLICY "Users can delete own videos" ON storage.objects FOR DELETE USING (
  bucket_id = 'idea-videos' AND auth.uid()::text = (storage.foldername(name))[1]
);
-- Add description and image columns to projects table
ALTER TABLE projects ADD COLUMN IF NOT EXISTS description TEXT;
ALTER TABLE projects ADD COLUMN IF NOT EXISTS before_image_url TEXT;
ALTER TABLE projects ADD COLUMN IF NOT EXISTS after_image_url TEXT;

-- Create storage bucket for project images
INSERT INTO storage.buckets (id, name, public) VALUES ('project-images', 'project-images', true)
ON CONFLICT (id) DO NOTHING;

-- Allow authenticated users to upload to project-images bucket
CREATE POLICY "Users can upload project images"
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK (bucket_id = 'project-images');

-- Allow public read access to project images
CREATE POLICY "Public read access for project images"
ON storage.objects FOR SELECT
TO public
USING (bucket_id = 'project-images');

-- Allow users to delete their own project images
CREATE POLICY "Users can delete own project images"
ON storage.objects FOR DELETE
TO authenticated
USING (bucket_id = 'project-images');

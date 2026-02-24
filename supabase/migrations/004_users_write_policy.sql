-- Allow authenticated users to insert/update their own row in the users table
CREATE POLICY "Users can insert own row"
  ON users FOR INSERT
  WITH CHECK (auth.uid() = id);

CREATE POLICY "Users can update own row"
  ON users FOR UPDATE
  USING (auth.uid() = id);

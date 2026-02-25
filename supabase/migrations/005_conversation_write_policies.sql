-- Allow authenticated users to create conversations and add participants
CREATE POLICY "Allow insert" ON conversations FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow update" ON conversations FOR UPDATE USING (true);

CREATE POLICY "Allow insert" ON conversation_participants FOR INSERT WITH CHECK (true);

CREATE TABLE submissions (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  x_username TEXT NOT NULL,
  wallet_address TEXT NOT NULL,
  comment_link TEXT NOT NULL,
  referral_code TEXT NOT NULL UNIQUE,
  referred_by TEXT,
  submission_date TIMESTAMPTZ DEFAULT now(),
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'verified', 'rejected'))
);

ALTER TABLE submissions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "select_submissions" ON submissions FOR SELECT
  TO authenticated USING (true);

CREATE POLICY "insert_submissions" ON submissions FOR INSERT
  TO authenticated WITH CHECK (true);

CREATE POLICY "update_submissions" ON submissions FOR UPDATE
  TO authenticated USING (true) WITH CHECK (true);

CREATE POLICY "delete_submissions" ON submissions FOR DELETE
  TO authenticated USING (true);

-- Allow public reads for referral tracking (anon key)
CREATE POLICY "public_select_submissions" ON submissions FOR SELECT
  TO anon USING (true);

-- Allow public inserts for quest submissions (anon key)
CREATE POLICY "public_insert_submissions" ON submissions FOR INSERT
  TO anon WITH CHECK (true);

-- Index for referral lookups
CREATE INDEX idx_submissions_referral_code ON submissions(referral_code);
CREATE INDEX idx_submissions_referred_by ON submissions(referred_by);
CREATE INDEX idx_submissions_x_username ON submissions(x_username);
CREATE INDEX idx_submissions_wallet_address ON submissions(wallet_address);
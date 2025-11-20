-- RLS Policies for TVAsocial

-- ============================================
-- USERS TABLE POLICIES
-- ============================================

-- Allow users to insert their own profile during signup
-- This policy allows a newly authenticated user to create their profile
CREATE POLICY "Users can insert their own profile during signup"
ON users
FOR INSERT
TO authenticated
WITH CHECK (auth.uid() = id);

-- Allow users to read their own profile
CREATE POLICY "Users can read their own profile"
ON users
FOR SELECT
TO authenticated
USING (auth.uid() = id);

-- Allow users to update their own profile
CREATE POLICY "Users can update their own profile"
ON users
FOR UPDATE
TO authenticated
USING (auth.uid() = id)
WITH CHECK (auth.uid() = id);

-- ============================================
-- CLIENTS TABLE POLICIES
-- ============================================

-- Consultants can insert clients
CREATE POLICY "Consultants can insert clients"
ON clients
FOR INSERT
TO authenticated
WITH CHECK (
  EXISTS (
    SELECT 1 FROM users
    WHERE users.id = auth.uid()
    AND users.role = 'consultant'
  )
);

-- Consultants can read their own clients
CREATE POLICY "Consultants can read their own clients"
ON clients
FOR SELECT
TO authenticated
USING (
  consultant_id = auth.uid()
);

-- Consultants can update their own clients
CREATE POLICY "Consultants can update their own clients"
ON clients
FOR UPDATE
TO authenticated
USING (consultant_id = auth.uid())
WITH CHECK (consultant_id = auth.uid());

-- Consultants can delete their own clients
CREATE POLICY "Consultants can delete their own clients"
ON clients
FOR DELETE
TO authenticated
USING (consultant_id = auth.uid());

-- ============================================
-- STRATEGIES TABLE POLICIES
-- ============================================

-- Consultants can insert strategies for their clients
CREATE POLICY "Consultants can insert strategies for their clients"
ON strategies
FOR INSERT
TO authenticated
WITH CHECK (
  EXISTS (
    SELECT 1 FROM clients
    WHERE clients.id = client_id
    AND clients.consultant_id = auth.uid()
  )
);

-- Consultants can read strategies for their clients
CREATE POLICY "Consultants can read strategies for their clients"
ON strategies
FOR SELECT
TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM clients
    WHERE clients.id = client_id
    AND clients.consultant_id = auth.uid()
  )
);

-- Consultants can update strategies for their clients
CREATE POLICY "Consultants can update strategies for their clients"
ON strategies
FOR UPDATE
TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM clients
    WHERE clients.id = client_id
    AND clients.consultant_id = auth.uid()
  )
)
WITH CHECK (
  EXISTS (
    SELECT 1 FROM clients
    WHERE clients.id = client_id
    AND clients.consultant_id = auth.uid()
  )
);

-- ============================================
-- OPTIONAL: Database Trigger for Auto-Creating User Profiles
-- This is a more robust alternative to client-side profile creation
-- ============================================

-- Function to create user profile automatically
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.users (id, email, role, created_at)
  VALUES (
    NEW.id,
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'role', 'agency'),
    NOW()
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger to call the function when a new user signs up
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- ============================================
-- VERIFICATION QUERIES
-- ============================================

-- Run these to verify policies are created:
-- SELECT * FROM pg_policies WHERE tablename = 'users';
-- SELECT * FROM pg_policies WHERE tablename = 'clients';
-- SELECT * FROM pg_policies WHERE tablename = 'strategies';

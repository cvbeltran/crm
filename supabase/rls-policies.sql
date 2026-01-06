-- Enable Row Level Security on all tables
ALTER TABLE user_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE accounts ENABLE ROW LEVEL SECURITY;
ALTER TABLE opportunities ENABLE ROW LEVEL SECURITY;
ALTER TABLE quotes ENABLE ROW LEVEL SECURITY;
ALTER TABLE approvals ENABLE ROW LEVEL SECURITY;
ALTER TABLE handovers ENABLE ROW LEVEL SECURITY;

-- Helper function to get user role
CREATE OR REPLACE FUNCTION get_user_role()
RETURNS user_role AS $$
  SELECT role FROM user_profiles WHERE id = auth.uid();
$$ LANGUAGE sql SECURITY DEFINER;

-- Helper function to check if user has role
CREATE OR REPLACE FUNCTION has_role(required_role user_role)
RETURNS BOOLEAN AS $$
  SELECT get_user_role() = required_role;
$$ LANGUAGE sql SECURITY DEFINER;

-- Helper function to check if user has any of the roles
CREATE OR REPLACE FUNCTION has_any_role(required_roles user_role[])
RETURNS BOOLEAN AS $$
  SELECT get_user_role() = ANY(required_roles);
$$ LANGUAGE sql SECURITY DEFINER;

-- ============================================
-- USER_PROFILES POLICIES
-- ============================================
-- Users can view their own profile
CREATE POLICY "Users can view own profile"
  ON user_profiles FOR SELECT
  USING (auth.uid() = id);

-- Users can update their own profile (except role)
CREATE POLICY "Users can update own profile"
  ON user_profiles FOR UPDATE
  USING (auth.uid() = id)
  WITH CHECK (auth.uid() = id AND role = (SELECT role FROM user_profiles WHERE id = auth.uid()));

-- All authenticated users can view other user profiles (for dropdowns, etc.)
CREATE POLICY "Authenticated users can view profiles"
  ON user_profiles FOR SELECT
  USING (auth.role() = 'authenticated');

-- ============================================
-- ACCOUNTS POLICIES
-- ============================================
-- All authenticated users can view accounts
CREATE POLICY "Authenticated users can view accounts"
  ON accounts FOR SELECT
  USING (auth.role() = 'authenticated');

-- Sales and Executive can create accounts
CREATE POLICY "Sales and Executive can create accounts"
  ON accounts FOR INSERT
  WITH CHECK (
    auth.role() = 'authenticated' AND
    has_any_role(ARRAY['sales', 'executive']::user_role[])
  );

-- Sales and Executive can update accounts
CREATE POLICY "Sales and Executive can update accounts"
  ON accounts FOR UPDATE
  USING (
    auth.role() = 'authenticated' AND
    has_any_role(ARRAY['sales', 'executive']::user_role[])
  )
  WITH CHECK (
    auth.role() = 'authenticated' AND
    has_any_role(ARRAY['sales', 'executive']::user_role[])
  );

-- ============================================
-- OPPORTUNITIES POLICIES
-- ============================================
-- All authenticated users can view opportunities
CREATE POLICY "Authenticated users can view opportunities"
  ON opportunities FOR SELECT
  USING (auth.role() = 'authenticated');

-- Sales and Executive can create opportunities
CREATE POLICY "Sales and Executive can create opportunities"
  ON opportunities FOR INSERT
  WITH CHECK (
    auth.role() = 'authenticated' AND
    has_any_role(ARRAY['sales', 'executive']::user_role[])
  );

-- Sales and Executive can update opportunities
CREATE POLICY "Sales and Executive can update opportunities"
  ON opportunities FOR UPDATE
  USING (
    auth.role() = 'authenticated' AND
    has_any_role(ARRAY['sales', 'executive']::user_role[])
  )
  WITH CHECK (
    auth.role() = 'authenticated' AND
    has_any_role(ARRAY['sales', 'executive']::user_role[])
  );

-- ============================================
-- QUOTES POLICIES
-- ============================================
-- View policies: Operations can see limited fields, others see all
CREATE POLICY "Sales Finance Executive can view all quote fields"
  ON quotes FOR SELECT
  USING (
    auth.role() = 'authenticated' AND
    has_any_role(ARRAY['sales', 'finance', 'executive']::user_role[])
  );

-- Operations can view quotes but with limited fields (via view)
CREATE POLICY "Operations can view quote basics"
  ON quotes FOR SELECT
  USING (
    auth.role() = 'authenticated' AND
    has_role('operations')
  );

-- Sales and Executive can create quotes
CREATE POLICY "Sales and Executive can create quotes"
  ON quotes FOR INSERT
  WITH CHECK (
    auth.role() = 'authenticated' AND
    has_any_role(ARRAY['sales', 'executive']::user_role[])
  );

-- Sales and Executive can update quotes
CREATE POLICY "Sales and Executive can update quotes"
  ON quotes FOR UPDATE
  USING (
    auth.role() = 'authenticated' AND
    has_any_role(ARRAY['sales', 'executive']::user_role[])
  )
  WITH CHECK (
    auth.role() = 'authenticated' AND
    has_any_role(ARRAY['sales', 'executive']::user_role[])
  );

-- Finance can update quote approval status
CREATE POLICY "Finance can update quote approval status"
  ON quotes FOR UPDATE
  USING (
    auth.role() = 'authenticated' AND
    has_any_role(ARRAY['finance', 'executive']::user_role[])
  )
  WITH CHECK (
    auth.role() = 'authenticated' AND
    has_any_role(ARRAY['finance', 'executive']::user_role[])
  );

-- ============================================
-- APPROVALS POLICIES
-- ============================================
-- Sales, Finance, Executive can view approvals
CREATE POLICY "Sales Finance Executive can view approvals"
  ON approvals FOR SELECT
  USING (
    auth.role() = 'authenticated' AND
    has_any_role(ARRAY['sales', 'finance', 'executive']::user_role[])
  );

-- Operations CANNOT see approvals (no policy = no access)

-- Finance and Executive can create approvals
CREATE POLICY "Finance and Executive can create approvals"
  ON approvals FOR INSERT
  WITH CHECK (
    auth.role() = 'authenticated' AND
    has_any_role(ARRAY['finance', 'executive']::user_role[])
  );

-- Finance and Executive can update approvals
CREATE POLICY "Finance and Executive can update approvals"
  ON approvals FOR UPDATE
  USING (
    auth.role() = 'authenticated' AND
    has_any_role(ARRAY['finance', 'executive']::user_role[])
  )
  WITH CHECK (
    auth.role() = 'authenticated' AND
    has_any_role(ARRAY['finance', 'executive']::user_role[])
  );

-- ============================================
-- HANDOVERS POLICIES
-- ============================================
-- All authenticated users can view handovers
CREATE POLICY "Authenticated users can view handovers"
  ON handovers FOR SELECT
  USING (auth.role() = 'authenticated');

-- Sales and Executive can create handovers
CREATE POLICY "Sales and Executive can create handovers"
  ON handovers FOR INSERT
  WITH CHECK (
    auth.role() = 'authenticated' AND
    has_any_role(ARRAY['sales', 'executive']::user_role[])
  );

-- Operations can update handover status (accept/flag)
CREATE POLICY "Operations can update handover status"
  ON handovers FOR UPDATE
  USING (
    auth.role() = 'authenticated' AND
    has_role('operations')
  )
  WITH CHECK (
    auth.role() = 'authenticated' AND
    has_role('operations')
  );

-- Sales and Executive can update handovers
CREATE POLICY "Sales and Executive can update handovers"
  ON handovers FOR UPDATE
  USING (
    auth.role() = 'authenticated' AND
    has_any_role(ARRAY['sales', 'executive']::user_role[])
  )
  WITH CHECK (
    auth.role() = 'authenticated' AND
    has_any_role(ARRAY['sales', 'executive']::user_role[])
  );

-- ============================================
-- VIEW FOR OPERATIONS (Hides sensitive fields)
-- ============================================
-- Create a view that Operations should use instead of direct table access
CREATE OR REPLACE VIEW quotes_for_operations AS
SELECT
  id,
  opportunity_id,
  quote_number,
  state,
  deal_value,
  scope,
  valid_until,
  created_by,
  created_at,
  updated_at
FROM quotes;

-- Grant access to the view
GRANT SELECT ON quotes_for_operations TO authenticated;

-- Note: In application code, Operations role should query this view
-- instead of the quotes table directly to enforce visibility rules


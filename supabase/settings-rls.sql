-- RLS Policies for Settings tables - Executive Only Access

-- Enable RLS on all settings tables
ALTER TABLE revenue_models ENABLE ROW LEVEL SECURITY;
ALTER TABLE revenue_streams ENABLE ROW LEVEL SECURITY;
ALTER TABLE icp_categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE opportunity_stages_config ENABLE ROW LEVEL SECURITY;
ALTER TABLE approval_thresholds ENABLE ROW LEVEL SECURITY;

-- ============================================
-- REVENUE MODELS POLICIES
-- ============================================
-- Only Executive can view revenue models
CREATE POLICY "Executive can view revenue models"
  ON revenue_models FOR SELECT
  USING (
    auth.role() = 'authenticated' AND
    has_role('executive')
  );

-- Only Executive can create revenue models
CREATE POLICY "Executive can create revenue models"
  ON revenue_models FOR INSERT
  WITH CHECK (
    auth.role() = 'authenticated' AND
    has_role('executive')
  );

-- Only Executive can update revenue models
CREATE POLICY "Executive can update revenue models"
  ON revenue_models FOR UPDATE
  USING (
    auth.role() = 'authenticated' AND
    has_role('executive')
  )
  WITH CHECK (
    auth.role() = 'authenticated' AND
    has_role('executive')
  );

-- Only Executive can delete revenue models
CREATE POLICY "Executive can delete revenue models"
  ON revenue_models FOR DELETE
  USING (
    auth.role() = 'authenticated' AND
    has_role('executive')
  );

-- ============================================
-- REVENUE STREAMS POLICIES
-- ============================================
-- Only Executive can view revenue streams
CREATE POLICY "Executive can view revenue streams"
  ON revenue_streams FOR SELECT
  USING (
    auth.role() = 'authenticated' AND
    has_role('executive')
  );

-- Only Executive can create revenue streams
CREATE POLICY "Executive can create revenue streams"
  ON revenue_streams FOR INSERT
  WITH CHECK (
    auth.role() = 'authenticated' AND
    has_role('executive')
  );

-- Only Executive can update revenue streams
CREATE POLICY "Executive can update revenue streams"
  ON revenue_streams FOR UPDATE
  USING (
    auth.role() = 'authenticated' AND
    has_role('executive')
  )
  WITH CHECK (
    auth.role() = 'authenticated' AND
    has_role('executive')
  );

-- Only Executive can delete revenue streams
CREATE POLICY "Executive can delete revenue streams"
  ON revenue_streams FOR DELETE
  USING (
    auth.role() = 'authenticated' AND
    has_role('executive')
  );

-- ============================================
-- ICP CATEGORIES POLICIES
-- ============================================
-- Only Executive can view ICP categories
CREATE POLICY "Executive can view ICP categories"
  ON icp_categories FOR SELECT
  USING (
    auth.role() = 'authenticated' AND
    has_role('executive')
  );

-- Only Executive can create ICP categories
CREATE POLICY "Executive can create ICP categories"
  ON icp_categories FOR INSERT
  WITH CHECK (
    auth.role() = 'authenticated' AND
    has_role('executive')
  );

-- Only Executive can update ICP categories
CREATE POLICY "Executive can update ICP categories"
  ON icp_categories FOR UPDATE
  USING (
    auth.role() = 'authenticated' AND
    has_role('executive')
  )
  WITH CHECK (
    auth.role() = 'authenticated' AND
    has_role('executive')
  );

-- Only Executive can delete ICP categories
CREATE POLICY "Executive can delete ICP categories"
  ON icp_categories FOR DELETE
  USING (
    auth.role() = 'authenticated' AND
    has_role('executive')
  );

-- ============================================
-- OPPORTUNITY STAGES CONFIG POLICIES
-- ============================================
-- Only Executive can view opportunity stages config
CREATE POLICY "Executive can view opportunity stages config"
  ON opportunity_stages_config FOR SELECT
  USING (
    auth.role() = 'authenticated' AND
    has_role('executive')
  );

-- Only Executive can create opportunity stages config
CREATE POLICY "Executive can create opportunity stages config"
  ON opportunity_stages_config FOR INSERT
  WITH CHECK (
    auth.role() = 'authenticated' AND
    has_role('executive')
  );

-- Only Executive can update opportunity stages config (limited editing)
CREATE POLICY "Executive can update opportunity stages config"
  ON opportunity_stages_config FOR UPDATE
  USING (
    auth.role() = 'authenticated' AND
    has_role('executive')
  )
  WITH CHECK (
    auth.role() = 'authenticated' AND
    has_role('executive')
    -- Note: Stage enum value cannot be changed, only display_name, description, order_index, is_active
  );

-- Only Executive can delete opportunity stages config
CREATE POLICY "Executive can delete opportunity stages config"
  ON opportunity_stages_config FOR DELETE
  USING (
    auth.role() = 'authenticated' AND
    has_role('executive')
  );

-- ============================================
-- APPROVAL THRESHOLDS POLICIES
-- ============================================
-- Only Executive can view approval thresholds
CREATE POLICY "Executive can view approval thresholds"
  ON approval_thresholds FOR SELECT
  USING (
    auth.role() = 'authenticated' AND
    has_role('executive')
  );

-- Only Executive can create approval thresholds
CREATE POLICY "Executive can create approval thresholds"
  ON approval_thresholds FOR INSERT
  WITH CHECK (
    auth.role() = 'authenticated' AND
    has_role('executive')
  );

-- Only Executive can update approval thresholds
CREATE POLICY "Executive can update approval thresholds"
  ON approval_thresholds FOR UPDATE
  USING (
    auth.role() = 'authenticated' AND
    has_role('executive')
  )
  WITH CHECK (
    auth.role() = 'authenticated' AND
    has_role('executive')
  );

-- Only Executive can delete approval thresholds
CREATE POLICY "Executive can delete approval thresholds"
  ON approval_thresholds FOR DELETE
  USING (
    auth.role() = 'authenticated' AND
    has_role('executive')
  );


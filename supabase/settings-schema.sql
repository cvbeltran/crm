-- Settings tables for Executive-only configuration
-- These tables store system-wide configuration that only Executives can manage

-- Revenue Models table
CREATE TABLE revenue_models (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL UNIQUE,
  description TEXT,
  is_active BOOLEAN NOT NULL DEFAULT true,
  created_by UUID NOT NULL REFERENCES user_profiles(id),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Revenue Streams table
CREATE TABLE revenue_streams (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL UNIQUE,
  description TEXT,
  revenue_model_id UUID REFERENCES revenue_models(id) ON DELETE SET NULL,
  is_active BOOLEAN NOT NULL DEFAULT true,
  created_by UUID NOT NULL REFERENCES user_profiles(id),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ICP Categories table (Ideal Customer Profile Categories)
CREATE TABLE icp_categories (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL UNIQUE,
  description TEXT,
  is_active BOOLEAN NOT NULL DEFAULT true,
  created_by UUID NOT NULL REFERENCES user_profiles(id),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Opportunity Stages configuration table
-- Note: The actual stages are defined as an enum, but this table allows configuration
CREATE TABLE opportunity_stages_config (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  stage opportunity_state NOT NULL UNIQUE,
  display_name TEXT NOT NULL,
  description TEXT,
  order_index INTEGER NOT NULL,
  is_active BOOLEAN NOT NULL DEFAULT true,
  created_by UUID NOT NULL REFERENCES user_profiles(id),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Approval Thresholds table
CREATE TABLE approval_thresholds (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL UNIQUE,
  description TEXT,
  threshold_amount NUMERIC(12, 2) NOT NULL,
  requires_executive_approval BOOLEAN NOT NULL DEFAULT false,
  is_active BOOLEAN NOT NULL DEFAULT true,
  created_by UUID NOT NULL REFERENCES user_profiles(id),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Indexes for performance
CREATE INDEX idx_revenue_streams_revenue_model_id ON revenue_streams(revenue_model_id);
CREATE INDEX idx_revenue_models_is_active ON revenue_models(is_active);
CREATE INDEX idx_revenue_streams_is_active ON revenue_streams(is_active);
CREATE INDEX idx_icp_categories_is_active ON icp_categories(is_active);
CREATE INDEX idx_opportunity_stages_config_stage ON opportunity_stages_config(stage);
CREATE INDEX idx_opportunity_stages_config_order ON opportunity_stages_config(order_index);
CREATE INDEX idx_approval_thresholds_is_active ON approval_thresholds(is_active);

-- Triggers for updated_at
CREATE TRIGGER update_revenue_models_updated_at BEFORE UPDATE ON revenue_models
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_revenue_streams_updated_at BEFORE UPDATE ON revenue_streams
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_icp_categories_updated_at BEFORE UPDATE ON icp_categories
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_opportunity_stages_config_updated_at BEFORE UPDATE ON opportunity_stages_config
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_approval_thresholds_updated_at BEFORE UPDATE ON approval_thresholds
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Insert default opportunity stages configuration
INSERT INTO opportunity_stages_config (stage, display_name, description, order_index, created_by)
SELECT 
  'lead'::opportunity_state,
  'Lead',
  'Initial contact or inquiry',
  1,
  (SELECT id FROM user_profiles WHERE role = 'executive' LIMIT 1)
WHERE NOT EXISTS (SELECT 1 FROM opportunity_stages_config WHERE stage = 'lead');

INSERT INTO opportunity_stages_config (stage, display_name, description, order_index, created_by)
SELECT 
  'qualified'::opportunity_state,
  'Qualified',
  'Opportunity has been qualified',
  2,
  (SELECT id FROM user_profiles WHERE role = 'executive' LIMIT 1)
WHERE NOT EXISTS (SELECT 1 FROM opportunity_stages_config WHERE stage = 'qualified');

INSERT INTO opportunity_stages_config (stage, display_name, description, order_index, created_by)
SELECT 
  'proposal'::opportunity_state,
  'Proposal',
  'Proposal has been sent',
  3,
  (SELECT id FROM user_profiles WHERE role = 'executive' LIMIT 1)
WHERE NOT EXISTS (SELECT 1 FROM opportunity_stages_config WHERE stage = 'proposal');

INSERT INTO opportunity_stages_config (stage, display_name, description, order_index, created_by)
SELECT 
  'closed_won'::opportunity_state,
  'Closed Won',
  'Opportunity won',
  4,
  (SELECT id FROM user_profiles WHERE role = 'executive' LIMIT 1)
WHERE NOT EXISTS (SELECT 1 FROM opportunity_stages_config WHERE stage = 'closed_won');

INSERT INTO opportunity_stages_config (stage, display_name, description, order_index, created_by)
SELECT 
  'closed_lost'::opportunity_state,
  'Closed Lost',
  'Opportunity lost',
  5,
  (SELECT id FROM user_profiles WHERE role = 'executive' LIMIT 1)
WHERE NOT EXISTS (SELECT 1 FROM opportunity_stages_config WHERE stage = 'closed_lost');


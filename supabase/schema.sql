-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- User roles enum
CREATE TYPE user_role AS ENUM ('executive', 'sales', 'finance', 'operations');

-- Opportunity state enum
CREATE TYPE opportunity_state AS ENUM ('lead', 'qualified', 'proposal', 'closed_won', 'closed_lost');

-- Quote state enum
CREATE TYPE quote_state AS ENUM ('draft', 'pending_approval', 'approved', 'rejected');

-- Handover state enum
CREATE TYPE handover_state AS ENUM ('pending', 'accepted', 'flagged');

-- User profiles table (extends Supabase auth.users)
CREATE TABLE user_profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT NOT NULL,
  full_name TEXT,
  role user_role NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Accounts table
CREATE TABLE accounts (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  industry TEXT,
  website TEXT,
  phone TEXT,
  address TEXT,
  created_by UUID REFERENCES user_profiles(id),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Opportunities table
CREATE TABLE opportunities (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  account_id UUID NOT NULL REFERENCES accounts(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  description TEXT,
  state opportunity_state NOT NULL DEFAULT 'lead',
  deal_value NUMERIC(12, 2) NOT NULL,
  expected_close_date DATE,
  owner_id UUID NOT NULL REFERENCES user_profiles(id),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  CONSTRAINT valid_state_transition CHECK (
    state IN ('lead', 'qualified', 'proposal', 'closed_won', 'closed_lost')
  )
);

-- Quotes table
CREATE TABLE quotes (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  opportunity_id UUID NOT NULL REFERENCES opportunities(id) ON DELETE CASCADE,
  quote_number TEXT UNIQUE NOT NULL,
  state quote_state NOT NULL DEFAULT 'draft',
  deal_value NUMERIC(12, 2) NOT NULL,
  cost NUMERIC(12, 2),
  margin NUMERIC(12, 2),
  margin_percentage NUMERIC(5, 2),
  discount_percentage NUMERIC(5, 2),
  scope TEXT,
  valid_until DATE,
  created_by UUID NOT NULL REFERENCES user_profiles(id),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  CONSTRAINT valid_state_transition CHECK (
    state IN ('draft', 'pending_approval', 'approved', 'rejected')
  )
);

-- Approvals table
CREATE TABLE approvals (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  quote_id UUID NOT NULL REFERENCES quotes(id) ON DELETE CASCADE,
  approver_id UUID NOT NULL REFERENCES user_profiles(id),
  status TEXT NOT NULL CHECK (status IN ('pending', 'approved', 'rejected')),
  comments TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Handovers table
CREATE TABLE handovers (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  opportunity_id UUID NOT NULL REFERENCES opportunities(id) ON DELETE CASCADE,
  quote_id UUID REFERENCES quotes(id),
  state handover_state NOT NULL DEFAULT 'pending',
  deal_value NUMERIC(12, 2) NOT NULL,
  scope TEXT,
  expected_start_date DATE,
  expected_end_date DATE,
  accepted_by UUID REFERENCES user_profiles(id),
  flagged_reason TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  CONSTRAINT valid_state_transition CHECK (
    state IN ('pending', 'accepted', 'flagged')
  )
);

-- Indexes for performance
CREATE INDEX idx_opportunities_account_id ON opportunities(account_id);
CREATE INDEX idx_opportunities_owner_id ON opportunities(owner_id);
CREATE INDEX idx_opportunities_state ON opportunities(state);
CREATE INDEX idx_quotes_opportunity_id ON quotes(opportunity_id);
CREATE INDEX idx_quotes_state ON quotes(state);
CREATE INDEX idx_approvals_quote_id ON approvals(quote_id);
CREATE INDEX idx_handovers_opportunity_id ON handovers(opportunity_id);
CREATE INDEX idx_handovers_state ON handovers(state);
CREATE INDEX idx_user_profiles_role ON user_profiles(role);

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Triggers for updated_at
CREATE TRIGGER update_user_profiles_updated_at BEFORE UPDATE ON user_profiles
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_accounts_updated_at BEFORE UPDATE ON accounts
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_opportunities_updated_at BEFORE UPDATE ON opportunities
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_quotes_updated_at BEFORE UPDATE ON quotes
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_approvals_updated_at BEFORE UPDATE ON approvals
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_handovers_updated_at BEFORE UPDATE ON handovers
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();


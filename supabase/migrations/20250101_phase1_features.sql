-- Phase 1 Best Practices Implementation
-- KYC/AML, Price Alerts, and Compliance Features

-- Add KYC fields to profiles table
ALTER TABLE profiles
ADD COLUMN IF NOT EXISTS kyc_status TEXT DEFAULT 'pending' CHECK (kyc_status IN ('pending', 'reviewing', 'approved', 'rejected')),
ADD COLUMN IF NOT EXISTS kyc_risk_score INTEGER CHECK (kyc_risk_score >= 1 AND kyc_risk_score <= 5),
ADD COLUMN IF NOT EXISTS kyc_completed_at TIMESTAMPTZ,
ADD COLUMN IF NOT EXISTS kyc_document_type TEXT CHECK (kyc_document_type IN ('passport', 'drivers_license', 'national_id')),
ADD COLUMN IF NOT EXISTS kyc_verified_by TEXT,
ADD COLUMN IF NOT EXISTS kyc_notes TEXT;

-- Create index for KYC status queries
CREATE INDEX IF NOT EXISTS idx_profiles_kyc_status ON profiles(kyc_status);

-- Price Alerts Table
CREATE TABLE IF NOT EXISTS price_alerts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  symbol TEXT NOT NULL,
  target_price DECIMAL(20, 8) NOT NULL,
  condition TEXT NOT NULL CHECK (condition IN ('above', 'below')),
  is_active BOOLEAN DEFAULT true,
  triggered_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Indexes for price alerts
CREATE INDEX IF NOT EXISTS idx_price_alerts_user_id ON price_alerts(user_id);
CREATE INDEX IF NOT EXISTS idx_price_alerts_symbol ON price_alerts(symbol);
CREATE INDEX IF NOT EXISTS idx_price_alerts_active ON price_alerts(is_active) WHERE is_active = true;

-- RLS policies for price alerts
ALTER TABLE price_alerts ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own price alerts"
  ON price_alerts FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own price alerts"
  ON price_alerts FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own price alerts"
  ON price_alerts FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own price alerts"
  ON price_alerts FOR DELETE
  USING (auth.uid() = user_id);

-- Compliance Logs Table (for SAR and audit trail)
CREATE TABLE IF NOT EXISTS compliance_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  event_type TEXT NOT NULL,
  risk_score INTEGER,
  details JSONB,
  reviewed_by UUID REFERENCES auth.users(id),
  reviewed_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Indexes for compliance logs
CREATE INDEX IF NOT EXISTS idx_compliance_logs_user_id ON compliance_logs(user_id);
CREATE INDEX IF NOT EXISTS idx_compliance_logs_event_type ON compliance_logs(event_type);
CREATE INDEX IF NOT EXISTS idx_compliance_logs_created_at ON compliance_logs(created_at DESC);

-- RLS policies for compliance logs (admin only)
ALTER TABLE compliance_logs ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Only admins can view compliance logs"
  ON compliance_logs FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid()
      AND profiles.role = 'admin'
    )
  );

CREATE POLICY "System can insert compliance logs"
  ON compliance_logs FOR INSERT
  WITH CHECK (true);

-- User Preferences Table (for customization)
CREATE TABLE IF NOT EXISTS user_preferences (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE UNIQUE,
  theme TEXT DEFAULT 'dark' CHECK (theme IN ('light', 'dark', 'auto')),
  language TEXT DEFAULT 'en',
  notifications_enabled BOOLEAN DEFAULT true,
  price_alerts_enabled BOOLEAN DEFAULT true,
  email_notifications BOOLEAN DEFAULT true,
  push_notifications BOOLEAN DEFAULT false,
  two_factor_enabled BOOLEAN DEFAULT false,
  biometric_enabled BOOLEAN DEFAULT false,
  dashboard_layout JSONB DEFAULT '{}',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- RLS policies for user preferences
ALTER TABLE user_preferences ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own preferences"
  ON user_preferences FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own preferences"
  ON user_preferences FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own preferences"
  ON user_preferences FOR UPDATE
  USING (auth.uid() = user_id);

-- Watchlists Table (for personalization)
CREATE TABLE IF NOT EXISTS watchlists (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  symbols TEXT[] NOT NULL DEFAULT '{}',
  is_default BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Indexes for watchlists
CREATE INDEX IF NOT EXISTS idx_watchlists_user_id ON watchlists(user_id);

-- RLS policies for watchlists
ALTER TABLE watchlists ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own watchlists"
  ON watchlists FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own watchlists"
  ON watchlists FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own watchlists"
  ON watchlists FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own watchlists"
  ON watchlists FOR DELETE
  USING (auth.uid() = user_id);

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Triggers for updated_at
CREATE TRIGGER update_price_alerts_updated_at
  BEFORE UPDATE ON price_alerts
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_user_preferences_updated_at
  BEFORE UPDATE ON user_preferences
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_watchlists_updated_at
  BEFORE UPDATE ON watchlists
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Function to check price alerts (called by Edge Function cron)
CREATE OR REPLACE FUNCTION check_price_alerts()
RETURNS void AS $$
DECLARE
  alert_record RECORD;
  current_price DECIMAL(20, 8);
BEGIN
  -- Loop through active alerts
  FOR alert_record IN
    SELECT pa.*, cp.price_usd
    FROM price_alerts pa
    JOIN crypto_prices cp ON pa.symbol = cp.symbol
    WHERE pa.is_active = true
      AND pa.triggered_at IS NULL
  LOOP
    current_price := alert_record.price_usd;
    
    -- Check if alert condition is met
    IF (alert_record.condition = 'above' AND current_price >= alert_record.target_price) OR
       (alert_record.condition = 'below' AND current_price <= alert_record.target_price) THEN
      
      -- Mark alert as triggered
      UPDATE price_alerts
      SET triggered_at = NOW(),
          is_active = false
      WHERE id = alert_record.id;
      
      -- Log the trigger event
      INSERT INTO compliance_logs (user_id, event_type, details)
      VALUES (
        alert_record.user_id,
        'PRICE_ALERT_TRIGGERED',
        jsonb_build_object(
          'alert_id', alert_record.id,
          'symbol', alert_record.symbol,
          'target_price', alert_record.target_price,
          'current_price', current_price,
          'condition', alert_record.condition
        )
      );
    END IF;
  END LOOP;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Grant execute permission on check_price_alerts function
GRANT EXECUTE ON FUNCTION check_price_alerts() TO authenticated;
GRANT EXECUTE ON FUNCTION check_price_alerts() TO service_role;

-- Comments for documentation
COMMENT ON TABLE price_alerts IS 'User-defined price alerts for crypto assets';
COMMENT ON TABLE compliance_logs IS 'Audit trail for KYC/AML compliance and suspicious activity';
COMMENT ON TABLE user_preferences IS 'User customization and notification preferences';
COMMENT ON TABLE watchlists IS 'User-defined watchlists for tracking crypto assets';
COMMENT ON COLUMN profiles.kyc_status IS 'KYC verification status: pending, reviewing, approved, rejected';
COMMENT ON COLUMN profiles.kyc_risk_score IS 'Risk assessment score from 1 (low) to 5 (high)';
COMMENT ON FUNCTION check_price_alerts() IS 'Checks active price alerts and triggers notifications (called by cron)';

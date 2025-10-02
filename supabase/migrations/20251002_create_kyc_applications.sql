-- Create KYC applications table and RLS policies

CREATE TABLE IF NOT EXISTS public.kyc_applications (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  provider TEXT NOT NULL DEFAULT 'sumsub',
  application_id TEXT UNIQUE,
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending','reviewing','approved','rejected','failed','unknown')),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Indexes
CREATE INDEX IF NOT EXISTS idx_kyc_applications_user_id ON public.kyc_applications(user_id);
CREATE INDEX IF NOT EXISTS idx_kyc_applications_status ON public.kyc_applications(status);

-- RLS
ALTER TABLE public.kyc_applications ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own kyc applications"
  ON public.kyc_applications FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Service can insert kyc applications"
  ON public.kyc_applications FOR INSERT
  WITH CHECK (true);

CREATE POLICY "Users can update own kyc applications"
  ON public.kyc_applications FOR UPDATE
  USING (auth.uid() = user_id);

-- Trigger to maintain updated_at
CREATE OR REPLACE FUNCTION public.set_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trg_kyc_applications_updated_at ON public.kyc_applications;
CREATE TRIGGER trg_kyc_applications_updated_at
  BEFORE UPDATE ON public.kyc_applications
  FOR EACH ROW
  EXECUTE FUNCTION public.set_updated_at();

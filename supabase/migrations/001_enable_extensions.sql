-- Enable required PostgreSQL extensions
-- Run this first in Supabase SQL Editor

-- Enable ltree extension for hierarchical referral tree
CREATE EXTENSION IF NOT EXISTS ltree;

-- Enable UUID generation
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Enable crypto functions
CREATE EXTENSION IF NOT EXISTS pgcrypto;

-- Enable HTTP requests (for edge functions)
CREATE EXTENSION IF NOT EXISTS http;

-- Comment documenting the extensions
COMMENT ON EXTENSION ltree IS 'Data type for hierarchical tree-like structures (used for referral pyramid)';
COMMENT ON EXTENSION "uuid-ossp" IS 'Generate universally unique identifiers (UUIDs)';
COMMENT ON EXTENSION pgcrypto IS 'Cryptographic functions';
COMMENT ON EXTENSION http IS 'HTTP client for PostgreSQL';

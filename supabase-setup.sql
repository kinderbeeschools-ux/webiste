-- One-time setup for the admin panel. Paste into Supabase -> SQL Editor -> Run.
-- Safe to run again: it only creates what's missing.
-- RLS is on with no policies, so only the server (service_role key) can read or write these tables.

-- Enquiries from the website forms
create table if not exists enquiries (
  id text primary key,
  type text,
  name text,
  email text,
  phone text,
  city text,
  state text,
  budget text,
  partnership_model text,
  message text,
  status text default 'pending',
  notes text default '',
  ai_summary text,
  created_at timestamptz default now(),
  raw_data jsonb
);
alter table enquiries add column if not exists notes text default '';
alter table enquiries enable row level security;

-- UPI payment confirmations
create table if not exists payments (
  id text primary key,
  applicant_name text,
  admission_number text,
  programme text,
  amount text,
  upi_ref text,
  payer_phone text,
  payer_email text,
  status text default 'pending_verification',
  notes text default '',
  created_at timestamptz default now()
);
alter table payments add column if not exists notes text default '';
alter table payments enable row level security;

-- Blogs, FAQs, site settings and page text edited in the admin panel
create table if not exists site_data (
  key text primary key,
  value jsonb not null,
  updated_at timestamptz default now()
);
alter table site_data enable row level security;

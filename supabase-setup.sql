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

-- Payment verification (run again after the payment form update)
alter table payments add column if not exists payment_date date;
alter table payments add column if not exists verified_at timestamptz;
-- One submission per UPI transaction ID
create unique index if not exists payments_upi_ref_unique on payments (upi_ref);
-- Fast lead matching for the CRM (payments <-> enquiries by phone / email)
create index if not exists payments_payer_phone_idx on payments (payer_phone);
create index if not exists enquiries_phone_idx on enquiries (phone);

-- CRM: pipeline stage lives in enquiries.status (new, contacted, interested, counselling, visit, application, admission, lost)
alter table enquiries add column if not exists next_follow_up date;
update enquiries set status = 'new' where status = 'pending' or status is null;
update enquiries set status = 'contacted' where status = 'reviewed';
update enquiries set status = 'lost' where status = 'closed';
alter table enquiries alter column status set default 'new';

-- CRM: activity timeline per contact (lead_key = last 10 digits of the mobile, else the email)
create table if not exists lead_activity (
  id bigint generated always as identity primary key,
  lead_key text not null,
  enquiry_id text,
  type text not null,
  detail text not null,
  created_at timestamptz default now()
);
create index if not exists lead_activity_key_idx on lead_activity (lead_key, created_at desc);
alter table lead_activity enable row level security;

-- CRM phase 1: follow-up type, lost reason, contact attempts (used in lead scoring)
alter table enquiries add column if not exists follow_up_type text;
alter table enquiries add column if not exists lost_reason text;
alter table enquiries add column if not exists touch_count integer default 0;

-- Students (id like KB-2026-00001), created when a lead is admitted
create table if not exists students (
  id text primary key,
  child_name text not null,
  dob date,
  gender text,
  class_name text,
  branch text,
  academic_year text,
  admission_date date,
  parent_name text not null,
  parent_relation text,
  parent_phone text not null,
  parent_email text,
  address text,
  emergency_contact text,
  medical_info text,
  previous_school text,
  enquiry_id text,
  created_at timestamptz default now()
);
create index if not exists students_parent_phone_idx on students (parent_phone);
alter table students enable row level security;

-- Run this in the Supabase SQL Editor (Project → SQL Editor → New query)
-- for the project you're using for nexinsystems.com.

create table if not exists job_applications (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now(),

  job_slug text not null,
  job_title text not null,

  full_name text not null,
  email text not null,
  phone text not null,
  university text not null,

  has_ruby boolean not null default false,
  has_mern boolean not null default false,
  has_dotnet_angular boolean not null default false,
  has_react_next boolean not null default false,

  experience_years numeric(4, 1) not null,
  current_salary_pkr numeric(12, 2) not null,
  expected_salary_pkr numeric(12, 2) not null,
  available_join_date date not null,

  resume_path text not null,
  resume_filename text not null,

  status text not null default 'new' check (status in ('new', 'reviewed', 'shortlisted', 'rejected'))
);

create index if not exists job_applications_created_at_idx on job_applications (created_at desc);
create index if not exists job_applications_job_slug_idx on job_applications (job_slug);

-- Row Level Security: locked down. All reads/writes go through server-side
-- API routes using the service_role key, which bypasses RLS entirely — so
-- no public policies are needed (and none should be added).
alter table job_applications enable row level security;

-- ────────────────────────────────────────────────────────────────────────
-- Storage bucket for resume PDFs
-- ────────────────────────────────────────────────────────────────────────
-- Go to Storage → Create a new bucket named "resumes", and set it PRIVATE
-- (do not make it public). No storage policies are needed either, since
-- uploads and signed-URL generation both happen server-side via the
-- service_role key.

-- ────────────────────────────────────────────────────────────────────────
-- Employee portal (auth, mail, leave, reimbursement, announcements)
-- ────────────────────────────────────────────────────────────────────────

-- One row per logged-in employee, keyed to their Supabase Auth user.
-- Created via Supabase Auth Admin API (see app/api/admin/employees), not
-- signed up directly — there is no public sign-up flow.
create table if not exists employees (
  id uuid primary key references auth.users (id) on delete cascade,
  full_name text not null,
  email text not null unique,
  role text not null default 'employee' check (role in ('admin', 'employee')),
  department text,
  active boolean not null default true,
  created_at timestamptz not null default now()
);

-- Locked down like job_applications — all access goes through server-side
-- routes using the service_role key.
alter table employees enable row level security;

-- ── Ran once already (role: admin/employee only). Widening it for the
-- manager role + directory/org-chart fields — safe to re-run.
alter table employees drop constraint if exists employees_role_check;
alter table employees add constraint employees_role_check check (role in ('admin', 'manager', 'employee'));

alter table employees add column if not exists manager_id uuid references employees (id);
alter table employees add column if not exists job_title text;
alter table employees add column if not exists phone text;
alter table employees add column if not exists start_date date;
alter table employees add column if not exists avatar_url text;

create table if not exists leave_requests (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now(),
  employee_id uuid not null references employees (id) on delete cascade,
  leave_type text not null check (leave_type in ('annual', 'sick', 'casual', 'unpaid')),
  start_date date not null,
  end_date date not null,
  reason text not null,
  status text not null default 'pending' check (status in ('pending', 'approved', 'rejected')),
  reviewed_by uuid references employees (id),
  reviewed_at timestamptz
);

alter table leave_requests enable row level security;

create table if not exists reimbursements (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now(),
  employee_id uuid not null references employees (id) on delete cascade,
  category text not null,
  amount_pkr numeric(12, 2) not null,
  description text not null,
  receipt_path text,
  status text not null default 'pending' check (status in ('pending', 'approved', 'rejected')),
  reviewed_by uuid references employees (id),
  reviewed_at timestamptz
);

alter table reimbursements enable row level security;

create table if not exists announcements (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now(),
  title text not null,
  body text not null,
  category text not null default 'general' check (category in ('general', 'holiday')),
  pinned boolean not null default false,
  created_by uuid not null references employees (id)
);

alter table announcements enable row level security;

-- Storage bucket "receipts" (private) — same pattern as "resumes", for
-- reimbursement attachments. Create it in Storage when you build that module.

-- ────────────────────────────────────────────────────────────────────────
-- Asset tracking
-- ────────────────────────────────────────────────────────────────────────
create table if not exists assets (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now(),
  name text not null,
  category text not null check (category in ('laptop', 'monitor', 'phone', 'accessory', 'other')),
  serial_number text,
  assigned_to uuid references employees (id),
  status text not null default 'available' check (status in ('available', 'assigned', 'retired')),
  notes text
);

alter table assets enable row level security;

-- ────────────────────────────────────────────────────────────────────────
-- Document vault
-- ────────────────────────────────────────────────────────────────────────
create table if not exists documents (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now(),
  employee_id uuid not null references employees (id) on delete cascade,
  title text not null,
  category text not null default 'other' check (category in ('offer_letter', 'contract', 'nda', 'other')),
  file_path text not null,
  file_name text not null,
  uploaded_by uuid not null references employees (id)
);

alter table documents enable row level security;

-- Storage bucket "documents" (private) — create it in Storage, same pattern
-- as "resumes": all uploads/signed-URL reads happen server-side.

-- ────────────────────────────────────────────────────────────────────────
-- Schema ahead of UI — for Onboarding checklist, Client/Lead CRM, and
-- Timesheets (next phase). Included now so one SQL run covers everything.
-- ────────────────────────────────────────────────────────────────────────
create table if not exists onboarding_tasks (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now(),
  employee_id uuid not null references employees (id) on delete cascade,
  title text not null,
  done boolean not null default false,
  done_at timestamptz
);

alter table onboarding_tasks enable row level security;

create table if not exists leads (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now(),
  name text,
  email text not null,
  phone text,
  source text,
  status text not null default 'new' check (status in ('new', 'contacted', 'qualified', 'won', 'lost')),
  notes text,
  assigned_to uuid references employees (id)
);

alter table leads enable row level security;

create table if not exists projects (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now(),
  name text not null,
  client_name text,
  active boolean not null default true
);

alter table projects enable row level security;

create table if not exists time_entries (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now(),
  employee_id uuid not null references employees (id) on delete cascade,
  project_id uuid not null references projects (id) on delete cascade,
  entry_date date not null,
  hours numeric(4, 1) not null,
  description text
);

alter table time_entries enable row level security;

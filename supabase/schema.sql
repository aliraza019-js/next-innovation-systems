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

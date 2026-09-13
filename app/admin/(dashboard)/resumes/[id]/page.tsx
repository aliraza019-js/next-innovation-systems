import Link from "next/link"
import { notFound, redirect } from "next/navigation"
import { requireAdmin } from "@/lib/auth/require-role"
import {
  ArrowLeft,
  Mail,
  Phone,
  GraduationCap,
  Briefcase,
  Calendar,
  Wallet,
  ExternalLink,
} from "lucide-react"
import { getSupabaseAdmin, RESUMES_BUCKET } from "@/lib/supabase/admin"
import { TECH_STACKS } from "@/lib/careers-data"
import { StatusSelect } from "@/components/admin/status-select"
import { Badge } from "@/components/ui/badge"
import type { JobApplication } from "@/lib/types/job-application"

export const dynamic = "force-dynamic"

function formatPkr(amount: number): string {
  return `PKR ${Math.round(amount).toLocaleString("en-PK")}`
}

function formatDate(value: string): string {
  return new Date(value).toLocaleDateString("en-GB", {
    day: "2-digit",
    month: "long",
    year: "numeric",
  })
}

function formatDateTime(value: string): string {
  return new Date(value).toLocaleString("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  })
}

async function getApplication(id: string): Promise<{ application: JobApplication; resumeUrl: string | null } | null> {
  const supabase = getSupabaseAdmin()

  const { data, error } = await supabase.from("job_applications").select("*").eq("id", id).single()

  if (error || !data) return null

  const application = data as JobApplication

  const { data: signed } = await supabase.storage
    .from(RESUMES_BUCKET)
    .createSignedUrl(application.resume_path, 300)

  return { application, resumeUrl: signed?.signedUrl ?? null }
}

export default async function CandidateDetailPage({ params }: { params: { id: string } }) {
  const admin = await requireAdmin()
  if (!admin) redirect("/admin/mail")

  const result = await getApplication(params.id)

  if (!result) {
    notFound()
  }

  const { application, resumeUrl } = result

  const stacks = TECH_STACKS.filter((stack) => {
    if (stack.key === "ruby") return application.has_ruby
    if (stack.key === "mern") return application.has_mern
    if (stack.key === "dotnetAngular") return application.has_dotnet_angular
    return application.has_react_next
  })

  return (
    <div>
      <Link
        href="/admin/resumes"
        className="mb-6 inline-flex items-center gap-2 text-sm text-white/60 transition-colors hover:text-white"
      >
        <ArrowLeft className="h-4 w-4" />
        Back to resumes
      </Link>

      <div className="mb-8 flex flex-col justify-between gap-4 sm:flex-row sm:items-start">
        <div>
          <h1 className="text-2xl font-semibold text-white">{application.full_name}</h1>
          <p className="mt-1 text-sm text-white/50">
            Applied for <span className="text-white/80">{application.job_title}</span> on{" "}
            {formatDateTime(application.created_at)}
          </p>
        </div>
        <StatusSelect applicationId={application.id} initialStatus={application.status} size="default" />
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        {/* Left column — details */}
        <div className="space-y-6 lg:col-span-1">
          <section className="rounded-2xl border border-white/10 bg-white/[0.03] p-6">
            <h2 className="mb-4 text-sm font-semibold uppercase tracking-wide text-white/50">Contact</h2>
            <dl className="space-y-3 text-sm">
              <div className="flex items-center gap-3">
                <Mail className="h-4 w-4 shrink-0 text-emerald-400" />
                <a href={`mailto:${application.email}`} className="text-white/90 hover:text-emerald-400">
                  {application.email}
                </a>
              </div>
              <div className="flex items-center gap-3">
                <Phone className="h-4 w-4 shrink-0 text-emerald-400" />
                <a href={`tel:${application.phone}`} className="text-white/90 hover:text-emerald-400">
                  {application.phone}
                </a>
              </div>
              <div className="flex items-center gap-3">
                <GraduationCap className="h-4 w-4 shrink-0 text-emerald-400" />
                <span className="text-white/90">{application.university}</span>
              </div>
            </dl>
          </section>

          <section className="rounded-2xl border border-white/10 bg-white/[0.03] p-6">
            <h2 className="mb-4 text-sm font-semibold uppercase tracking-wide text-white/50">
              Experience &amp; compensation
            </h2>
            <dl className="space-y-4 text-sm">
              <div className="flex items-center justify-between gap-3">
                <span className="flex items-center gap-2 text-white/60">
                  <Briefcase className="h-4 w-4 text-emerald-400" />
                  Experience
                </span>
                <span className="font-medium text-white">{application.experience_years} years</span>
              </div>
              <div className="flex items-center justify-between gap-3">
                <span className="flex items-center gap-2 text-white/60">
                  <Wallet className="h-4 w-4 text-emerald-400" />
                  Current salary
                </span>
                <span className="font-medium text-white">{formatPkr(application.current_salary_pkr)}</span>
              </div>
              <div className="flex items-center justify-between gap-3">
                <span className="flex items-center gap-2 text-white/60">
                  <Wallet className="h-4 w-4 text-emerald-400" />
                  Expected salary
                </span>
                <span className="font-medium text-white">{formatPkr(application.expected_salary_pkr)}</span>
              </div>
              <div className="flex items-center justify-between gap-3">
                <span className="flex items-center gap-2 text-white/60">
                  <Calendar className="h-4 w-4 text-emerald-400" />
                  Available from
                </span>
                <span className="font-medium text-white">{formatDate(application.available_join_date)}</span>
              </div>
            </dl>
          </section>

          <section className="rounded-2xl border border-white/10 bg-white/[0.03] p-6">
            <h2 className="mb-4 text-sm font-semibold uppercase tracking-wide text-white/50">Stack experience</h2>
            {stacks.length === 0 ? (
              <p className="text-sm text-white/40">No stack experience selected.</p>
            ) : (
              <div className="flex flex-wrap gap-2">
                {stacks.map((stack) => (
                  <Badge key={stack.key} className="border-emerald-500/20 bg-emerald-500/10 text-emerald-400">
                    {stack.label}
                  </Badge>
                ))}
              </div>
            )}
          </section>
        </div>

        {/* Right column — resume preview */}
        <div className="lg:col-span-2">
          <section className="flex h-full flex-col rounded-2xl border border-white/10 bg-white/[0.03] p-6">
            <div className="mb-4 flex items-center justify-between gap-3">
              <h2 className="text-sm font-semibold uppercase tracking-wide text-white/50">
                Resume — {application.resume_filename}
              </h2>
              {resumeUrl && (
                <a
                  href={resumeUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 rounded-full border border-emerald-500/30 bg-emerald-500/10 px-3 py-1.5 text-xs font-medium text-emerald-400 transition-colors hover:bg-emerald-500/20"
                >
                  Open in new tab
                  <ExternalLink className="h-3.5 w-3.5" />
                </a>
              )}
            </div>

            {resumeUrl ? (
              <iframe
                src={resumeUrl}
                title={`${application.full_name} — resume`}
                className="h-[70vh] min-h-[500px] w-full rounded-xl border border-white/10 bg-white"
              />
            ) : (
              <div className="flex h-[70vh] min-h-[500px] items-center justify-center rounded-xl border border-white/10 text-sm text-white/40">
                Couldn&apos;t load this resume.
              </div>
            )}
          </section>
        </div>
      </div>
    </div>
  )
}

import { NextResponse } from "next/server"
import { Resend } from "resend"
import { getSupabaseAdmin, RESUMES_BUCKET } from "@/lib/supabase/admin"
import { getJobOpeningBySlug } from "@/lib/careers-data"

const MAX_FILE_SIZE = 5 * 1024 * 1024 // 5MB

function toBool(value: FormDataEntryValue | null): boolean {
  return value === "true"
}

function toNumber(value: FormDataEntryValue | null): number | null {
  if (typeof value !== "string" || value.trim() === "") return null
  const n = Number(value)
  return Number.isFinite(n) ? n : null
}

function sanitizeFilename(name: string): string {
  return name.replace(/[^a-zA-Z0-9._-]/g, "_")
}

export async function POST(req: Request) {
  try {
    const formData = await req.formData()

    const jobSlug = formData.get("jobSlug")
    const jobTitleFromForm = formData.get("jobTitle")
    const fullName = formData.get("fullName")
    const email = formData.get("email")
    const phone = formData.get("phone")
    const university = formData.get("university")
    const availableJoinDate = formData.get("availableJoinDate")
    const experienceYears = toNumber(formData.get("experienceYears"))
    const currentSalaryPkr = toNumber(formData.get("currentSalaryPkr"))
    const expectedSalaryPkr = toNumber(formData.get("expectedSalaryPkr"))
    const resume = formData.get("resume")

    // ── Validate the job opening ──
    if (typeof jobSlug !== "string") {
      return NextResponse.json({ error: "Missing job reference" }, { status: 400 })
    }
    const job = getJobOpeningBySlug(jobSlug)
    if (!job || !job.active) {
      return NextResponse.json({ error: "This opening is no longer accepting applications" }, { status: 400 })
    }
    const jobTitle = typeof jobTitleFromForm === "string" && jobTitleFromForm ? jobTitleFromForm : job.title

    // ── Validate required fields ──
    if (
      typeof fullName !== "string" ||
      !fullName.trim() ||
      typeof email !== "string" ||
      !email.trim() ||
      typeof phone !== "string" ||
      !phone.trim() ||
      typeof university !== "string" ||
      !university.trim() ||
      typeof availableJoinDate !== "string" ||
      !availableJoinDate.trim()
    ) {
      return NextResponse.json({ error: "Please fill in all required fields" }, { status: 400 })
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(email.trim())) {
      return NextResponse.json({ error: "Please enter a valid email address" }, { status: 400 })
    }

    if (experienceYears === null || currentSalaryPkr === null || expectedSalaryPkr === null) {
      return NextResponse.json({ error: "Please enter valid numbers for experience and salary" }, { status: 400 })
    }

    // ── Validate resume file ──
    if (!(resume instanceof File) || resume.size === 0) {
      return NextResponse.json({ error: "Please attach your resume (PDF)" }, { status: 400 })
    }
    if (resume.type !== "application/pdf") {
      return NextResponse.json({ error: "Resume must be a PDF file" }, { status: 400 })
    }
    if (resume.size > MAX_FILE_SIZE) {
      return NextResponse.json({ error: "Resume must be under 5MB" }, { status: 400 })
    }

    const supabase = getSupabaseAdmin()

    // ── Upload resume to Supabase Storage ──
    const storagePath = `${jobSlug}/${Date.now()}-${crypto.randomUUID()}-${sanitizeFilename(resume.name)}`
    const fileBuffer = await resume.arrayBuffer()

    const { error: uploadError } = await supabase.storage
      .from(RESUMES_BUCKET)
      .upload(storagePath, fileBuffer, { contentType: "application/pdf", upsert: false })

    if (uploadError) {
      console.error("Resume upload error:", uploadError)
      return NextResponse.json({ error: "Failed to upload resume. Please try again." }, { status: 500 })
    }

    // ── Insert application row ──
    const { error: insertError } = await supabase.from("job_applications").insert({
      // supabase-js's insert() types require typegen'd schema info we don't
      // generate here; the shape below matches supabase/schema.sql exactly.
      job_slug: jobSlug,
      job_title: jobTitle,
      full_name: fullName.trim(),
      email: email.trim().toLowerCase(),
      phone: phone.trim(),
      university: university.trim(),
      has_ruby: toBool(formData.get("hasRuby")),
      has_mern: toBool(formData.get("hasMern")),
      has_dotnet_angular: toBool(formData.get("hasDotnetAngular")),
      has_react_next: toBool(formData.get("hasReactNext")),
      experience_years: experienceYears,
      current_salary_pkr: currentSalaryPkr,
      expected_salary_pkr: expectedSalaryPkr,
      available_join_date: availableJoinDate,
      resume_path: storagePath,
      resume_filename: resume.name,
    } as any)

    if (insertError) {
      console.error("Application insert error:", insertError)
      // Clean up the uploaded file so we don't leave orphaned resumes in storage
      await supabase.storage.from(RESUMES_BUCKET).remove([storagePath])
      return NextResponse.json({ error: "Failed to submit application. Please try again." }, { status: 500 })
    }

    // ── Notify the team (best-effort — application is already saved) ──
    try {
      if (!process.env.RESEND_API_KEY) throw new Error("RESEND_API_KEY is not configured")
      const resend = new Resend(process.env.RESEND_API_KEY)
      await resend.emails.send({
        from: "NIS Careers <onboarding@resend.dev>",
        to: [process.env.CONTACT_EMAIL || "contact@nexinsystems.com"],
        replyTo: email.trim(),
        subject: `New application: ${jobTitle} — ${fullName.trim()}`,
        html: `
          <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
            <h2 style="color: #10b981;">New Job Application</h2>
            <p><strong>Position:</strong> ${jobTitle}</p>
            <p><strong>Name:</strong> ${fullName.trim()}</p>
            <p><strong>Email:</strong> ${email.trim()}</p>
            <p><strong>Phone:</strong> ${phone.trim()}</p>
            <p><strong>University:</strong> ${university.trim()}</p>
            <p><strong>Experience:</strong> ${experienceYears} years</p>
            <p><strong>Current salary:</strong> PKR ${currentSalaryPkr.toLocaleString()}</p>
            <p><strong>Expected salary:</strong> PKR ${expectedSalaryPkr.toLocaleString()}</p>
            <p><strong>Available from:</strong> ${availableJoinDate}</p>
            <p style="color: #666; font-size: 12px; margin-top: 20px;">View full details and the resume in the admin dashboard.</p>
          </div>
        `,
      })
    } catch (emailError) {
      console.error("Application notification email failed:", emailError)
    }

    return NextResponse.json({ success: true })
  } catch (error: any) {
    console.error("Career application error:", error)
    return NextResponse.json({ error: error.message || "Failed to submit application" }, { status: 500 })
  }
}

"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

import { checkPassword, createSession, destroySession, requireAdmin } from "@/lib/auth";
import {
  deleteBranch,
  deleteCourse,
  saveBranch,
  saveCourse,
  saveSettings,
} from "@/lib/admin-content";
import type { Branch, Course, FAQ, SiteSettings } from "@/lib/types";

// --- form parsing helpers ---
function str(v: FormDataEntryValue | null): string {
  return String(v ?? "").trim();
}
function opt(v: FormDataEntryValue | null): string | undefined {
  const s = str(v);
  return s || undefined;
}
function lines(v: FormDataEntryValue | null): string[] {
  return String(v ?? "")
    .split("\n")
    .map((s) => s.trim())
    .filter(Boolean);
}
function parseFaqs(v: FormDataEntryValue | null): FAQ[] {
  return lines(v)
    .map((l) => {
      const i = l.indexOf("::");
      return i === -1
        ? { question: l, answer: "" }
        : { question: l.slice(0, i).trim(), answer: l.slice(i + 2).trim() };
    })
    .filter((f) => f.question);
}

// --- auth ---
export async function loginAction(formData: FormData) {
  if (!checkPassword(str(formData.get("password")))) redirect("/admin/login?error=1");
  await createSession();
  redirect("/admin");
}

export async function logoutAction() {
  await destroySession();
  redirect("/admin/login");
}

// --- courses ---
function buildCourse(formData: FormData): { id: number | null; course: Course } {
  const idRaw = str(formData.get("id"));
  const id = idRaw && idRaw !== "new" ? Number(idRaw) : null;
  const course: Course = {
    slug: str(formData.get("slug")),
    title: str(formData.get("title")),
    courseShortName: opt(formData.get("courseShortName")),
    shortDescription: str(formData.get("shortDescription")),
    openingAnswer: opt(formData.get("openingAnswer")),
    whatIs: opt(formData.get("whatIs")),
    heroImage: opt(formData.get("heroImage")),
    order: Number(str(formData.get("order"))) || 100,
    quickFacts: {
      duration: opt(formData.get("qf_duration")),
      eligibility: opt(formData.get("qf_eligibility")),
      approvedBy: opt(formData.get("qf_approvedBy")),
      admissionStatus: opt(formData.get("qf_admissionStatus")),
    },
    highlights: lines(formData.get("highlights")),
    subjects: lines(formData.get("subjects")),
    eligibilityPoints: lines(formData.get("eligibilityPoints")),
    documentsRequired: lines(formData.get("documentsRequired")),
    admissionSteps: lines(formData.get("admissionSteps")),
    feesInfo: opt(formData.get("feesInfo")),
    careerScope: opt(formData.get("careerScope")),
    jobRoles: lines(formData.get("jobRoles")),
    workAreas: lines(formData.get("workAreas")),
    salaryRange: opt(formData.get("salaryRange")),
    higherStudies: lines(formData.get("higherStudies")),
    faqs: parseFaqs(formData.get("faqs")),
    seo: {
      title: opt(formData.get("seo_title")),
      description: opt(formData.get("seo_description")),
    },
  };
  return { id, course };
}

export async function saveCourseAction(formData: FormData) {
  await requireAdmin();
  const { id, course } = buildCourse(formData);
  if (!course.slug || !course.title) {
    redirect(`/admin/courses/${id ?? "new"}?error=required`);
  }
  await saveCourse(id, course);
  revalidatePath("/", "layout");
  redirect("/admin/courses");
}

export async function deleteCourseAction(formData: FormData) {
  await requireAdmin();
  const id = Number(str(formData.get("id")));
  if (id) await deleteCourse(id);
  revalidatePath("/", "layout");
  redirect("/admin/courses");
}

// --- branches ---
export async function saveBranchAction(formData: FormData) {
  await requireAdmin();
  const idRaw = str(formData.get("id"));
  const id = idRaw && idRaw !== "new" ? Number(idRaw) : null;
  const branch: Branch = {
    name: str(formData.get("name")),
    slug: str(formData.get("slug")),
    area: opt(formData.get("area")),
    address: opt(formData.get("address")),
    postalCode: opt(formData.get("postalCode")),
    phone: opt(formData.get("phone")),
    mapsUrl: opt(formData.get("mapsUrl")),
    mapEmbedUrl: opt(formData.get("mapEmbedUrl")),
    intro: opt(formData.get("intro")),
    localities: lines(formData.get("localities")),
    transport: opt(formData.get("transport")),
    faqs: parseFaqs(formData.get("faqs")),
    order: Number(str(formData.get("order"))) || 100,
  };
  if (!branch.slug || !branch.name) {
    redirect(`/admin/branches/${id ?? "new"}?error=required`);
  }
  await saveBranch(id, branch);
  revalidatePath("/", "layout");
  redirect("/admin/branches");
}

export async function deleteBranchAction(formData: FormData) {
  await requireAdmin();
  const id = Number(str(formData.get("id")));
  if (id) await deleteBranch(id);
  revalidatePath("/", "layout");
  redirect("/admin/branches");
}

// --- settings ---
export async function saveSettingsAction(formData: FormData) {
  await requireAdmin();
  const settings: SiteSettings = {
    orgName: str(formData.get("orgName")),
    tagline: opt(formData.get("tagline")),
    description: opt(formData.get("description")),
    domain: opt(formData.get("domain")),
    foundingYear: opt(formData.get("foundingYear")),
    phone: opt(formData.get("phone")),
    whatsappNumber: opt(formData.get("whatsappNumber")),
    email: opt(formData.get("email")),
    address: opt(formData.get("address")),
    mapEmbedUrl: opt(formData.get("mapEmbedUrl")),
    logo: opt(formData.get("logo")),
    socials: {
      facebook: opt(formData.get("facebook")),
      instagram: opt(formData.get("instagram")),
      youtube: opt(formData.get("youtube")),
    },
  };
  await saveSettings(settings);
  revalidatePath("/", "layout");
  redirect("/admin/settings?saved=1");
}

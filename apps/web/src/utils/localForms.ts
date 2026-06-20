import { ThemeConfig } from "@sec-form/shared";
import { FormField, FormSchemaType } from "@sec-form/validators";

export interface LocalForm {
  id: string;
  title: string;
  description?: string | null;
  slug: string;
  visibility: "draft" | "public" | "unlisted";
  schemaJson: FormSchemaType;
  themeJson?: ThemeConfig | null;
  userId: string;
  createdAt: string;
  updatedAt: string;
  totalViews?: number;
  totalResponses?: number;
}

const STORAGE_KEY = "sec-form:local-forms";

export function getLocalForms(): LocalForm[] {
  if (typeof window === "undefined") return [];
  try {
    const data = localStorage.getItem(STORAGE_KEY);
    return data ? JSON.parse(data) : [];
  } catch (e) {
    console.error("Failed to read local forms:", e);
    return [];
  }
}

export function saveLocalForm(form: LocalForm): void {
  if (typeof window === "undefined") return;
  try {
    const forms = getLocalForms();
    const index = forms.findIndex((f) => f.id === form.id);
    const updatedForm = {
      ...form,
      updatedAt: new Date().toISOString(),
    };
    if (index >= 0) {
      forms[index] = updatedForm;
    } else {
      forms.unshift(updatedForm);
    }
    localStorage.setItem(STORAGE_KEY, JSON.stringify(forms));
  } catch (e) {
    console.error("Failed to save local form:", e);
  }
}

export function getLocalForm(id: string): LocalForm | null {
  const forms = getLocalForms();
  return forms.find((f) => f.id === id) || null;
}

export function deleteLocalForm(id: string): void {
  if (typeof window === "undefined") return;
  try {
    const forms = getLocalForms();
    const filtered = forms.filter((f) => f.id !== id);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(filtered));
  } catch (e) {
    console.error("Failed to delete local form:", e);
  }
}

export interface LocalSubmission {
  id: string;
  formId: string;
  answersJson: Record<string, any>;
  createdAt: string;
}

const SUBMISSIONS_KEY = "sec-form:local-submissions";
const DELETED_SEEDED_KEY = "sec-form:deleted-seeded-forms";

export function getLocalSubmissions(formId: string): LocalSubmission[] {
  if (typeof window === "undefined") return [];
  try {
    const data = localStorage.getItem(SUBMISSIONS_KEY);
    const submissions: LocalSubmission[] = data ? JSON.parse(data) : [];
    return submissions.filter((s) => s.formId === formId);
  } catch (e) {
    console.error("Failed to read local submissions:", e);
    return [];
  }
}

export function saveLocalSubmission(submission: LocalSubmission): void {
  if (typeof window === "undefined") return;
  try {
    const data = localStorage.getItem(SUBMISSIONS_KEY);
    const submissions: LocalSubmission[] = data ? JSON.parse(data) : [];
    submissions.unshift(submission);
    localStorage.setItem(SUBMISSIONS_KEY, JSON.stringify(submissions));
  } catch (e) {
    console.error("Failed to save local submission:", e);
  }
}

export function getDeletedSeededFormIds(): string[] {
  if (typeof window === "undefined") return [];
  try {
    const data = localStorage.getItem(DELETED_SEEDED_KEY);
    return data ? JSON.parse(data) : [];
  } catch (e) {
    console.error("Failed to read deleted seeded form IDs:", e);
    return [];
  }
}

export function addDeletedSeededFormId(id: string): void {
  if (typeof window === "undefined") return;
  try {
    const ids = getDeletedSeededFormIds();
    if (!ids.includes(id)) {
      ids.push(id);
      localStorage.setItem(DELETED_SEEDED_KEY, JSON.stringify(ids));
    }
  } catch (e) {
    console.error("Failed to save deleted seeded form ID:", e);
  }
}


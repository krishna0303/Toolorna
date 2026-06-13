import type { Profession, Problem, Budget } from "@/types";

const VALID_PROFESSIONS: Profession[] = [
  "Student",
  "Freelancer",
  "Developer",
  "Content Creator",
  "Small Business",
  "Working Professional",
];

const VALID_PROBLEMS: Problem[] = [
  "Save Time",
  "Save Money",
  "Grow Online Presence",
  "Manage Work Better",
  "Create Content Faster",
  "Learn New Skills",
  "Build a Website",
];

const VALID_BUDGETS: Budget[] = [
  "Free Only",
  "Under ₹500",
  "₹500–₹2000",
  "₹2000+",
];

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function stripHtml(str: string): string {
  return str.replace(/<[^>]*>/g, "");
}

function sanitize(str: string): string {
  return stripHtml(str).trim();
}

export function validateEmail(email: string): { valid: boolean; message?: string } {
  const sanitized = sanitize(email);
  if (!sanitized) return { valid: false, message: "Email is required" };
  if (!EMAIL_REGEX.test(sanitized))
    return { valid: false, message: "Please enter a valid email address" };
  return { valid: true };
}

export function validateProfession(value: string): { valid: boolean; message?: string } {
  if (!value) return { valid: false, message: "Please select a profession" };
  if (!VALID_PROFESSIONS.includes(value as Profession))
    return { valid: false, message: "Invalid profession selected" };
  return { valid: true };
}

export function validateProblem(value: string): { valid: boolean; message?: string } {
  if (!value) return { valid: false, message: "Please select a challenge" };
  if (!VALID_PROBLEMS.includes(value as Problem))
    return { valid: false, message: "Invalid challenge selected" };
  return { valid: true };
}

export function validateBudget(value: string): { valid: boolean; message?: string } {
  if (!value) return { valid: false, message: "Please select a budget" };
  if (!VALID_BUDGETS.includes(value as Budget))
    return { valid: false, message: "Invalid budget selected" };
  return { valid: true };
}

export function validateToolsTried(value: string): { valid: boolean; message?: string } {
  if (value.length > 500)
    return { valid: false, message: "Please keep under 500 characters" };
  return { valid: true };
}

export function sanitizeInput(input: Record<string, unknown>): Record<string, string> {
  const result: Record<string, string> = {};
  for (const [key, value] of Object.entries(input)) {
    result[key] = typeof value === "string" ? sanitize(value) : "";
  }
  return result;
}

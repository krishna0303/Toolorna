const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function stripHtml(str: string): string {
  return str.replace(/<[^>]*>/g, "");
}

function sanitize(str: string): string {
  return stripHtml(str).trim();
}

export function validateEmail(email: string): { valid: boolean; message?: string } {
  const s = sanitize(email);
  if (!s) return { valid: false, message: "Email is required" };
  if (!EMAIL_REGEX.test(s)) return { valid: false, message: "Please enter a valid email address" };
  return { valid: true };
}

export function validateRequirements(text: string): { valid: boolean; message?: string } {
  const s = sanitize(text);
  if (!s) return { valid: false, message: "Please describe what you need" };
  if (s.length < 10) return { valid: false, message: "Please provide at least a brief description" };
  if (s.length > 2000) return { valid: false, message: "Please keep under 2000 characters" };
  return { valid: true };
}

export function sanitizeInput(input: Record<string, unknown>): Record<string, string> {
  const result: Record<string, string> = {};
  for (const [key, value] of Object.entries(input)) {
    result[key] = typeof value === "string" ? sanitize(value) : "";
  }
  return result;
}

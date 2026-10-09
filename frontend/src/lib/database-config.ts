export type DatabaseConfiguration =
  | { configured: true }
  | { configured: false; reason: "missing" | "placeholder" | "invalid" }

export function getDatabaseConfiguration(value = process.env.DATABASE_URL): DatabaseConfiguration {
  if (!value?.trim()) return { configured: false, reason: "missing" }
  if (/your-project-ref|your-password|<[^>]+>/i.test(value)) return { configured: false, reason: "placeholder" }
  try {
    const url = new URL(value)
    if ((url.protocol !== "postgresql:" && url.protocol !== "postgres:") || !url.hostname || url.pathname.length < 2) {
      return { configured: false, reason: "invalid" }
    }
    return { configured: true }
  } catch {
    return { configured: false, reason: "invalid" }
  }
}

import { timingSafeEqual } from "node:crypto"

export function isIngestAuthorized(request: Request, secret = process.env.INGEST_SECRET): boolean {
  const provided = request.headers.get("authorization")?.match(/^Bearer\s+(.+)$/i)?.[1]
  if (!secret || !provided) return false
  const expected = Buffer.from(secret)
  const actual = Buffer.from(provided)
  return expected.length === actual.length && timingSafeEqual(expected, actual)
}

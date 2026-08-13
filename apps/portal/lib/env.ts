export const DISTRICT_NAME = "Etah"
export const ULB_NAME_HINTS = [
  "municipal council",
  "municipal corporation",
  "nagar palika",
  "nagar nigam",
] as const
export const PREFERRED_ULB_TYPE = "MUNICIPAL_COUNCIL"

export function getApiBaseUrl(): string {
  const url =
    process.env.NEXT_PUBLIC_API_BASE_URL ?? process.env.NEXT_PUBLIC_API_URL
  if (!url) {
    throw new Error("NEXT_PUBLIC_API_BASE_URL is not configured")
  }
  return url.replace(/\/$/, "")
}

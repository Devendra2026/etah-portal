export const DISTRICT_NAME = "Etah"
export const ULB_NAME_HINTS = [
  "municipal council",
  "municipal corporation",
  "nagar palika",
  "nagar nigam",
] as const
export const PREFERRED_ULB_TYPE = "MUNICIPAL_COUNCIL"

export const NEST_API_PROXY_PREFIX = "/nest-api"

const PRODUCTION_API_HOST = "backend.sdvedutech.in"
const PRODUCTION_API_ORIGIN = `https://${PRODUCTION_API_HOST}`
const LOCAL_API_ORIGIN = "http://localhost:4000"

export function getNestApiOrigin(): string {
  const configured =
    process.env.NEST_API_ORIGIN ?? process.env.API_URL ?? ""
  if (configured) return configured.replace(/\/$/, "")
  return process.env.NODE_ENV === "production"
    ? PRODUCTION_API_ORIGIN
    : LOCAL_API_ORIGIN
}

export function isLocalBrowserHost(hostname: string): boolean {
  return (
    hostname === "localhost" ||
    hostname === "127.0.0.1" ||
    hostname === "::1"
  )
}

export function productionApiBlockedFromLocal(origin: string, hostname: string): boolean {
  if (!isLocalBrowserHost(hostname)) return false
  try {
    return new URL(origin).hostname === PRODUCTION_API_HOST
  } catch {
    return origin.includes(PRODUCTION_API_HOST)
  }
}

export function getApiBaseUrl(): string {
  const url =
    process.env.NEXT_PUBLIC_API_BASE_URL ??
    process.env.NEXT_PUBLIC_API_URL ??
    NEST_API_PROXY_PREFIX
  return url.replace(/\/$/, "")
}

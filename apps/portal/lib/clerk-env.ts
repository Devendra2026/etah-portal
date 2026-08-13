const PORTAL_ORIGIN = "https://portal.nppetah.in"

export function getPortalOrigin(): string {
  return (process.env.NEXT_PUBLIC_APP_URL ?? PORTAL_ORIGIN).replace(/\/$/, "")
}

export function getAllowedRedirectOrigins(): string[] {
  const origins = new Set<string>([PORTAL_ORIGIN])
  origins.add(getPortalOrigin())
  return [...origins]
}

export function isPortalProductionBuild(): boolean {
  const appUrl = process.env.NEXT_PUBLIC_APP_URL ?? ""
  return (
    process.env.CI === "true" ||
    (process.env.NODE_ENV === "production" &&
      appUrl.includes("portal.nppetah.in"))
  )
}

export function assertClerkProductionConfig(): void {
  const publishable = process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY ?? ""
  const secret = process.env.CLERK_SECRET_KEY ?? ""
  const satellite = process.env.NEXT_PUBLIC_CLERK_IS_SATELLITE
  const encryption = process.env.CLERK_ENCRYPTION_KEY ?? ""
  const production = isPortalProductionBuild()

  const errors: string[] = []

  if (!publishable.startsWith("pk_")) {
    errors.push(
      "NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY is required. Copy apps/portal/env.example to apps/portal/.env.local and set the Clerk publishable key."
    )
  } else if (production && !publishable.startsWith("pk_live_")) {
    errors.push(
      "NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY must be pk_live_ from the Etah portal Clerk production instance (nppetah.in). pk_test_ causes X-Clerk-Auth-Reason: dev-browser-missing and blocked cookies."
    )
  }

  if (!secret.startsWith("sk_")) {
    errors.push(
      "CLERK_SECRET_KEY is required. Copy apps/portal/env.example to apps/portal/.env.local and set the Clerk secret key."
    )
  } else if (production && !secret.startsWith("sk_live_")) {
    errors.push(
      "CLERK_SECRET_KEY must be sk_live_ from the same portal Clerk production instance."
    )
  }

  if (!production) {
    if (errors.length > 0) {
      throw new Error(`Clerk is not configured:\n- ${errors.join("\n- ")}`)
    }
    return
  }

  if (satellite === "true") {
    errors.push(
      "NEXT_PUBLIC_CLERK_IS_SATELLITE must not be set. This portal hosts its own sign-in."
    )
  }
  if (process.env.NEXT_PUBLIC_CLERK_PRIMARY_SIGN_IN_URL) {
    errors.push(
      "Remove NEXT_PUBLIC_CLERK_PRIMARY_SIGN_IN_URL. Sign-in is /sign-in on this host."
    )
  }
  if (encryption.length < 16) {
    errors.push(
      "CLERK_ENCRYPTION_KEY is required in production (openssl rand -base64 32)."
    )
  }

  if (errors.length > 0) {
    throw new Error(
      `Clerk production config is invalid:\n- ${errors.join("\n- ")}`
    )
  }
}

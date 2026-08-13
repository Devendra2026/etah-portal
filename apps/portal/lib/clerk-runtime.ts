const SATELLITE_DOMAIN =
  process.env.NEXT_PUBLIC_CLERK_SATELLITE_DOMAIN ?? "portal.nppetah.in"
const PRIMARY_SIGN_IN =
  process.env.NEXT_PUBLIC_CLERK_PRIMARY_SIGN_IN_URL ??
  "https://admin.sdvedutech.in/sign-in"
const PRIMARY_SIGN_UP =
  process.env.NEXT_PUBLIC_CLERK_PRIMARY_SIGN_UP_URL ??
  "https://admin.sdvedutech.in/sign-up"

export function isClerkSatellite(): boolean {
  return process.env.NEXT_PUBLIC_CLERK_IS_SATELLITE === "true"
}

export function clerkSatelliteOptions() {
  return {
    isSatellite: true as const,
    domain: SATELLITE_DOMAIN,
    signInUrl: PRIMARY_SIGN_IN,
    signUpUrl: PRIMARY_SIGN_UP,
  }
}

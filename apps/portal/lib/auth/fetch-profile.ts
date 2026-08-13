import { getNestApiOrigin } from "@/lib/env"
import type { AuthenticatedProfile } from "@/types/auth"

function unwrapProfile(body: unknown): AuthenticatedProfile | null {
  if (!body || typeof body !== "object") return null
  const record = body as Record<string, unknown>
  if ("success" in record && "data" in record) {
    const inner = record.data
    if (!inner || typeof inner !== "object") return null
    return inner as AuthenticatedProfile
  }
  return body as AuthenticatedProfile
}

export async function fetchAuthenticatedProfile(token: string): Promise<{
  status: number
  profile: AuthenticatedProfile | null
}> {
  const origin = getNestApiOrigin()
  let response: Response
  try {
    response = await fetch(`${origin}/users/me`, {
      headers: { Authorization: `Bearer ${token}` },
      cache: "no-store",
    })
  } catch {
    return { status: 502, profile: null }
  }
  if (!response.ok) {
    return { status: response.status, profile: null }
  }
  const body: unknown = await response.json()
  return { status: 200, profile: unwrapProfile(body) }
}

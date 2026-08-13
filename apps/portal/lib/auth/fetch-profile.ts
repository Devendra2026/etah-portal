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

function nestMessage(body: unknown, fallback: string): string {
  if (!body || typeof body !== "object") return fallback
  const message = (body as { message?: unknown }).message
  return typeof message === "string" && message.length > 0 ? message : fallback
}

export async function fetchAuthenticatedProfile(token: string): Promise<{
  status: number
  profile: AuthenticatedProfile | null
  message: string | null
}> {
  const origin = getNestApiOrigin()
  let response: Response
  try {
    response = await fetch(`${origin}/users/me`, {
      headers: { Authorization: `Bearer ${token}` },
      cache: "no-store",
    })
  } catch {
    return {
      status: 502,
      profile: null,
      message: `Unable to reach the survey API at ${origin}.`,
    }
  }
  if (!response.ok) {
    let body: unknown = null
    try {
      body = await response.json()
    } catch {
      body = null
    }
    return {
      status: response.status,
      profile: null,
      message: nestMessage(body, `Survey API returned ${response.status}.`),
    }
  }
  const body: unknown = await response.json()
  return { status: 200, profile: unwrapProfile(body), message: null }
}

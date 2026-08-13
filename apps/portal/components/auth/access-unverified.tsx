"use client"

import { MUNICIPALITY_SHORT } from "@/lib/branding"
import { SignOutButton } from "@clerk/nextjs"

export type AccessUnverifiedReason =
  | "missing-token"
  | "rejected"
  | "unreachable"

export function AccessUnverified({
  reason,
  detail,
}: {
  reason: AccessUnverifiedReason
  detail?: string | null
}) {
  const copy = copyForReason(reason, detail)

  return (
    <main className="mx-auto flex min-h-screen max-w-lg flex-col justify-center gap-4 px-6">
      <h1 className="text-xl font-semibold text-foreground">
        Could not verify your {MUNICIPALITY_SHORT} account
      </h1>
      <p className="text-sm text-muted-foreground">{copy.body}</p>
      {copy.ops ? (
        <pre className="overflow-x-auto rounded-md border border-border bg-muted px-3 py-2 text-xs text-muted-foreground">
          {copy.ops}
        </pre>
      ) : null}
      <SignOutButton redirectUrl="/sign-in">
        <button
          type="button"
          className="w-fit cursor-pointer rounded-md border border-border bg-card px-4 py-2 text-sm font-medium"
        >
          Sign out
        </button>
      </SignOutButton>
    </main>
  )
}

function copyForReason(
  reason: AccessUnverifiedReason,
  detail?: string | null
): { body: string; ops: string | null } {
  if (reason === "missing-token") {
    return {
      body: "You are signed in, but Clerk did not issue a session token for the survey API. Sign out, then sign in again.",
      ops: null,
    }
  }
  if (reason === "unreachable") {
    return {
      body:
        detail ??
        "The survey API could not be reached from this portal. Check NEST_API_ORIGIN on the portal deploy.",
      ops: "NEST_API_ORIGIN=https://backend.sdvedutech.in",
    }
  }
  return {
    body: "Clerk signed you in on this portal, but the survey API rejected the session token. That almost always means api-survey-apps is still verifying JWTs with the SDV admin Clerk secret only.",
    ops: [
      detail ? `Survey API: ${detail}` : null,
      "On api-survey-apps (not this portal), set:",
      "PORTAL_CLERK_SECRET_KEY=<same sk_live_ as this portal>",
      "PORTAL_CLERK_AUTHORIZED_PARTIES=https://portal.nppetah.in",
      "Then redeploy the API.",
    ]
      .filter(Boolean)
      .join("\n"),
  }
}

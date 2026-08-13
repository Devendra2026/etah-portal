"use client"

import { MUNICIPALITY_SHORT } from "@/lib/branding"
import { SignOutButton } from "@clerk/nextjs"

export function AccessUnverified() {
  return (
    <main className="mx-auto flex min-h-screen max-w-lg flex-col justify-center gap-4 px-6">
      <h1 className="text-xl font-semibold text-foreground">
        Could not verify your {MUNICIPALITY_SHORT} account
      </h1>
      <p className="text-sm text-muted-foreground">
        You are signed in on this portal, but the survey service did not accept
        this session. Sign out, then sign in again. If this continues, ask an
        administrator to confirm portal Clerk keys match the survey API.
      </p>
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

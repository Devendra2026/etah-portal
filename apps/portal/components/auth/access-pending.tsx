"use client"

import { MUNICIPALITY_SHORT } from "@/lib/branding"
import { SignOutButton } from "@clerk/nextjs"

export function AccessPending() {
  return (
    <main className="mx-auto flex min-h-screen max-w-lg flex-col justify-center gap-4 px-6">
      <h1 className="text-xl font-semibold text-foreground">
        Access to {MUNICIPALITY_SHORT} is pending
      </h1>
      <p className="text-sm text-muted-foreground">
        You are signed in on this portal. An Etah department administrator must
        grant a municipal role under Settings → User Permissions before survey
        data from the SDV API is available.
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

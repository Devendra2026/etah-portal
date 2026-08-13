"use client"

import { MUNICIPALITY_SHORT } from "@/lib/branding"
import { SignOutButton } from "@clerk/nextjs"

const ADMIN_SIGN_IN = "https://admin.sdvedutech.in/sign-in"

export function AccessPending() {
  return (
    <main className="mx-auto flex min-h-screen max-w-lg flex-col justify-center gap-4 px-6">
      <h1 className="text-xl font-semibold text-foreground">
        Access to {MUNICIPALITY_SHORT} is pending
      </h1>
      <p className="text-sm text-muted-foreground">
        You signed in with the SDV Clerk account. An Etah department administrator
        must grant a municipal role on this portal before survey and tax screens
        are available. Clerk accounts are created on{" "}
        <a
          className="font-medium text-foreground underline underline-offset-2"
          href={ADMIN_SIGN_IN}
        >
          admin.sdvedutech.in
        </a>
        .
      </p>
      <SignOutButton redirectUrl={ADMIN_SIGN_IN}>
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

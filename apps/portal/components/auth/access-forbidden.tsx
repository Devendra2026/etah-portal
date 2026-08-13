import { MUNICIPALITY_SHORT } from "@/lib/branding"
import Link from "next/link"

export function AccessForbidden() {
  return (
    <main className="mx-auto flex min-h-[50vh] max-w-lg flex-col justify-center gap-4 px-6">
      <h1 className="text-xl font-semibold text-foreground">
        You cannot manage {MUNICIPALITY_SHORT} users
      </h1>
      <p className="text-sm text-muted-foreground">
        Settings requires the role:assign permission. Ask an Etah department
        administrator to grant access if you need to assign municipal roles.
      </p>
      <Link
        href="/dashboard"
        className="w-fit rounded-md border border-border bg-card px-4 py-2 text-sm font-medium"
      >
        Back to dashboard
      </Link>
    </main>
  )
}

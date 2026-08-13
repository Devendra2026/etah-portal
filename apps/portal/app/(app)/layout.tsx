import { AccessPending } from "@/components/auth/access-pending"
import { AppShell } from "@/components/layout/app-shell"
import { fetchAuthenticatedProfile } from "@/lib/auth/fetch-profile"
import { hasPortalAccess } from "@/lib/auth/portal-access"
import { auth } from "@clerk/nextjs/server"
import { redirect } from "next/navigation"

export default async function AppGroupLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const { getToken } = await auth.protect()
  const token = await getToken()
  if (!token) {
    redirect("https://admin.sdvedutech.in/sign-in")
  }

  const current = await fetchAuthenticatedProfile(token)
  if (current.status === 401) {
    redirect("https://admin.sdvedutech.in/sign-in")
  }
  if (!hasPortalAccess(current.profile?.permissions)) {
    return <AccessPending />
  }

  return <AppShell>{children}</AppShell>
}

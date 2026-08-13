import { AccessPending } from "@/components/auth/access-pending"
import { AccessUnverified } from "@/components/auth/access-unverified"
import { AppShell } from "@/components/layout/app-shell"
import { fetchAuthenticatedProfile } from "@/lib/auth/fetch-profile"
import { hasPortalAccess } from "@/lib/auth/portal-access"
import { auth } from "@clerk/nextjs/server"

export default async function AppGroupLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const { getToken } = await auth.protect()
  const token = await getToken()
  if (!token) {
    return <AccessUnverified />
  }

  const current = await fetchAuthenticatedProfile(token)
  if (current.status === 401 || current.status === 502) {
    return <AccessUnverified />
  }
  if (!hasPortalAccess(current.profile?.permissions)) {
    return <AccessPending />
  }

  return <AppShell>{children}</AppShell>
}

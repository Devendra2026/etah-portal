import { AccessForbidden } from "@/components/auth/access-forbidden"
import { AccessUnverified } from "@/components/auth/access-unverified"
import { fetchAuthenticatedProfile } from "@/lib/auth/fetch-profile"
import { canGrantDepartmentAccess } from "@/lib/auth/portal-access"
import { auth } from "@clerk/nextjs/server"

export default async function SettingsLayout({
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
  if (!canGrantDepartmentAccess(current.profile?.permissions)) {
    return <AccessForbidden />
  }

  return children
}

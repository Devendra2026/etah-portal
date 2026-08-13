import { AccessForbidden } from "@/components/auth/access-forbidden"
import { fetchAuthenticatedProfile } from "@/lib/auth/fetch-profile"
import { canGrantDepartmentAccess } from "@/lib/auth/portal-access"
import { auth } from "@clerk/nextjs/server"
import { redirect } from "next/navigation"

export default async function SettingsLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const { getToken } = await auth.protect()
  const token = await getToken()
  if (!token) {
    redirect("/sign-in")
  }

  const current = await fetchAuthenticatedProfile(token)
  if (current.status === 401) {
    redirect("/sign-in")
  }
  if (!canGrantDepartmentAccess(current.profile?.permissions)) {
    return <AccessForbidden />
  }

  return children
}

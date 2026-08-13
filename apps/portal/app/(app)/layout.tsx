import { AppShell } from "@/components/layout/app-shell"
import { auth } from "@clerk/nextjs/server"

export default async function AppGroupLayout({
  children,
}: {
  children: React.ReactNode
}) {
  await auth.protect()
  return <AppShell>{children}</AppShell>
}

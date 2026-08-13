"use client"

import { AppHeader } from "@/components/layout/header"
import { AppSidebar } from "@/components/layout/sidebar"
import { SidebarProvider } from "@/components/layout/sidebar-context"

export function AppShell({ children }: { children: React.ReactNode }) {
  return (
    <SidebarProvider>
      <div className="flex h-svh min-h-0 overflow-hidden bg-background print:h-auto print:overflow-visible">
        <AppSidebar />
        <div className="flex min-h-0 min-w-0 flex-1 flex-col overflow-hidden print:overflow-visible">
          <AppHeader />
          <main className="min-h-0 flex-1 overflow-x-hidden overflow-y-auto print:h-auto print:overflow-visible">
            <div className="mx-auto w-full max-w-[1600px] px-4 py-5 sm:px-6 lg:px-8 lg:py-6 print:max-w-none print:px-0 print:py-0">
              {children}
            </div>
          </main>
        </div>
      </div>
    </SidebarProvider>
  )
}

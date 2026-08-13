"use client"

import { SidebarCollapseButton as CollapseControl } from "@/components/layout/sidebar"
import { useSidebar } from "@/components/layout/sidebar-context"
import { useCurrentUserProfile } from "@/hooks/use-current-user"
import { useEtahScope } from "@/hooks/use-etah-scope"
import { clerkAppearance } from "@/lib/clerk-appearance"
import { UserButton, useUser } from "@clerk/nextjs"
import { Button } from "@workspace/ui/components/button"
import { Input } from "@workspace/ui/components/input"
import { Bell, MapPin, Menu, Moon, Search, Settings, Sun } from "lucide-react"
import { useTheme } from "next-themes"
import { useRouter } from "next/navigation"
import { useCallback, useState } from "react"

export function AppHeader() {
  const { toggleMobile } = useSidebar()
  const router = useRouter()
  const { user } = useUser()
  const profile = useCurrentUserProfile()
  const scope = useEtahScope()
  const { resolvedTheme, setTheme } = useTheme()
  const [search, setSearch] = useState("")

  const displayName = profile.data?.fullName || user?.fullName || "Officer"
  const roleName =
    profile.data?.tenantRoles?.find((role) => role.isActive)?.role?.name ??
    profile.data?.tenantRoles?.find((role) => role.isActive)?.roleName ??
    "Viewer"

  const handleSearch = useCallback(
    (event: React.FormEvent) => {
      event.preventDefault()
      const query = search.trim()
      if (query) {
        router.push(`/survey/properties?search=${encodeURIComponent(query)}`)
      }
    },
    [router, search]
  )

  return (
    <header className="z-10 flex h-16 shrink-0 items-center gap-3 border-b border-border bg-card px-3 sm:px-5 print:hidden">
      <Button
        type="button"
        variant="ghost"
        size="icon"
        className="shrink-0 lg:hidden"
        onClick={toggleMobile}
        aria-label="Open navigation menu"
      >
        <Menu className="size-5" />
      </Button>

      <CollapseControl />

      <form
        onSubmit={handleSearch}
        className="relative hidden min-w-0 flex-1 md:block md:max-w-md lg:max-w-lg"
        role="search"
      >
        <Search
          className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted-foreground"
          aria-hidden
        />
        <Input
          value={search}
          onChange={(event) => setSearch(event.target.value)}
          placeholder="Search properties, surveys, wards..."
          className="h-10 rounded-xl bg-background pl-10"
          aria-label="Search properties, surveys, and wards"
        />
      </form>

      <div className="ml-auto flex items-center gap-1.5 sm:gap-2">
        <div
          className="hidden items-center gap-1.5 rounded-lg border border-border bg-background px-2.5 py-1.5 text-sm md:flex"
          aria-label="Active district"
        >
          <MapPin className="size-3.5 text-brand-red" aria-hidden />
          <span className="font-medium">
            {scope.data?.districtName ?? "Etah"}
          </span>
          {scope.data?.ulbName ? (
            <span className="hidden text-muted-foreground lg:inline">
              · {scope.data.ulbName}
            </span>
          ) : null}
        </div>

        <Button
          type="button"
          variant="ghost"
          size="icon"
          aria-label="Notifications"
        >
          <Bell className="size-4" />
        </Button>

        <Button
          type="button"
          variant="ghost"
          size="icon"
          aria-label={
            resolvedTheme === "dark"
              ? "Switch to light mode"
              : "Switch to dark mode"
          }
          onClick={() => setTheme(resolvedTheme === "dark" ? "light" : "dark")}
        >
          {resolvedTheme === "dark" ? (
            <Sun className="size-4" />
          ) : (
            <Moon className="size-4" />
          )}
        </Button>

        <div className="flex items-center gap-2 rounded-lg px-1.5 py-1">
          <UserButton userProfileMode="modal" appearance={clerkAppearance}>
            <UserButton.MenuItems>
              <UserButton.Link
                label="Settings"
                labelIcon={<Settings className="size-4" />}
                href="/settings/users"
              />
            </UserButton.MenuItems>
          </UserButton>
          <span className="hidden min-w-0 text-left sm:block">
            <span className="block truncate text-sm font-medium">
              {displayName}
            </span>
            <span className="block truncate text-xs text-muted-foreground">
              {roleName}
            </span>
          </span>
        </div>
      </div>
    </header>
  )
}

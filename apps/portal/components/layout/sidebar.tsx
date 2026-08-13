"use client"

import { useSidebar } from "@/components/layout/sidebar-context"
import { useCurrentUserProfile } from "@/hooks/use-current-user"
import { MUNICIPALITY_NAME } from "@/lib/branding"
import { isNavActive, NAV_ITEMS } from "@/lib/nav"
import { useUser } from "@clerk/nextjs"
import { Avatar, AvatarFallback } from "@workspace/ui/components/avatar"
import { Button } from "@workspace/ui/components/button"
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@workspace/ui/components/sheet"
import { cn } from "@workspace/ui/lib/utils"
import Link from "next/link"
import { usePathname } from "next/navigation"

function initials(name: string): string {
  return name
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase() ?? "")
    .join("")
}

function Brand({ collapsed }: { collapsed?: boolean }) {
  return (
    <div className="flex h-[4.5rem] shrink-0 items-center border-b border-sidebar-border px-3">
      <Link
        href="/dashboard"
        className="flex min-w-0 cursor-pointer items-center gap-2.5 rounded-lg px-1 py-1 transition-opacity duration-200 hover:opacity-90"
        aria-label={`${MUNICIPALITY_NAME} home`}
      >
        {/* eslint-disable-next-line @next/next/no-img-element -- municipal seal is a local SVG asset */}
        <img
          src="/municipal-emblem.svg"
          alt=""
          width={44}
          height={44}
          className="size-11 shrink-0 rounded-full"
        />
        <span
          className={cn(
            "min-w-0 transition-all duration-200",
            collapsed ? "sr-only" : "block"
          )}
        >
          <span className="block truncate text-sm leading-tight font-semibold text-sidebar-foreground">
            {MUNICIPALITY_NAME}
          </span>
          <span className="block truncate text-[11px] font-medium text-muted-foreground">
            Municipal Council
          </span>
        </span>
      </Link>
    </div>
  )
}

function Nav({
  collapsed,
  onNavigate,
}: {
  collapsed?: boolean
  onNavigate?: () => void
}) {
  const pathname = usePathname()

  return (
    <nav
      className="flex-1 space-y-1 overflow-y-auto px-2 py-3"
      aria-label="Main navigation"
    >
      {NAV_ITEMS.map((item) => {
        const Icon = item.icon
        const active = isNavActive(pathname, item.href, !item.children)
        const link = (
          <Link
            href={item.children?.[0]?.href ?? item.href}
            title={collapsed ? item.label : undefined}
            onClick={onNavigate}
            aria-current={active ? "page" : undefined}
            className={cn(
              "group relative flex cursor-pointer items-center gap-3 rounded-lg py-2 text-sm font-medium transition-colors duration-200",
              collapsed ? "justify-center px-2" : "px-3",
              active
                ? "bg-brand-navy/10 text-brand-navy"
                : "text-sidebar-foreground/70 hover:bg-sidebar-accent hover:text-sidebar-foreground"
            )}
          >
            {active ? (
              <span
                className={cn(
                  "absolute top-1/2 left-0 h-5 w-0.5 -translate-y-1/2 rounded-r-full bg-brand-navy",
                  collapsed && "opacity-0"
                )}
                aria-hidden
              />
            ) : null}
            <Icon
              className={cn(
                "size-4 shrink-0",
                active
                  ? "text-brand-navy"
                  : "text-sidebar-foreground/55 group-hover:text-sidebar-foreground"
              )}
              aria-hidden
            />
            <span className={cn("truncate", collapsed && "sr-only")}>
              {item.label}
            </span>
          </Link>
        )

        return (
          <div key={item.href}>
            {link}
            {item.children && !collapsed ? (
              <ul className="mt-0.5 mb-2 space-y-0.5">
                {item.children.map((child) => {
                  const childActive =
                    pathname === child.href ||
                    pathname.startsWith(`${child.href}/`)
                  return (
                    <li key={child.href}>
                      <Link
                        href={child.href}
                        onClick={onNavigate}
                        aria-current={childActive ? "page" : undefined}
                        className={cn(
                          "flex cursor-pointer rounded-lg py-1.5 pr-3 pl-9 text-[13px] transition-colors duration-200",
                          childActive
                            ? "bg-brand-navy/10 font-medium text-brand-navy"
                            : "text-sidebar-foreground/65 hover:bg-sidebar-accent hover:text-sidebar-foreground"
                        )}
                      >
                        {child.label}
                      </Link>
                    </li>
                  )
                })}
              </ul>
            ) : null}
          </div>
        )
      })}
    </nav>
  )
}

export function AppSidebar() {
  const { collapsed, mobileOpen, setMobileOpen } = useSidebar()

  return (
    <>
      <aside
        className={cn(
          "relative hidden h-full min-h-0 shrink-0 flex-col overflow-hidden border-r border-sidebar-border bg-sidebar lg:flex print:hidden",
          collapsed ? "w-16" : "w-64"
        )}
        aria-label="Sidebar"
      >
        <Brand collapsed={collapsed} />
        <Nav collapsed={collapsed} />
        <SidebarUser collapsed={collapsed} />
      </aside>

      <Sheet open={mobileOpen} onOpenChange={setMobileOpen}>
        <SheetContent
          side="left"
          className="flex h-full w-64 flex-col border-sidebar-border bg-sidebar p-0"
        >
          <SheetHeader className="sr-only">
            <SheetTitle>Navigation</SheetTitle>
            <SheetDescription>
              Nagar Palika Parishad, Etah main navigation
            </SheetDescription>
          </SheetHeader>
          <Brand />
          <Nav onNavigate={() => setMobileOpen(false)} />
          <SidebarUser />
        </SheetContent>
      </Sheet>
    </>
  )
}

function SidebarUser({ collapsed }: { collapsed?: boolean }) {
  const { user } = useUser()
  const profile = useCurrentUserProfile()
  const displayName = profile.data?.fullName || user?.fullName || "Officer"
  const roleName =
    profile.data?.tenantRoles?.find((role) => role.isActive)?.role?.name ??
    profile.data?.tenantRoles?.find((role) => role.isActive)?.roleName ??
    "Viewer"

  return (
    <div className="mt-auto border-t border-sidebar-border p-3">
      <div
        className={cn(
          "flex items-center gap-2.5",
          collapsed && "justify-center"
        )}
      >
        <Avatar className="size-8">
          <AvatarFallback className="bg-brand-navy text-[11px] text-white">
            {initials(displayName)}
          </AvatarFallback>
        </Avatar>
        <div className={cn("min-w-0", collapsed && "sr-only")}>
          <p className="truncate text-sm font-medium text-sidebar-foreground">
            {displayName}
          </p>
          <p className="truncate text-[11px] text-muted-foreground">
            {roleName}
          </p>
        </div>
      </div>
    </div>
  )
}

export function SidebarCollapseButton() {
  const { collapsed, toggleCollapsed } = useSidebar()
  return (
    <Button
      type="button"
      variant="ghost"
      size="icon"
      className="hidden shrink-0 lg:inline-flex"
      onClick={toggleCollapsed}
      aria-label={collapsed ? "Expand sidebar" : "Collapse sidebar"}
    >
      <span className="sr-only">
        {collapsed ? "Expand sidebar" : "Collapse sidebar"}
      </span>
      <svg viewBox="0 0 24 24" className="size-4" aria-hidden>
        <path
          d="M4 6h16M4 12h10M4 18h16"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.75"
          strokeLinecap="round"
        />
      </svg>
    </Button>
  )
}

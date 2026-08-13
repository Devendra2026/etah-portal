import type { LucideIcon } from "lucide-react"
import {
  ClipboardCheck,
  FileBarChart,
  IndianRupee,
  LayoutDashboard,
  Settings,
} from "lucide-react"

export interface NavChild {
  href: string
  label: string
}

export interface NavItem {
  href: string
  label: string
  icon: LucideIcon
  children?: NavChild[]
}

export const NAV_ITEMS: NavItem[] = [
  { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  {
    href: "/survey",
    label: "Survey",
    icon: ClipboardCheck,
    children: [
      { href: "/survey/overview", label: "Survey Overview" },
      { href: "/survey/properties", label: "Survey Registry" },
    ],
  },
  {
    href: "/report",
    label: "Reports",
    icon: FileBarChart,
    children: [
      { href: "/report/ward-collection", label: "Ward-wise Collection" },
      { href: "/report/demand-notice", label: "Demand Notice" },
      { href: "/report/survey-excel", label: "Survey Excel" },
      { href: "/report/survey", label: "Survey Report" },
    ],
  },
  {
    href: "/payments",
    label: "Payments",
    icon: IndianRupee,
    children: [
      { href: "/payments/cash-desk", label: "Cash Desk" },
      { href: "/payments/transactions", label: "Transactions" },
    ],
  },
  {
    href: "/settings",
    label: "Settings",
    icon: Settings,
    children: [
      { href: "/settings/permissions", label: "User Permissions" },
      { href: "/settings/users", label: "Users List" },
    ],
  },
]

export function isNavActive(
  pathname: string,
  href: string,
  exact = false
): boolean {
  if (exact || href === "/dashboard") {
    return pathname === href
  }
  if (href === "/payments") {
    return pathname === href || pathname.startsWith("/payments/")
  }
  if (href === "/settings") {
    return pathname === href || pathname.startsWith("/settings/")
  }
  return pathname === href || pathname.startsWith(`${href}/`)
}

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
      { href: "/survey/wards", label: "Ward Survey" },
      { href: "/survey/properties", label: "Survey Registry" },
      { href: "/survey/status", label: "Survey Status" },
    ],
  },
  {
    href: "/report",
    label: "Report",
    icon: FileBarChart,
    children: [
      { href: "/report/survey", label: "Survey Report" },
      { href: "/report/ward", label: "Ward Report" },
      { href: "/report/tax", label: "Tax Report" },
      { href: "/report/tax-collection", label: "Collection Report" },
    ],
  },
  {
    href: "/tax-collection",
    label: "Tax Collection",
    icon: IndianRupee,
    children: [
      { href: "/tax-collection/property-tax", label: "Property Tax" },
      { href: "/tax-collection/water-tax", label: "Water Tax" },
      { href: "/tax-collection/drainage-tax", label: "Drainage Tax" },
      { href: "/tax-collection", label: "Collection Overview" },
    ],
  },
  { href: "/settings", label: "Settings", icon: Settings },
]

export function isNavActive(
  pathname: string,
  href: string,
  exact = false
): boolean {
  if (exact || href === "/dashboard") {
    return pathname === href
  }
  if (href === "/tax-collection") {
    return pathname === href || pathname.startsWith("/tax-collection/")
  }
  return pathname === href || pathname.startsWith(`${href}/`)
}

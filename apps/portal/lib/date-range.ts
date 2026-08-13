import { endOfMonth, format, startOfMonth, subDays, subMonths } from "date-fns"

export type DatePreset =
  | "all"
  | "today"
  | "yesterday"
  | "last7"
  | "last30"
  | "thisMonth"
  | "previousMonth"
  | "custom"

export interface DateRangeValue {
  preset: DatePreset
  dateFrom?: string
  dateTo?: string
}

function iso(date: Date): string {
  return format(date, "yyyy-MM-dd")
}

export function resolveDateRange(value: DateRangeValue): {
  dateFrom?: string
  dateTo?: string
} {
  const today = new Date()

  switch (value.preset) {
    case "all":
      return {}
    case "today":
      return { dateFrom: iso(today), dateTo: iso(today) }
    case "yesterday": {
      const yesterday = subDays(today, 1)
      return { dateFrom: iso(yesterday), dateTo: iso(yesterday) }
    }
    case "last7":
      return { dateFrom: iso(subDays(today, 6)), dateTo: iso(today) }
    case "last30":
      return { dateFrom: iso(subDays(today, 29)), dateTo: iso(today) }
    case "thisMonth":
      return { dateFrom: iso(startOfMonth(today)), dateTo: iso(today) }
    case "previousMonth": {
      const prev = subMonths(today, 1)
      return {
        dateFrom: iso(startOfMonth(prev)),
        dateTo: iso(endOfMonth(prev)),
      }
    }
    case "custom":
      return { dateFrom: value.dateFrom, dateTo: value.dateTo }
    default: {
      const _exhaustive: never = value.preset
      return _exhaustive
    }
  }
}

export const DATE_PRESET_LABELS: Record<DatePreset, string> = {
  all: "All time",
  today: "Today",
  yesterday: "Yesterday",
  last7: "Last 7 days",
  last30: "Last 30 days",
  thisMonth: "This month",
  previousMonth: "Previous month",
  custom: "Custom range",
}

const CRORE = 1_00_00_000
const LAKH = 1_00_000

export function formatInr(amount: number | null | undefined): string {
  if (amount === null || amount === undefined || Number.isNaN(amount)) {
    return "—"
  }

  if (Math.abs(amount) >= CRORE) {
    return `₹${(amount / CRORE).toFixed(2)} Cr`
  }

  if (Math.abs(amount) >= LAKH) {
    return `₹${(amount / LAKH).toFixed(1)} L`
  }

  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(amount)
}

export function formatInrExact(amount: number | null | undefined): string {
  if (amount === null || amount === undefined || Number.isNaN(amount)) {
    return "—"
  }

  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(amount)
}

export function formatNumber(value: number | null | undefined): string {
  if (value === null || value === undefined || Number.isNaN(value)) {
    return "—"
  }
  return new Intl.NumberFormat("en-IN").format(value)
}

export function formatPercent(
  value: number | null | undefined,
  digits = 1
): string {
  if (value === null || value === undefined || Number.isNaN(value)) {
    return "—"
  }
  return `${value.toFixed(digits)}%`
}

export function percentOf(part: number, total: number): number {
  if (total <= 0) return 0
  return (part / total) * 100
}

export function displayValue(value: string | number | null | undefined): string {
  if (value === null || value === undefined) return "—"
  const text = String(value).trim()
  if (!text || text === "—") return "—"
  return text
}

export function formatDate(value: string | number | Date | null | undefined): string {
  if (value === null || value === undefined || value === "") return "—"
  const date = value instanceof Date ? value : new Date(value)
  if (Number.isNaN(date.getTime())) return displayValue(String(value))
  return new Intl.DateTimeFormat("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  }).format(date)
}

export function formatDateTime(
  value: string | number | Date | null | undefined
): string {
  if (value === null || value === undefined || value === "") return "—"
  const date = value instanceof Date ? value : new Date(value)
  if (Number.isNaN(date.getTime())) return displayValue(String(value))
  return new Intl.DateTimeFormat("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "numeric",
    minute: "2-digit",
    hour12: true,
  }).format(date)
}

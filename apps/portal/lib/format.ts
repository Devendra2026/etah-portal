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

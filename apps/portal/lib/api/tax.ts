import type { CommandCenterFilters } from "@/types/survey"
import type { TaxKind, TaxSummary } from "@/types/tax"

const UNAVAILABLE_MESSAGE =
  "Assessed and collection totals are not available from the survey API yet. Showing survey operations only."

export async function getEtahTaxSummary(
  _filters: CommandCenterFilters,
  kind: TaxKind | "all" = "all"
): Promise<TaxSummary> {
  return {
    available: false,
    kind,
    message: UNAVAILABLE_MESSAGE,
  }
}

export async function getEtahPropertyTax(
  filters: CommandCenterFilters
): Promise<TaxSummary> {
  return getEtahTaxSummary(filters, "property")
}

export async function getEtahWaterTax(
  filters: CommandCenterFilters
): Promise<TaxSummary> {
  return getEtahTaxSummary(filters, "water")
}

export async function getEtahDrainageTax(
  filters: CommandCenterFilters
): Promise<TaxSummary> {
  return getEtahTaxSummary(filters, "drainage")
}

export async function getTaxCollectionTrend(filters: CommandCenterFilters) {
  return {
    available: false as const,
    message: "Collection trend requires a tax collection ledger API.",
    points: [] as Array<{ date: string; amount: number }>,
    districtId: filters.districtId,
    ulbId: filters.ulbId,
  }
}

export async function getWardCollectionPerformance(
  filters: CommandCenterFilters
) {
  return {
    available: false as const,
    message:
      "Ward collection performance requires a tax collection ledger API.",
    wards: [] as Array<{ wardId: string; collected: number }>,
    districtId: filters.districtId,
    ulbId: filters.ulbId,
  }
}

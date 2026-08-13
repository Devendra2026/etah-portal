export type TaxKind = "property" | "water" | "drainage"

export interface TaxSummaryUnavailable {
  available: false
  kind: TaxKind | "all"
  message: string
}

export interface TaxSummaryAvailable {
  available: true
  kind: TaxKind
  assessed: number
  collected: number | null
  outstanding: number | null
  collectionPct: number | null
}

export type TaxSummary = TaxSummaryUnavailable | TaxSummaryAvailable

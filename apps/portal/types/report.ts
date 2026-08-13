export type ReportKind =
  | "survey"
  | "ward"
  | "property"
  | "property-tax"
  | "water-tax"
  | "drainage-tax"
  | "tax-collection"

export interface ReportUnavailable {
  available: false
  kind: ReportKind
  message: string
}

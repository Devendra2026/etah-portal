import type { ReportKind, ReportUnavailable } from "@/types/report"
import type { CommandCenterFilters } from "@/types/survey"

export async function getReports(
  kind: ReportKind,
  filters: CommandCenterFilters
): Promise<ReportUnavailable> {
  const scope = filters.ulbId ? "the selected Etah ULB" : "Etah"
  return {
    available: false,
    kind,
    message: `Server-side reporting for ${scope} is not wired in this slice. Use the dashboard and survey registry until report endpoints are connected.`,
  }
}

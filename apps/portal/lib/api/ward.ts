import { apiGet } from "@/lib/api/client"
import { percentOf } from "@/lib/format"
import type { CommandCenterFilters } from "@/types/survey"
import type { CommandCenterWard, PerformanceLabel, WardRow } from "@/types/ward"

export function performanceLabel(
  completionPct: number,
  pending: number
): PerformanceLabel {
  if (completionPct >= 90 && pending < 25) return "Excellent"
  if (completionPct >= 70) return "On Track"
  if (completionPct >= 40) return "Attention"
  return "Critical"
}

export function toWardRow(ward: CommandCenterWard): WardRow {
  const surveyed = (ward.completed ?? ward.qcApproved) + ward.submitted
  const pending = Math.max(ward.totalProperties - surveyed, 0)
  const surveyCompletionPct = percentOf(surveyed, ward.totalProperties)

  return {
    ...ward,
    surveyed,
    pending,
    surveyCompletionPct,
    performance: performanceLabel(surveyCompletionPct, pending),
  }
}

export async function getEtahWards(
  filters: CommandCenterFilters
): Promise<WardRow[]> {
  const wards = await apiGet<CommandCenterWard[]>(
    "/command-center/wards",
    filters
  )
  return wards.map(toWardRow)
}

export async function getEtahWardSummary(
  wardId: string,
  filters: CommandCenterFilters
): Promise<WardRow | null> {
  const wards = await getEtahWards({ ...filters, wardId })
  return wards.find((ward) => ward.wardId === wardId) ?? wards[0] ?? null
}

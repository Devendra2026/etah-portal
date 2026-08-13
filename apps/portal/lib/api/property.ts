import { getEtahProperties } from "@/lib/api/survey"
import type { CommandCenterFilters } from "@/types/survey"

export async function getEtahPropertyList(
  filters: CommandCenterFilters & {
    page?: number
    limit?: number
    search?: string
  }
) {
  return getEtahProperties(filters)
}

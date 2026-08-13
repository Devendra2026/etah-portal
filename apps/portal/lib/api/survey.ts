import { apiGet, apiGetPaginated } from "@/lib/api/client"
import type { AuthenticatedProfile } from "@/types/auth"
import type {
  CommandCenterFilters,
  CommandCenterKpis,
  DashboardAnalytics,
  SurveyListItem,
} from "@/types/survey"

export async function getEtahSurveySummary(
  filters: CommandCenterFilters
): Promise<CommandCenterKpis> {
  return apiGet<CommandCenterKpis>("/command-center/kpis", filters)
}

export async function getEtahDashboard(
  filters: CommandCenterFilters
): Promise<CommandCenterKpis> {
  return getEtahSurveySummary(filters)
}

export async function getSurveyAnalytics(): Promise<DashboardAnalytics> {
  return apiGet<DashboardAnalytics>("/dashboard/analytics")
}

export async function getEtahProperties(
  filters: CommandCenterFilters & {
    page?: number
    limit?: number
    search?: string
  }
) {
  return apiGetPaginated<SurveyListItem>("/surveys", {
    districtId: filters.districtId,
    ulbId: filters.ulbId,
    wardId: filters.wardId,
    surveyStatus: filters.surveyStatus,
    dateFrom: filters.dateFrom,
    dateTo: filters.dateTo,
    page: filters.page,
    limit: filters.limit,
    search: filters.search,
  })
}

export async function getCurrentUser() {
  return apiGet<AuthenticatedProfile>("/users/me")
}

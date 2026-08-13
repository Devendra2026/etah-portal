import { apiGet, apiGetPaginated } from "@/lib/api/client"
import type { AuthenticatedProfile } from "@/types/auth"
import type {
  CommandCenterFilters,
  CommandCenterKpis,
  DashboardAnalytics,
  SurveyDetails,
  SurveyListItem,
  SurveyRegistryQuery,
  SurveyRegistryResult,
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

export async function getEtahSurveyRegistry(
  query: SurveyRegistryQuery
): Promise<SurveyRegistryResult> {
  return apiGet<SurveyRegistryResult>("/survey-registry", {
    districtId: query.districtId,
    ulbId: query.ulbId,
    wardId: query.wardId,
    search: query.search,
    searchField: query.searchField,
    tab: query.tab,
    page: query.page,
    limit: query.limit,
    sortBy: query.sortBy,
    sortOrder: query.sortOrder,
  })
}

export async function getEtahSurveyDetails(
  id: string
): Promise<SurveyDetails> {
  return apiGet<SurveyDetails>(`/surveys/${encodeURIComponent(id)}`)
}

export async function getCurrentUser() {
  return apiGet<AuthenticatedProfile>("/users/me")
}

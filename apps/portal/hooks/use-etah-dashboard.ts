"use client"

import { useEtahScope } from "@/hooks/use-etah-scope"
import { getEtahDashboard, getSurveyAnalytics } from "@/lib/api/survey"
import { getEtahTaxSummary } from "@/lib/api/tax"
import { getEtahWards } from "@/lib/api/ward"
import type { DateRangeValue } from "@/lib/date-range"
import { resolveDateRange } from "@/lib/date-range"
import type { CommandCenterFilters } from "@/types/survey"
import { useAuth } from "@clerk/nextjs"
import { useQuery } from "@tanstack/react-query"
import { useMemo, useState } from "react"

export interface DashboardFilterState {
  wardId: string
  dateRange: DateRangeValue
}

const DEFAULT_FILTERS: DashboardFilterState = {
  wardId: "",
  dateRange: { preset: "all" },
}

export function useDashboardFilters() {
  const [filters, setFilters] = useState<DashboardFilterState>(DEFAULT_FILTERS)

  const reset = () => setFilters(DEFAULT_FILTERS)

  return { filters, setFilters, reset }
}

export function useEtahDashboard(uiFilters: DashboardFilterState) {
  const { isLoaded, isSignedIn } = useAuth()
  const scope = useEtahScope()
  const range = resolveDateRange(uiFilters.dateRange)

  const apiFilters: CommandCenterFilters = useMemo(
    () => ({
      districtId: scope.data?.districtId,
      ulbId: scope.data?.ulbId,
      wardId: uiFilters.wardId || undefined,
      dateFrom: range.dateFrom,
      dateTo: range.dateTo,
    }),
    [
      range.dateFrom,
      range.dateTo,
      scope.data?.districtId,
      scope.data?.ulbId,
      uiFilters.wardId,
    ]
  )

  const enabled = isLoaded && Boolean(isSignedIn) && Boolean(scope.data)

  const kpis = useQuery({
    queryKey: ["etah", "kpis", apiFilters],
    queryFn: () => getEtahDashboard(apiFilters),
    enabled,
  })

  const wards = useQuery({
    queryKey: ["etah", "wards", apiFilters],
    queryFn: () => getEtahWards(apiFilters),
    enabled,
  })

  const tax = useQuery({
    queryKey: ["etah", "tax", apiFilters],
    queryFn: () => getEtahTaxSummary(apiFilters),
    enabled,
  })

  const analytics = useQuery({
    queryKey: ["etah", "analytics"],
    queryFn: getSurveyAnalytics,
    enabled,
  })

  return { scope, apiFilters, kpis, wards, tax, analytics }
}

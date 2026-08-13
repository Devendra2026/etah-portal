"use client"

import { DashboardFilters } from "@/components/dashboard/dashboard-filters"
import { WardPerformanceTable } from "@/components/dashboard/ward-performance-table"
import { PageHeader } from "@/components/layout/page-header"
import { EmptyState, ErrorState } from "@/components/shared/empty-state"
import { TableSkeleton } from "@/components/shared/loading-state"
import {
  useDashboardFilters,
  useEtahDashboard,
} from "@/hooks/use-etah-dashboard"

export default function WardSurveyPage() {
  const { filters, setFilters, reset } = useDashboardFilters()
  const { wards } = useEtahDashboard(filters)

  return (
    <div>
      <PageHeader
        title="Ward Survey"
        description="Etah Municipal Council ward-level survey workload"
      />
      <DashboardFilters
        filters={filters}
        wards={wards.data ?? []}
        onChange={setFilters}
        onReset={reset}
      />
      {wards.isError ? (
        <ErrorState
          title="Unable to load ward data"
          description="The survey service did not respond."
          onRetry={() => void wards.refetch()}
        />
      ) : wards.isLoading ? (
        <TableSkeleton />
      ) : (wards.data?.length ?? 0) === 0 ? (
        <EmptyState
          title="No survey data available for the selected ward."
          description="Try changing the date range or ward filter."
          actionLabel="Reset filters"
          onAction={reset}
        />
      ) : (
        <WardPerformanceTable rows={wards.data ?? []} />
      )}
    </div>
  )
}

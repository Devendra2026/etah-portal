"use client"

import { DashboardFilters } from "@/components/dashboard/dashboard-filters"
import { WardPerformanceTable } from "@/components/dashboard/ward-performance-table"
import { PageHeader } from "@/components/layout/page-header"
import { ReportExportPanel } from "@/components/report/report-export-panel"
import { EmptyState, ErrorState } from "@/components/shared/empty-state"
import { TableSkeleton } from "@/components/shared/loading-state"
import {
  useDashboardFilters,
  useEtahDashboard,
} from "@/hooks/use-etah-dashboard"

export function WardCollectionView() {
  const { filters, setFilters, reset } = useDashboardFilters()
  const { wards } = useEtahDashboard(filters)

  return (
    <div>
      <PageHeader
        title="Ward-wise Collection"
        description="Etah Municipal Council ward survey progress. Collection totals are not returned by the survey API."
      />
      <ReportExportPanel
        title="Ward Excel"
        description="Queue a ward-level Excel export from the survey service."
        reportType="ward"
        format="xlsx"
        note="Paid, outstanding, and cash-desk totals are not in this file. Use the payment portal for collection ledgers."
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
          title="No ward survey data available."
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

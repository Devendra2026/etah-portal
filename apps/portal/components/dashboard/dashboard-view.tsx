"use client"

import { AttentionPanel } from "@/components/dashboard/attention-panel"
import { DashboardFilters } from "@/components/dashboard/dashboard-filters"
import { KpiCard } from "@/components/dashboard/kpi-card"
import { SurveyProgress } from "@/components/dashboard/survey-progress"
import { SurveyTrend } from "@/components/dashboard/survey-trend"
import { WardPerformanceTable } from "@/components/dashboard/ward-performance-table"
import { PageHeader } from "@/components/layout/page-header"
import { EmptyState, ErrorState } from "@/components/shared/empty-state"
import {
  KpiSkeletonRow,
  PanelSkeleton,
  TableSkeleton,
} from "@/components/shared/loading-state"
import {
  useDashboardFilters,
  useEtahDashboard,
} from "@/hooks/use-etah-dashboard"
import { formatNumber, formatPercent, percentOf } from "@/lib/format"
import { Button } from "@workspace/ui/components/button"
import {
  Building2,
  ClipboardCheck,
  Droplets,
  IndianRupee,
  Waves,
} from "lucide-react"

export function DashboardView() {
  const { filters, setFilters, reset } = useDashboardFilters()
  const { scope, kpis, wards, tax, analytics } = useEtahDashboard(filters)

  if (scope.isError) {
    return (
      <ErrorState
        title="Unable to lock Etah geography"
        description={
          scope.error instanceof Error
            ? scope.error.message
            : "The survey service did not return Etah Municipal Council."
        }
        onRetry={() => void scope.refetch()}
      />
    )
  }

  const summary = kpis.data
  const surveyed = summary ? summary.submittedSurveys + summary.qcApproved : 0
  const pending = summary ? Math.max(summary.totalProperties - surveyed, 0) : 0
  const taxUnavailable =
    tax.data && tax.data.available === false ? tax.data.message : undefined

  return (
    <div className="space-y-6">
      <PageHeader
        title="Etah Portal Dashboard"
        description="Survey, property and tax administration overview"
        actions={
          <Button
            type="button"
            variant="outline"
            className="cursor-pointer"
            onClick={() => {
              void kpis.refetch()
              void wards.refetch()
              void analytics.refetch()
            }}
          >
            Refresh
          </Button>
        }
      />

      <DashboardFilters
        filters={filters}
        wards={wards.data ?? []}
        onChange={setFilters}
        onReset={reset}
      />

      <section aria-labelledby="etah-overview-heading" className="space-y-3">
        <div>
          <h2
            id="etah-overview-heading"
            className="font-heading text-lg font-semibold"
          >
            Etah Overview
          </h2>
          <p className="text-sm text-muted-foreground">
            Survey, property and tax collection snapshot
          </p>
        </div>
        {kpis.isLoading || scope.isLoading ? (
          <KpiSkeletonRow />
        ) : kpis.isError ? (
          <ErrorState
            title="Unable to load Etah survey data."
            description="The survey service did not respond."
            onRetry={() => void kpis.refetch()}
          />
        ) : summary ? (
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-6">
            <KpiCard
              label="Total Properties"
              value={formatNumber(summary.totalProperties)}
              hint={`${formatNumber(summary.submittedToday)} submitted today`}
              icon={Building2}
            />
            <KpiCard
              label="Surveyed Properties"
              value={formatNumber(surveyed)}
              hint={`${formatPercent(percentOf(surveyed, summary.totalProperties))} field complete`}
              icon={ClipboardCheck}
              tone="success"
            />
            <KpiCard
              label="Pending Surveys"
              value={formatNumber(pending)}
              hint={`${formatNumber(summary.draftSurveys)} draft · ${formatNumber(summary.returned)} returned`}
              icon={ClipboardCheck}
              tone="warning"
            />
            <KpiCard
              label="Property Tax Assessed"
              value="—"
              hint={taxUnavailable ?? "Awaiting assessment aggregate"}
              icon={IndianRupee}
              tone="muted"
              unavailable
            />
            <KpiCard
              label="Water Tax Assessed"
              value="—"
              hint={taxUnavailable ?? "Awaiting assessment aggregate"}
              icon={Droplets}
              tone="muted"
              unavailable
            />
            <KpiCard
              label="Drainage Tax Assessed"
              value="—"
              hint={taxUnavailable ?? "Awaiting assessment aggregate"}
              icon={Waves}
              tone="muted"
              unavailable
            />
          </div>
        ) : (
          <EmptyState
            title="No survey data available for the selected ward."
            description="Try changing the date range or ward filter."
            actionLabel="Reset filters"
            onAction={reset}
          />
        )}
      </section>

      <section className="grid grid-cols-1 gap-4 xl:grid-cols-2">
        {kpis.isLoading ? (
          <PanelSkeleton />
        ) : summary ? (
          <SurveyProgress kpis={summary} />
        ) : null}
        {analytics.isError ? (
          <ErrorState
            title="Unable to load trend data"
            description="Analytics is optional and did not load. Survey totals above remain available."
            onRetry={() => void analytics.refetch()}
          />
        ) : analytics.isLoading ? (
          <PanelSkeleton />
        ) : (
          <SurveyTrend analytics={analytics.data} />
        )}
      </section>

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

      {wards.data ? <AttentionPanel wards={wards.data} /> : null}
    </div>
  )
}

"use client"

import { KpiCard } from "@/components/dashboard/kpi-card"
import { PageHeader } from "@/components/layout/page-header"
import { EmptyState, ErrorState } from "@/components/shared/empty-state"
import { KpiSkeletonRow } from "@/components/shared/loading-state"
import {
  useDashboardFilters,
  useEtahDashboard,
} from "@/hooks/use-etah-dashboard"
import { formatNumber, formatPercent, percentOf } from "@/lib/format"
import { ClipboardCheck, FileEdit, ShieldCheck, Timer } from "lucide-react"

export default function SurveyStatusPage() {
  const { filters } = useDashboardFilters()
  const { kpis } = useEtahDashboard(filters)
  const summary = kpis.data

  return (
    <div className="space-y-5">
      <PageHeader
        title="Survey Status"
        description="Draft, submitted, verified and pending workload for Etah"
      />
      {kpis.isLoading ? (
        <KpiSkeletonRow count={4} />
      ) : kpis.isError ? (
        <ErrorState
          title="Unable to load Etah survey data."
          description="The survey service did not respond."
          onRetry={() => void kpis.refetch()}
        />
      ) : !summary ? (
        <EmptyState title="No survey data available for the selected ward." />
      ) : (
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-4">
          <KpiCard
            label="Draft"
            value={formatNumber(summary.draftSurveys)}
            hint={`${formatPercent(percentOf(summary.draftSurveys, summary.totalProperties))} of properties`}
            icon={FileEdit}
            tone="muted"
          />
          <KpiCard
            label="Submitted"
            value={formatNumber(summary.submittedSurveys)}
            hint="Awaiting verification"
            icon={Timer}
            tone="warning"
          />
          <KpiCard
            label="Verified"
            value={formatNumber(summary.qcApproved)}
            hint="QC approved"
            icon={ShieldCheck}
            tone="success"
          />
          <KpiCard
            label="Returned"
            value={formatNumber(summary.returned)}
            hint="Needs field correction"
            icon={ClipboardCheck}
            tone="danger"
          />
        </div>
      )}
    </div>
  )
}

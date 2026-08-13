"use client"

import { PageHeader } from "@/components/layout/page-header"
import { EmptyState, ErrorState } from "@/components/shared/empty-state"
import { TableSkeleton } from "@/components/shared/loading-state"
import { StatusBadge } from "@/components/shared/status-badge"
import {
  useDashboardFilters,
  useEtahDashboard,
} from "@/hooks/use-etah-dashboard"
import { getEtahProperties } from "@/lib/api/survey"
import { formatNumber, formatPercent } from "@/lib/format"
import { useQuery } from "@tanstack/react-query"
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@workspace/ui/components/card"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@workspace/ui/components/table"
import { useParams } from "next/navigation"

export function WardDetailView() {
  const params = useParams<{ wardId: string }>()
  const wardId = params.wardId
  const { filters } = useDashboardFilters()
  const dashboard = useEtahDashboard({ ...filters, wardId })
  const ward =
    dashboard.wards.data?.find((item) => item.wardId === wardId) ??
    dashboard.wards.data?.[0]
  const properties = useQuery({
    queryKey: ["etah", "properties", dashboard.apiFilters, wardId],
    queryFn: () =>
      getEtahProperties({
        ...dashboard.apiFilters,
        wardId,
        page: 1,
        limit: 25,
      }),
    enabled: Boolean(dashboard.scope.data) && Boolean(wardId),
  })

  if (dashboard.scope.isError) {
    return (
      <ErrorState
        title="Unable to lock Etah geography"
        description="Ward details require an Etah Municipal Council scope."
        onRetry={() => void dashboard.scope.refetch()}
      />
    )
  }

  if (dashboard.wards.isLoading) {
    return <TableSkeleton />
  }

  if (!ward) {
    return (
      <EmptyState
        title="Ward not found"
        description="This ward is not in the Etah Municipal Council catalog."
      />
    )
  }

  return (
    <div className="space-y-6">
      <PageHeader
        title={ward.wardName}
        description={`Etah · ${dashboard.scope.data?.ulbName ?? "Municipal Council"}`}
      />
      <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
        <Metric label="Properties" value={formatNumber(ward.totalProperties)} />
        <Metric
          label="Survey completion"
          value={formatPercent(ward.surveyCompletionPct)}
        />
        <Metric label="Pending" value={formatNumber(ward.pending)} />
        <div className="rounded-xl border border-border bg-card p-4">
          <p className="text-xs text-muted-foreground">Status</p>
          <div className="mt-2">
            <StatusBadge label={ward.performance} />
          </div>
        </div>
      </div>
      <Card className="border-border shadow-xs">
        <CardHeader>
          <CardTitle className="text-base">Tax performance</CardTitle>
        </CardHeader>
        <CardContent>
          <EmptyState
            title="No tax collection data available for this ward."
            description="Try changing the date range or wait until a collection API is connected."
          />
        </CardContent>
      </Card>
      {properties.isError ? (
        <ErrorState
          title="Unable to load property list"
          description="The survey service did not respond."
          onRetry={() => void properties.refetch()}
        />
      ) : properties.isLoading ? (
        <TableSkeleton />
      ) : (
        <section className="rounded-xl border border-border bg-card">
          <div className="border-b border-border px-4 py-3">
            <h2 className="font-heading text-lg font-semibold">
              Property list
            </h2>
          </div>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Property ID</TableHead>
                <TableHead>Owner</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Locality</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {(properties.data?.items ?? []).map((item) => (
                <TableRow key={item.id}>
                  <TableCell className="font-medium">
                    {item.propertyId}
                  </TableCell>
                  <TableCell>{item.respondentName ?? "—"}</TableCell>
                  <TableCell>{item.surveyStatus}</TableCell>
                  <TableCell>{item.locality ?? "—"}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </section>
      )}
    </div>
  )
}

function Metric({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-xl border border-border bg-card p-4">
      <p className="text-xs text-muted-foreground">{label}</p>
      <p className="mt-2 font-heading text-xl font-semibold tabular-nums">
        {value}
      </p>
    </div>
  )
}

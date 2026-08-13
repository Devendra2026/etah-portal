"use client"

import { PageHeader } from "@/components/layout/page-header"
import { EmptyState, ErrorState } from "@/components/shared/empty-state"
import { TableSkeleton } from "@/components/shared/loading-state"
import {
  useDashboardFilters,
  useEtahDashboard,
} from "@/hooks/use-etah-dashboard"
import { getEtahProperties } from "@/lib/api/survey"
import { useQuery } from "@tanstack/react-query"
import { Input } from "@workspace/ui/components/input"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@workspace/ui/components/table"
import { useRouter, useSearchParams } from "next/navigation"
import { useState } from "react"

export function SurveyRegistryView() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const initial = searchParams.get("search") ?? ""
  const [search, setSearch] = useState(initial)
  const { filters } = useDashboardFilters()
  const dashboard = useEtahDashboard(filters)
  const list = useQuery({
    queryKey: ["etah", "registry", dashboard.apiFilters, search],
    queryFn: () =>
      getEtahProperties({
        ...dashboard.apiFilters,
        search: search || undefined,
        page: 1,
        limit: 25,
      }),
    enabled: Boolean(dashboard.scope.data),
  })

  return (
    <div className="space-y-5">
      <PageHeader
        title="Survey Registry"
        description="Etah property surveys for Municipal Council operations"
      />
      <form
        onSubmit={(event) => {
          event.preventDefault()
          router.replace(
            search
              ? `/survey/properties?search=${encodeURIComponent(search)}`
              : "/survey/properties"
          )
        }}
        className="max-w-md"
      >
        <Input
          value={search}
          onChange={(event) => setSearch(event.target.value)}
          placeholder="Search properties, surveys, wards..."
          aria-label="Search survey registry"
        />
      </form>
      {list.isError ? (
        <ErrorState
          title="Unable to load Etah survey data."
          description="The survey service did not respond."
          onRetry={() => void list.refetch()}
        />
      ) : list.isLoading ? (
        <TableSkeleton />
      ) : (list.data?.items.length ?? 0) === 0 ? (
        <EmptyState
          title="No survey data available for the selected ward."
          description="Try changing the date range or ward filter."
        />
      ) : (
        <div className="rounded-xl border border-border bg-card">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Property ID</TableHead>
                <TableHead>Owner</TableHead>
                <TableHead>Ward</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>QC</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {list.data?.items.map((item) => (
                <TableRow key={item.id}>
                  <TableCell className="font-medium">
                    {item.propertyId}
                  </TableCell>
                  <TableCell>{item.respondentName ?? "—"}</TableCell>
                  <TableCell>{item.ward?.wardName ?? "—"}</TableCell>
                  <TableCell>{item.surveyStatus}</TableCell>
                  <TableCell>{item.qcStatus ?? "—"}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      )}
    </div>
  )
}

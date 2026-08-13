"use client"

import { PageHeader } from "@/components/layout/page-header"
import { ReportExportPanel } from "@/components/report/report-export-panel"
import { EmptyState, ErrorState } from "@/components/shared/empty-state"
import { TableSkeleton } from "@/components/shared/loading-state"
import { useDebouncedValue } from "@/hooks/use-debounced-value"
import { useEtahScope } from "@/hooks/use-etah-scope"
import { isApiError } from "@/lib/api/client"
import { getSurveyReport } from "@/lib/api/report"
import { displayValue, formatDate } from "@/lib/format"
import { useAuth } from "@clerk/nextjs"
import { keepPreviousData, useQuery } from "@tanstack/react-query"
import { Button } from "@workspace/ui/components/button"
import { Input } from "@workspace/ui/components/input"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@workspace/ui/components/table"
import Link from "next/link"
import { useState } from "react"

export function SurveyReportView() {
  const { isLoaded, isSignedIn } = useAuth()
  const scope = useEtahScope()
  const [searchInput, setSearchInput] = useState("")
  const [page, setPage] = useState(1)
  const search = useDebouncedValue(searchInput.trim(), 300)

  const report = useQuery({
    queryKey: ["etah", "survey-report", scope.data?.ulbId, search, page],
    queryFn: () =>
      getSurveyReport({
        ulbId: scope.data!.ulbId,
        search: search || undefined,
        page,
        limit: 25,
      }),
    enabled: Boolean(isLoaded && isSignedIn && scope.data),
    placeholderData: keepPreviousData,
  })

  const meta = report.data?.meta

  return (
    <div>
      <PageHeader
        title="Survey Report"
        description="Live survey records for Etah Municipal Council from the survey service."
      />
      <ReportExportPanel
        title="Survey Excel / CSV"
        description="Queue a full survey export for Etah."
        reportType="surveys"
        format="xlsx"
      />
      <div className="mb-4 max-w-sm">
        <label className="flex flex-col gap-1.5 text-xs font-medium text-muted-foreground">
          Search property or owner
          <Input
            value={searchInput}
            onChange={(event) => {
              setSearchInput(event.target.value)
              setPage(1)
            }}
            placeholder="Property ID or owner name"
            aria-label="Search survey report"
          />
        </label>
      </div>

      {report.isError ? (
        isApiError(report.error) && report.error.status === 403 ? (
          <EmptyState
            title="You do not have permission to view survey reports."
            description="Survey reports require report:view on the survey service."
          />
        ) : (
          <ErrorState
            title="Unable to load survey report."
            description="The survey service did not return the report."
            onRetry={() => void report.refetch()}
          />
        )
      ) : report.isLoading ? (
        <TableSkeleton />
      ) : (report.data?.items.length ?? 0) === 0 ? (
        <EmptyState
          title="No survey rows for this filter."
          description="Try a different search term."
        />
      ) : (
        <div className="overflow-x-auto rounded-xl border border-border bg-card">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Property ID</TableHead>
                <TableHead>Owner</TableHead>
                <TableHead>Mobile</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Submitted</TableHead>
                <TableHead className="text-right">Action</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {report.data?.items.map((row) => (
                <TableRow key={row.id}>
                  <TableCell className="font-medium">{row.propertyId}</TableCell>
                  <TableCell>{displayValue(row.respondentName)}</TableCell>
                  <TableCell>{displayValue(row.mobileNumber)}</TableCell>
                  <TableCell>{row.surveyStatus}</TableCell>
                  <TableCell>{formatDate(row.submittedAt)}</TableCell>
                  <TableCell className="text-right">
                    <Button
                      nativeButton={false}
                      render={<Link href={`/survey/properties/${row.id}`} />}
                      variant="outline"
                      size="sm"
                      className="cursor-pointer"
                    >
                      View
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
          {meta && meta.totalPages > 1 ? (
            <div className="flex items-center justify-between border-t border-border px-4 py-3">
              <p className="text-xs text-muted-foreground">
                Page {meta.page} of {meta.totalPages}
              </p>
              <div className="flex gap-2">
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  className="cursor-pointer"
                  disabled={page <= 1}
                  onClick={() => setPage((current) => Math.max(1, current - 1))}
                >
                  Previous
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  className="cursor-pointer"
                  disabled={page >= meta.totalPages}
                  onClick={() => setPage((current) => current + 1)}
                >
                  Next
                </Button>
              </div>
            </div>
          ) : null}
        </div>
      )}
    </div>
  )
}

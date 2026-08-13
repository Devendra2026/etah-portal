"use client"

import { PageHeader } from "@/components/layout/page-header"
import { ReportExportPanel } from "@/components/report/report-export-panel"
import { EmptyState, ErrorState } from "@/components/shared/empty-state"
import { TableSkeleton } from "@/components/shared/loading-state"
import { useEtahScope } from "@/hooks/use-etah-scope"
import { listEtahDemandNotices } from "@/lib/api/demand-notices"
import { getWards } from "@/lib/api/geography"
import { isApiError } from "@/lib/api/client"
import { formatDate, formatInrExact, formatNumber } from "@/lib/format"
import { useAuth } from "@clerk/nextjs"
import { keepPreviousData, useQuery } from "@tanstack/react-query"
import { Button } from "@workspace/ui/components/button"
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

const SELECT_CLASS =
  "h-9 cursor-pointer rounded-lg border border-input bg-background px-2.5 text-sm text-foreground"

export function DemandNoticeRegisterView() {
  const { isLoaded, isSignedIn } = useAuth()
  const scope = useEtahScope()
  const [wardId, setWardId] = useState("")
  const [page, setPage] = useState(1)

  const wards = useQuery({
    queryKey: ["etah", "wards", scope.data?.ulbId],
    queryFn: () => getWards(scope.data!.ulbId),
    enabled: Boolean(isLoaded && isSignedIn && scope.data?.ulbId),
  })

  const register = useQuery({
    queryKey: [
      "etah",
      "demand-notices",
      scope.data?.districtId,
      scope.data?.ulbId,
      wardId,
      page,
    ],
    queryFn: () =>
      listEtahDemandNotices({
        districtId: scope.data!.districtId,
        ulbId: scope.data!.ulbId,
        wardId: wardId || undefined,
        page,
        limit: 25,
      }),
    enabled: Boolean(isLoaded && isSignedIn && scope.data),
    placeholderData: keepPreviousData,
  })

  const meta = register.data?.meta
  const kpis = register.data?.kpis

  return (
    <div>
      <PageHeader
        title="Demand Notice"
        description="QC-approved demand notices for Etah Municipal Council."
      />
      <ReportExportPanel
        title="Ward demand notice PDF"
        description="Queue a ward PDF of approved demand notices."
        reportType="demand_notices"
        format="pdf"
        requireWard
        note="Demand notices are assessment documents. Payment is collected on the municipal payment portal."
      />

      <div className="mb-4 grid grid-cols-1 gap-3 sm:grid-cols-3">
        <div className="rounded-xl border border-border bg-card p-4">
          <p className="text-xs font-medium text-muted-foreground">Notices</p>
          <p className="mt-1 text-lg font-semibold text-foreground">
            {formatNumber(kpis?.noticeCount)}
          </p>
        </div>
        <div className="rounded-xl border border-border bg-card p-4">
          <p className="text-xs font-medium text-muted-foreground">
            Page demand
          </p>
          <p className="mt-1 text-lg font-semibold text-foreground">
            {formatInrExact(kpis?.pageDemand)}
          </p>
        </div>
        <div className="rounded-xl border border-border bg-card p-4">
          <p className="text-xs font-medium text-muted-foreground">
            Rate missing
          </p>
          <p className="mt-1 text-lg font-semibold text-foreground">
            {formatNumber(kpis?.rateMissingCount)}
          </p>
        </div>
      </div>

      <div className="mb-4">
        <label className="flex max-w-xs flex-col gap-1.5 text-xs font-medium text-muted-foreground">
          Ward
          <select
            className={SELECT_CLASS}
            value={wardId}
            onChange={(event) => {
              setWardId(event.target.value)
              setPage(1)
            }}
            aria-label="Filter demand notices by ward"
          >
            <option value="">All wards</option>
            {(wards.data?.items ?? []).map((ward) => (
              <option key={ward.id} value={ward.id}>
                {ward.wardName || `Ward ${ward.wardNumber}`}
              </option>
            ))}
          </select>
        </label>
      </div>

      {register.isError ? (
        isApiError(register.error) && register.error.status === 403 ? (
          <EmptyState
            title="You do not have permission to view demand notices."
            description="Demand notice register requires report access on the survey service."
          />
        ) : (
          <ErrorState
            title="Unable to load demand notices."
            description="The survey service did not return the demand notice register."
            onRetry={() => void register.refetch()}
          />
        )
      ) : register.isLoading ? (
        <TableSkeleton />
      ) : (register.data?.items.length ?? 0) === 0 ? (
        <EmptyState
          title="No approved demand notices."
          description="Notices appear after surveys are QC approved."
        />
      ) : (
        <div className="overflow-x-auto rounded-xl border border-border bg-card">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Property ID</TableHead>
                <TableHead>Owner</TableHead>
                <TableHead>Ward</TableHead>
                <TableHead>Assessment year</TableHead>
                <TableHead className="text-right">Demand</TableHead>
                <TableHead>Approved</TableHead>
                <TableHead className="text-right">Action</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {register.data?.items.map((row) => (
                <TableRow key={row.surveyId}>
                  <TableCell className="font-medium">{row.propertyId}</TableCell>
                  <TableCell>{row.ownerName}</TableCell>
                  <TableCell>{row.wardNumber}</TableCell>
                  <TableCell>{row.assessmentYearLabel}</TableCell>
                  <TableCell className="text-right">
                    {row.rateMissing ? "Rate missing" : formatInrExact(row.totalDemand)}
                  </TableCell>
                  <TableCell>{formatDate(row.approvedAt)}</TableCell>
                  <TableCell className="text-right">
                    <Button
                      nativeButton={false}
                      render={
                        <Link href={`/survey/properties/${row.surveyId}`} />
                      }
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

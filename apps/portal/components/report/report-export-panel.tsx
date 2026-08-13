"use client"

import { EmptyState, ErrorState } from "@/components/shared/empty-state"
import { useEtahScope } from "@/hooks/use-etah-scope"
import { getWards } from "@/lib/api/geography"
import {
  downloadExportJob,
  enqueueExport,
  getExportJob,
  triggerBrowserDownload,
} from "@/lib/api/report"
import { isApiError } from "@/lib/api/client"
import type { ExportFormat, ExportJob, ExportReportType } from "@/types/export-job"
import { useAuth } from "@clerk/nextjs"
import { useMutation, useQuery } from "@tanstack/react-query"
import { Button } from "@workspace/ui/components/button"
import { useState } from "react"

const SELECT_CLASS =
  "h-9 cursor-pointer rounded-lg border border-input bg-background px-2.5 text-sm text-foreground"

function jobStatusLabel(status: string): string {
  switch (status) {
    case "QUEUED":
      return "Queued"
    case "PROCESSING":
      return "Processing"
    case "SUCCEEDED":
      return "Ready"
    case "FAILED":
      return "Failed"
    case "CANCELLED":
      return "Cancelled"
    default:
      return status
  }
}

export function ReportExportPanel({
  title,
  description,
  reportType,
  format,
  requireWard = false,
  enableAutoFilter = false,
  note,
}: {
  title: string
  description: string
  reportType: ExportReportType
  format: ExportFormat
  requireWard?: boolean
  enableAutoFilter?: boolean
  note?: string
}) {
  const { isLoaded, isSignedIn } = useAuth()
  const scope = useEtahScope()
  const [wardId, setWardId] = useState("")
  const [jobId, setJobId] = useState<string | null>(null)

  const wards = useQuery({
    queryKey: ["etah", "wards", scope.data?.ulbId],
    queryFn: () => getWards(scope.data!.ulbId),
    enabled: Boolean(isLoaded && isSignedIn && scope.data?.ulbId),
  })

  const job = useQuery<ExportJob>({
    queryKey: ["etah", "export-job", jobId],
    queryFn: () => getExportJob(jobId!),
    enabled: Boolean(jobId),
    refetchInterval: (query) => {
      const status = query.state.data?.status
      if (status === "QUEUED" || status === "PROCESSING") return 1500
      return false
    },
  })

  const enqueue = useMutation({
    mutationFn: () => {
      if (!scope.data) {
        throw new Error("Etah municipal scope is not resolved.")
      }
      if (requireWard && !wardId) {
        throw new Error("Select a ward before generating this export.")
      }
      return enqueueExport({
        format,
        reportType,
        districtId: scope.data.districtId,
        ulbId: scope.data.ulbId,
        wardId: wardId || undefined,
        enableAutoFilter,
      })
    },
    onSuccess: (result) => {
      setJobId(result.jobId)
    },
  })

  const download = useMutation({
    mutationFn: async () => {
      if (!jobId) throw new Error("No export job to download.")
      return downloadExportJob(jobId)
    },
    onSuccess: ({ blob, filename }) => {
      triggerBrowserDownload(blob, filename)
    },
  })

  const status = job.data?.status
  const canDownload = status === "SUCCEEDED"
  const enqueueError = enqueue.error
    ? isApiError(enqueue.error)
      ? enqueue.error.message
      : enqueue.error instanceof Error
        ? enqueue.error.message
        : "Unable to queue export."
    : null

  return (
    <section className="mb-5 rounded-xl border border-border bg-card p-4">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
        <div className="min-w-0">
          <h2 className="text-sm font-semibold text-foreground">{title}</h2>
          <p className="mt-1 text-sm text-muted-foreground">{description}</p>
          {note ? (
            <p className="mt-2 text-xs text-muted-foreground">{note}</p>
          ) : null}
        </div>
        <div className="flex shrink-0 flex-col gap-2 sm:items-end">
          {requireWard || reportType === "ward" ? (
            <label className="flex flex-col gap-1.5 text-xs font-medium text-muted-foreground">
              Ward
              <select
                className={SELECT_CLASS}
                value={wardId}
                onChange={(event) => setWardId(event.target.value)}
                aria-label="Select ward for export"
              >
                <option value="">{requireWard ? "Select ward" : "All wards"}</option>
                {(wards.data?.items ?? []).map((ward) => (
                  <option key={ward.id} value={ward.id}>
                    {ward.wardName || `Ward ${ward.wardNumber}`}
                  </option>
                ))}
              </select>
            </label>
          ) : null}
          <div className="flex flex-wrap gap-2">
            <Button
              type="button"
              className="cursor-pointer"
              disabled={enqueue.isPending || !scope.data}
              onClick={() => enqueue.mutate()}
            >
              {enqueue.isPending ? "Queuing…" : "Generate export"}
            </Button>
            <Button
              type="button"
              variant="outline"
              className="cursor-pointer"
              disabled={!canDownload || download.isPending}
              onClick={() => download.mutate()}
            >
              {download.isPending ? "Downloading…" : "Download"}
            </Button>
          </div>
        </div>
      </div>

      {enqueueError ? (
        <div className="mt-3">
          {isApiError(enqueue.error) && enqueue.error.status === 403 ? (
            <EmptyState
              title="You do not have permission to export reports."
              description="Report export requires report:export on the survey service."
            />
          ) : (
            <ErrorState title="Unable to queue export." description={enqueueError} />
          )}
        </div>
      ) : null}

      {job.isError ? (
        <div className="mt-3">
          <ErrorState
            title="Unable to check export status."
            description="The survey service did not return this export job."
            onRetry={() => void job.refetch()}
          />
        </div>
      ) : null}

      {job.data ? (
        <p className="mt-3 text-sm text-muted-foreground">
          Status: {jobStatusLabel(String(job.data.status))}
          {job.data.rowCount != null ? ` · ${job.data.rowCount} rows` : ""}
          {job.data.errorMessage ? ` · ${job.data.errorMessage}` : ""}
        </p>
      ) : null}
    </section>
  )
}

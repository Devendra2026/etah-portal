import { apiDownload, apiGet, apiGetPaginated } from "@/lib/api/client"
import type {
  EnqueueExportInput,
  EnqueueExportResult,
  ExportJob,
  SurveyReportRow,
} from "@/types/export-job"

export async function getSurveyReport(params: {
  ulbId?: string
  search?: string
  surveyStatus?: string
  page?: number
  limit?: number
}) {
  return apiGetPaginated<SurveyReportRow>("/reports/surveys", params)
}

export async function enqueueExport(
  input: EnqueueExportInput
): Promise<EnqueueExportResult> {
  return apiGet<EnqueueExportResult>("/reports/export", {
    format: input.format,
    reportType: input.reportType,
    districtId: input.districtId,
    ulbId: input.ulbId,
    wardId: input.wardId,
    search: input.search,
    surveyStatus: input.surveyStatus,
    qcStatus: input.qcStatus,
    enableAutoFilter: input.enableAutoFilter ? "true" : undefined,
  })
}

export async function getExportJob(jobId: string): Promise<ExportJob> {
  return apiGet<ExportJob>(`/reports/jobs/${encodeURIComponent(jobId)}`)
}

export async function downloadExportJob(
  jobId: string
): Promise<{ blob: Blob; filename: string }> {
  return apiDownload(`/reports/jobs/${encodeURIComponent(jobId)}/file`)
}

export function triggerBrowserDownload(blob: Blob, filename: string): void {
  const url = URL.createObjectURL(blob)
  const link = document.createElement("a")
  link.href = url
  link.download = filename
  link.click()
  URL.revokeObjectURL(url)
}

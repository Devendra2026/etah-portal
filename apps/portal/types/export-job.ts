export type ExportFormat = "json" | "xlsx" | "csv" | "pdf"

export type ExportReportType =
  | "surveys"
  | "ward"
  | "ulb"
  | "district"
  | "summary"
  | "convex_full"
  | "survey_data"
  | "district_ward_zip"
  | "nagar_panchayat"
  | "qc_final"
  | "demand_notices"

export type ExportJobStatus =
  | "QUEUED"
  | "PROCESSING"
  | "SUCCEEDED"
  | "FAILED"
  | "CANCELLED"

export interface EnqueueExportInput {
  format: ExportFormat
  reportType: ExportReportType
  districtId?: string
  ulbId?: string
  wardId?: string
  search?: string
  surveyStatus?: string
  qcStatus?: string
  enableAutoFilter?: boolean
}

export interface EnqueueExportResult {
  jobId: string
  status: ExportJobStatus | string
}

export interface ExportJob {
  id: string
  status: ExportJobStatus | string
  reportType: string
  format: string
  filename: string | null
  rowCount: number | null
  errorMessage: string | null
  startedAt: string | null
  finishedAt: string | null
  createdAt: string
  updatedAt: string
}

export interface SurveyReportRow {
  id: string
  propertyId: string
  surveyStatus: string
  stateId: string
  districtId: string
  ulbId: string
  wardId: string
  respondentName: string | null
  mobileNumber: string | null
  totalBuiltAreaSqFt: number | string | null
  submittedAt: string | null
  approvedAt: string | null
  rejectedAt: string | null
  createdAt: string
}

export type SurveyStatus =
  | "DRAFT"
  | "IN_PROGRESS"
  | "SUBMITTED"
  | "APPROVED"
  | "REJECTED"
  | "REOPENED"

export type QcStatus = "PENDING" | "APPROVED" | "REJECTED"

export interface CommandCenterKpis {
  totalProperties: number
  draftSurveys: number
  submittedSurveys: number
  qcApproved: number
  approvedCompleted?: number
  avgFieldCompletionPct: number
  submittedToday: number
  editedToday?: number
  awaitingQc: number
  returned: number
}

export interface CommandCenterFilters {
  districtId?: string
  ulbId?: string
  wardId?: string
  surveyStatus?: string
  dateFrom?: string
  dateTo?: string
  month?: string
}

export interface SurveyListItem {
  id: string
  propertyId: string
  surveyStatus: string
  qcStatus?: string
  respondentName?: string | null
  mobileNumber?: string | null
  locality?: string | null
  assessmentYear?: string | null
  createdAt: string
  updatedAt: string
  submittedAt?: string | null
  district?: { id: string; name: string }
  ulb?: { id: string; name: string }
  ward?: { id: string; wardName: string; wardNumber: string }
  createdBy?: { id: string; fullName: string }
}

export interface DashboardAnalytics {
  dailyTrend: Array<{
    date: string
    created: number
    approved: number
    rejected: number
  }>
  recentActivity?: Array<{
    id: string
    title: string
    actor: string
    createdAt?: string
  }>
}

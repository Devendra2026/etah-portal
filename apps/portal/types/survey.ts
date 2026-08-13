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

export type SurveyRegistryTab =
  | "all"
  | "draft"
  | "submitted"
  | "qcPending"
  | "qcApproved"
  | "rejected"

export type SurveyRegistrySearchField = "all" | "owner" | "parcel" | "propertyId"

export type SurveyRegistrySortBy = "createdAt" | "propertyId" | "surveyStatus"

export interface SurveyRegistryCounts {
  all: number
  draft: number
  submitted: number
  qcPending: number
  qcApproved: number
  rejected: number
}

export interface SurveyRegistryScope {
  districtName: string | null
  ulbName: string | null
  wardName: string | null
  label: string
}

export interface SurveyRegistryRow {
  id: string
  status: string
  surveyStatus: string
  qcStatus?: string | null
  progress: number
  surveyorName: string
  surveyorId: string
  propertyId: string
  wardNumber: string
  parcelNumber: string
  ownerName: string
  surveyDate: string
  createdAt: string
}

export interface SurveyRegistryQuery {
  districtId: string
  ulbId: string
  wardId?: string
  search?: string
  searchField?: SurveyRegistrySearchField
  tab?: SurveyRegistryTab
  page?: number
  limit?: number
  sortBy?: SurveyRegistrySortBy
  sortOrder?: "asc" | "desc"
}

export interface SurveyRegistryResult {
  items: SurveyRegistryRow[]
  meta: {
    total: number
    page: number
    limit: number
    totalPages: number
  }
  counts: SurveyRegistryCounts | null
  scope: SurveyRegistryScope | null
}

export interface SurveyOwner {
  propertyId: string
  name: string
  fatherHusband: string
  mobile: string
  altMobile: string
}

export interface SurveyFloor {
  sNo: number
  floor: string
  usageType: string
  usageFactor: string
  construction: string
  area: string
}

export interface SurveyPhoto {
  id: string
  photoType: string
  label: string
  url: string
  capturedAt: string | null
  surveyorName: string
  importStatus?: string | null
}

export interface SurveyQcRemark {
  id: string
  body: string
  author: string
  createdAt: string
}

export interface SurveyDetails {
  id: string
  propertyId: string
  ulbName: string
  wardNo: string
  parcelNo: string
  ownerName: string
  status: string
  surveyStatus: string
  qcStatus: string | null
  district: string
  sectorZone: string
  unitSubNo: string
  propertyIdOld: string
  constructedYear: string
  surveyor: string
  slumArea: string
  respondentName: string
  mobileNumber: string
  familySize: number | null
  relationshipWithOwner: string
  altMobile: string
  fatherHusbandName: string
  houseDoorNo: string
  colonySociety: string
  localityLandmark: string
  city: string
  pinCode: string
  coordinates: string
  latitude: number | null
  longitude: number | null
  gpsAccuracyMeters: number | null
  assessmentYear: string
  ownershipType: string
  propertyUse: string
  propertyType: string
  situation: string
  roadType: string
  taxRateZone: string
  plotArea: string
  plinthArea: string
  builtUpArea: string
  waterConnection: string
  sourceOfWater: string
  sanitationType: string
  doorToDoorCollection: string
  electricityConsumerNo: string
  frontPhotoUrl: string | null
  sidePhotoUrl: string | null
  owners: SurveyOwner[]
  floors: SurveyFloor[]
  photos: SurveyPhoto[]
  qcRemarks: string | null
  qcRemarkItems: SurveyQcRemark[]
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

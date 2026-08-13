export interface DemandNoticeFloorRow {
  sno: number
  floorLabel: string
  usageTypeLabel: string
  usageFactorLabel: string
  constructionLabel: string
  areaSqFt: number
  annualRate: number
  usageMult: number
  alv: number
  assessableAlv: number
  tax: number
}

export interface DemandNoticeAssessment {
  floorRows: DemandNoticeFloorRow[]
  totalArea: number
  totalAlv: number
  totalAssessableAlv: number
  assessablePct: number
  propertyTaxPct: number
  waterTaxPct: number
  drainageTaxPct: number
  penaltyPct: number
  propertyTax: number
  waterTax: number
  drainageTax: number
  penalty: number
  totalAnnualDemand: number
  annualBaseRate: number | null
  rateMissing: boolean
  rateMissingReason: string | null
}

export interface DemandNoticeOffice {
  headerLine1: string
  headerLine2: string
  ulbName: string
  districtName: string
  stateName: string
  hindiOffice: string
}

export interface DemandNoticeDocument {
  surveyId: string
  propertyId: string
  assessmentYear: string
  assessmentYearLabel: string
  noticeDate: string
  ownerName: string
  fatherName: string
  mobileNo: string
  oldHouseNo: string
  address: string
  taxZoneLabel: string
  wardLabel: string
  gisParcel: string
  propertyUseLabel: string
  latitude: number | null
  longitude: number | null
  frontPhotoUrl: string | null
  sidePhotoUrl: string | null
  office: DemandNoticeOffice
  assessment: DemandNoticeAssessment
  legalHindi: string
  legalEnglish: string
}

export interface DemandPrintToken {
  token: string
  expiresInMs: number
}

export interface DemandNoticeRegisterRow {
  surveyId: string
  propertyId: string
  wardId: string
  wardNumber: string
  ownerName: string
  assessmentYear: string
  assessmentYearLabel: string
  totalDemand: number | null
  rateMissing: boolean
  rateMissingReason: string | null
  approvedAt: string | null
}

export interface DemandNoticeRegisterKpis {
  noticeCount: number
  pageDemand: number
  rateMissingCount: number
}

export interface DemandNoticeRegisterResult {
  items: DemandNoticeRegisterRow[]
  meta: {
    total: number
    page: number
    limit: number
    totalPages: number
  }
  kpis: DemandNoticeRegisterKpis
}

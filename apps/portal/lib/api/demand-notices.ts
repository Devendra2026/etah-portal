import { apiGet, apiPost } from "@/lib/api/client"
import type {
  DemandNoticeDocument,
  DemandNoticeRegisterResult,
  DemandPrintToken,
} from "@/types/demand-notice"

export async function listEtahDemandNotices(params: {
  districtId?: string
  ulbId?: string
  wardId?: string
  page?: number
  limit?: number
}): Promise<DemandNoticeRegisterResult> {
  return apiGet<DemandNoticeRegisterResult>("/demand-notices", params)
}

export async function getEtahDemandNotice(
  surveyId: string
): Promise<DemandNoticeDocument> {
  return apiGet<DemandNoticeDocument>(
    `/demand-notices/${encodeURIComponent(surveyId)}`
  )
}

export async function createDemandPrintToken(input: {
  surveyId?: string
  wardId?: string
  assessmentYearId?: string
}): Promise<DemandPrintToken> {
  return apiPost<DemandPrintToken>("/demand-notices/print-token", input)
}

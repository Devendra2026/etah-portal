import { apiGetPaginated } from "@/lib/api/client"
import type { DirectoryUser } from "@/types/user-directory"

export async function listEtahUsers(params: {
  districtId?: string
  ulbId?: string
  search?: string
  page?: number
  limit?: number
  isActive?: boolean
}) {
  return apiGetPaginated<DirectoryUser>("/users", {
    districtId: params.districtId,
    ulbId: params.ulbId,
    search: params.search,
    page: params.page,
    limit: params.limit,
    isActive:
      params.isActive === undefined ? undefined : params.isActive ? "true" : "false",
  })
}

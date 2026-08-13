import { apiGetPaginated, apiPost } from "@/lib/api/client"
import type { DirectoryTenantRole, DirectoryUser } from "@/types/user-directory"

export async function listEtahUsers(params: {
  districtId?: string
  ulbId?: string
  search?: string
  page?: number
  limit?: number
  isActive?: boolean
  roleName?: string
}) {
  return apiGetPaginated<DirectoryUser>("/users", {
    districtId: params.districtId,
    ulbId: params.ulbId,
    search: params.search,
    page: params.page,
    limit: params.limit,
    roleName: params.roleName,
    isActive:
      params.isActive === undefined ? undefined : params.isActive ? "true" : "false",
  })
}

export async function listPendingClerkUsers(params?: {
  search?: string
  page?: number
  limit?: number
}) {
  return apiGetPaginated<DirectoryUser>("/users", {
    roleName: "PENDING_APPROVAL",
    search: params?.search,
    page: params?.page ?? 1,
    limit: params?.limit ?? 25,
  })
}

export async function assignEtahDepartmentRole(input: {
  userId: string
  roleId: string
  ulbId: string
}): Promise<DirectoryTenantRole> {
  return apiPost<DirectoryTenantRole>("/users/tenant-roles/assign", {
    userId: input.userId,
    roleId: input.roleId,
    ulbId: input.ulbId,
  })
}

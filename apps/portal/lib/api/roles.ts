import { apiGetPaginated } from "@/lib/api/client"
import type { PermissionRecord, RoleRecord } from "@/types/user-directory"

export async function listRoles(params?: { search?: string; page?: number; limit?: number }) {
  return apiGetPaginated<RoleRecord>("/roles", {
    search: params?.search,
    page: params?.page ?? 1,
    limit: params?.limit ?? 100,
    sortBy: "name",
    sortOrder: "asc",
  })
}

export async function listPermissions(params?: {
  search?: string
  page?: number
  limit?: number
}) {
  return apiGetPaginated<PermissionRecord>("/permissions", {
    search: params?.search,
    page: params?.page ?? 1,
    limit: params?.limit ?? 100,
    sortBy: "name",
    sortOrder: "asc",
  })
}

export interface DirectoryTenantRole {
  id: string
  isActive: boolean
  role?: { id: string; name: string } | null
  roleName?: string
  district?: { id: string; name: string } | null
  ulb?: { id: string; name: string; code?: string } | null
  ward?: { id: string; wardNumber: string; wardName: string } | null
}

export interface DirectoryUser {
  id: string
  email: string
  fullName: string
  phone: string | null
  isActive: boolean
  lastLoginAt: string | null
  createdAt: string
  tenantRoles: DirectoryTenantRole[]
}

export interface RolePermissionLink {
  id: string
  permission: {
    id: string
    name: string
    description: string | null
  }
}

export interface RoleRecord {
  id: string
  name: string
  description: string | null
  family: "PLATFORM" | "DEPARTMENT" | string
  permissionCount: number
  assignedUsersCount: number
  permissions?: RolePermissionLink[]
}

export interface PermissionRecord {
  id: string
  name: string
  description: string | null
}

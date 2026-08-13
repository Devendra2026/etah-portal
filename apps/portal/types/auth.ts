export interface TenantRole {
  id: string
  role?: { id: string; name: string }
  roleName?: string
  isActive: boolean
  districtId?: string | null
  ulbId?: string | null
  wardId?: string | null
  district?: { id: string; name: string } | null
  ulb?: { id: string; name: string; code?: string } | null
}

export interface AuthenticatedProfile {
  id: string
  clerkUserId: string
  email: string
  fullName: string
  isActive: boolean
  permissions: string[]
  tenantRoles?: TenantRole[]
}

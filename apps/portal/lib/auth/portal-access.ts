export function hasPortalAccess(permissions: string[] | null | undefined): boolean {
  return Array.isArray(permissions) && permissions.length > 0
}

export function canGrantDepartmentAccess(
  permissions: string[] | null | undefined
): boolean {
  return Boolean(permissions?.includes("role:assign"))
}

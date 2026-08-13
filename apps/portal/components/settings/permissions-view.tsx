"use client"

import { PageHeader } from "@/components/layout/page-header"
import { DepartmentGrantPanel } from "@/components/settings/department-grant-panel"
import { EmptyState, ErrorState } from "@/components/shared/empty-state"
import { TableSkeleton } from "@/components/shared/loading-state"
import { useDebouncedValue } from "@/hooks/use-debounced-value"
import { isApiError } from "@/lib/api/client"
import { listPermissions, listRoles } from "@/lib/api/roles"
import { displayValue, formatNumber } from "@/lib/format"
import { useAuth } from "@clerk/nextjs"
import { useQuery } from "@tanstack/react-query"
import { Input } from "@workspace/ui/components/input"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@workspace/ui/components/table"
import { useMemo, useState } from "react"

export function PermissionsView() {
  const { isLoaded, isSignedIn } = useAuth()
  const [searchInput, setSearchInput] = useState("")
  const [openRoleId, setOpenRoleId] = useState<string | null>(null)
  const search = useDebouncedValue(searchInput.trim().toLowerCase(), 200)

  const roles = useQuery({
    queryKey: ["etah", "roles"],
    queryFn: () => listRoles({ limit: 100, page: 1 }),
    enabled: Boolean(isLoaded && isSignedIn),
  })

  const permissions = useQuery({
    queryKey: ["etah", "permissions"],
    queryFn: () => listPermissions({ limit: 100, page: 1 }),
    enabled: Boolean(isLoaded && isSignedIn),
  })

  const filteredRoles = useMemo(() => {
    const items = roles.data?.items ?? []
    if (!search) return items
    return items.filter((role) => {
      const haystack = [
        role.name,
        role.description ?? "",
        role.family,
        ...(role.permissions ?? []).map((link) => link.permission.name),
      ]
        .join(" ")
        .toLowerCase()
      return haystack.includes(search)
    })
  }, [roles.data?.items, search])

  const filteredPermissions = useMemo(() => {
    const items = permissions.data?.items ?? []
    if (!search) return items
    return items.filter((permission) =>
      `${permission.name} ${permission.description ?? ""}`
        .toLowerCase()
        .includes(search)
    )
  }, [permissions.data?.items, search])

  const loadError = roles.error ?? permissions.error

  return (
    <div>
      <PageHeader
        title="User Permissions"
        description="Grant Etah department roles to officers who signed up on this portal. The catalog below is read from the survey service."
      />
      <DepartmentGrantPanel />
      <div className="mb-4 max-w-sm">
        <label className="flex flex-col gap-1.5 text-xs font-medium text-muted-foreground">
          Search roles or permissions
          <Input
            value={searchInput}
            onChange={(event) => setSearchInput(event.target.value)}
            placeholder="report:view or ADMIN"
            aria-label="Search roles or permissions"
          />
        </label>
      </div>

      {loadError ? (
        isApiError(loadError) && loadError.status === 403 ? (
          <EmptyState
            title="You do not have permission to view roles."
            description="Role and permission lists require user:view on the survey service."
          />
        ) : (
          <ErrorState
            title="Unable to load permissions."
            description="The survey service did not return roles or permissions."
            onRetry={() => {
              void roles.refetch()
              void permissions.refetch()
            }}
          />
        )
      ) : roles.isLoading || permissions.isLoading ? (
        <TableSkeleton />
      ) : (
        <div className="space-y-6">
          <section>
            <h2 className="mb-2 text-sm font-semibold text-foreground">
              Roles
            </h2>
            {filteredRoles.length === 0 ? (
              <EmptyState title="No roles matched that search." />
            ) : (
              <div className="overflow-x-auto rounded-xl border border-border bg-card">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Role</TableHead>
                      <TableHead>Family</TableHead>
                      <TableHead className="text-right">Permissions</TableHead>
                      <TableHead className="text-right">
                        Assigned users
                      </TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredRoles.map((role) => {
                      const open = openRoleId === role.id
                      const names = (role.permissions ?? []).map(
                        (link) => link.permission.name
                      )
                      return (
                        <TableRow
                          key={role.id}
                          className="cursor-pointer"
                          tabIndex={0}
                          onClick={() => setOpenRoleId(open ? null : role.id)}
                          onKeyDown={(event) => {
                            if (event.key === "Enter" || event.key === " ") {
                              event.preventDefault()
                              setOpenRoleId(open ? null : role.id)
                            }
                          }}
                        >
                          <TableCell>
                            <p className="font-medium">{role.name}</p>
                            {role.description ? (
                              <p className="text-xs text-muted-foreground">
                                {role.description}
                              </p>
                            ) : null}
                            {open && names.length > 0 ? (
                              <p className="mt-2 text-xs text-muted-foreground">
                                {names.join(", ")}
                              </p>
                            ) : null}
                          </TableCell>
                          <TableCell>{role.family}</TableCell>
                          <TableCell className="text-right">
                            {formatNumber(role.permissionCount)}
                          </TableCell>
                          <TableCell className="text-right">
                            {formatNumber(role.assignedUsersCount)}
                          </TableCell>
                        </TableRow>
                      )
                    })}
                  </TableBody>
                </Table>
              </div>
            )}
          </section>

          <section>
            <h2 className="mb-2 text-sm font-semibold text-foreground">
              Permission catalog
            </h2>
            {filteredPermissions.length === 0 ? (
              <EmptyState title="No permissions matched that search." />
            ) : (
              <div className="overflow-x-auto rounded-xl border border-border bg-card">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Permission</TableHead>
                      <TableHead>Description</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredPermissions.map((permission) => (
                      <TableRow key={permission.id}>
                        <TableCell className="font-medium">
                          {permission.name}
                        </TableCell>
                        <TableCell>
                          {displayValue(permission.description)}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            )}
          </section>
        </div>
      )}
    </div>
  )
}

"use client"

import { EmptyState, ErrorState } from "@/components/shared/empty-state"
import { TableSkeleton } from "@/components/shared/loading-state"
import { useCurrentUserProfile } from "@/hooks/use-current-user"
import { useDebouncedValue } from "@/hooks/use-debounced-value"
import { useEtahScope } from "@/hooks/use-etah-scope"
import { isApiError } from "@/lib/api/client"
import { listRoles } from "@/lib/api/roles"
import {
  assignEtahDepartmentRole,
  listPendingClerkUsers,
} from "@/lib/api/users"
import { canGrantDepartmentAccess } from "@/lib/auth/portal-access"
import { useAuth } from "@clerk/nextjs"
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import { Button } from "@workspace/ui/components/button"
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
import { toast } from "sonner"

const GRANTABLE = new Set(["DEPT_ADMIN", "DEPT_CLERK", "DEPT_OPERATOR"])

export function DepartmentGrantPanel() {
  const { isLoaded, isSignedIn } = useAuth()
  const profile = useCurrentUserProfile()
  const scope = useEtahScope()
  const queryClient = useQueryClient()
  const [searchInput, setSearchInput] = useState("")
  const [roleByUser, setRoleByUser] = useState<Record<string, string>>({})
  const search = useDebouncedValue(searchInput.trim(), 300)
  const canGrant = canGrantDepartmentAccess(profile.data?.permissions)

  const pending = useQuery({
    queryKey: ["etah", "users", "pending", search],
    queryFn: () =>
      listPendingClerkUsers({ search: search || undefined, limit: 25 }),
    enabled: Boolean(isLoaded && isSignedIn && canGrant),
  })

  const roles = useQuery({
    queryKey: ["etah", "roles", "department"],
    queryFn: () => listRoles({ limit: 100, page: 1 }),
    enabled: Boolean(isLoaded && isSignedIn && canGrant),
  })

  const actorRoleNames = useMemo(
    () =>
      (profile.data?.tenantRoles ?? [])
        .filter((role) => role.isActive)
        .map((role) => role.role?.name ?? role.roleName ?? ""),
    [profile.data?.tenantRoles]
  )
  const canGrantDeptAdmin = actorRoleNames.includes("ADMIN")

  const departmentRoles = useMemo(
    () =>
      (roles.data?.items ?? []).filter((role) => {
        if (role.family !== "DEPARTMENT" || !GRANTABLE.has(role.name))
          return false
        if (role.name === "DEPT_ADMIN" && !canGrantDeptAdmin) return false
        return true
      }),
    [canGrantDeptAdmin, roles.data?.items]
  )

  const grant = useMutation({
    mutationFn: assignEtahDepartmentRole,
    onSuccess: async () => {
      toast.success("Etah department access granted.")
      await queryClient.invalidateQueries({ queryKey: ["etah", "users"] })
    },
    onError: (error) => {
      toast.error(
        isApiError(error) ? error.message : "Could not grant department access."
      )
    },
  })

  if (profile.isLoading) {
    return <TableSkeleton />
  }

  if (!canGrant) {
    return (
      <EmptyState
        title="You cannot grant department access."
        description="Granting Etah roles requires role:assign (DEPT_ADMIN or ADMIN). Officers sign up on this portal."
      />
    )
  }

  return (
    <div className="mb-8 space-y-4">
      <div>
        <h2 className="text-sm font-semibold text-foreground">
          Grant Etah department access
        </h2>
        <p className="mt-1 text-sm text-muted-foreground">
          Officers sign up on this portal. Grant DEPT_ADMIN, DEPT_CLERK, or
          DEPT_OPERATOR for Etah Municipal Council here.
        </p>
      </div>
      <div className="max-w-sm">
        <label className="flex flex-col gap-1.5 text-xs font-medium text-muted-foreground">
          Search pending Clerk users
          <Input
            value={searchInput}
            onChange={(event) => setSearchInput(event.target.value)}
            placeholder="Name or email"
            aria-label="Search pending users"
          />
        </label>
      </div>
      {pending.isError ? (
        isApiError(pending.error) && pending.error.status === 403 ? (
          <EmptyState
            title="You do not have permission to list pending users."
            description="role:assign is required to see Clerk signups awaiting a municipal role."
          />
        ) : (
          <ErrorState
            title="Unable to load pending users."
            onRetry={() => void pending.refetch()}
          />
        )
      ) : pending.isLoading ? (
        <TableSkeleton />
      ) : (pending.data?.items.length ?? 0) === 0 ? (
        <EmptyState
          title="No pending Clerk users."
          description="New officers appear here after they sign up on this portal."
        />
      ) : (
        <div className="overflow-x-auto rounded-xl border border-border bg-card">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Etah role</TableHead>
                <TableHead className="w-[1%]">Grant</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {pending.data?.items.map((user) => {
                const selected =
                  roleByUser[user.id] ?? departmentRoles[0]?.id ?? ""
                return (
                  <TableRow key={user.id}>
                    <TableCell className="font-medium">
                      {user.fullName}
                    </TableCell>
                    <TableCell>{user.email}</TableCell>
                    <TableCell>
                      <select
                        className="h-9 w-full min-w-40 rounded-md border border-input bg-background px-2 text-sm"
                        aria-label={`Role for ${user.fullName}`}
                        value={selected}
                        onChange={(event) =>
                          setRoleByUser((current) => ({
                            ...current,
                            [user.id]: event.target.value,
                          }))
                        }
                      >
                        {departmentRoles.map((role) => (
                          <option key={role.id} value={role.id}>
                            {role.name}
                          </option>
                        ))}
                      </select>
                    </TableCell>
                    <TableCell>
                      <Button
                        type="button"
                        size="sm"
                        className="cursor-pointer"
                        disabled={
                          !selected || !scope.data?.ulbId || grant.isPending
                        }
                        onClick={() => {
                          if (!scope.data?.ulbId) return
                          grant.mutate({
                            userId: user.id,
                            roleId: selected,
                            ulbId: scope.data.ulbId,
                          })
                        }}
                      >
                        Grant
                      </Button>
                    </TableCell>
                  </TableRow>
                )
              })}
            </TableBody>
          </Table>
        </div>
      )}
    </div>
  )
}

"use client"

import { PageHeader } from "@/components/layout/page-header"
import { EmptyState, ErrorState } from "@/components/shared/empty-state"
import { TableSkeleton } from "@/components/shared/loading-state"
import { useDebouncedValue } from "@/hooks/use-debounced-value"
import { useEtahScope } from "@/hooks/use-etah-scope"
import { isApiError } from "@/lib/api/client"
import { listEtahUsers } from "@/lib/api/users"
import { formatDateTime, formatNumber } from "@/lib/format"
import type { DirectoryUser } from "@/types/user-directory"
import { useAuth } from "@clerk/nextjs"
import { keepPreviousData, useQuery } from "@tanstack/react-query"
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
import { useState } from "react"

function roleLabel(user: DirectoryUser): string {
  const active = user.tenantRoles.filter((role) => role.isActive)
  if (active.length === 0) return "—"
  return active
    .map((role) => role.role?.name ?? role.roleName ?? "Role")
    .join(", ")
}

export function UsersListView() {
  const { isLoaded, isSignedIn } = useAuth()
  const scope = useEtahScope()
  const [searchInput, setSearchInput] = useState("")
  const [page, setPage] = useState(1)
  const search = useDebouncedValue(searchInput.trim(), 300)

  const users = useQuery({
    queryKey: [
      "etah",
      "users",
      scope.data?.districtId,
      scope.data?.ulbId,
      search,
      page,
    ],
    queryFn: () =>
      listEtahUsers({
        districtId: scope.data!.districtId,
        ulbId: scope.data!.ulbId,
        search: search || undefined,
        page,
        limit: 25,
      }),
    enabled: Boolean(isLoaded && isSignedIn && scope.data),
    placeholderData: keepPreviousData,
  })

  const meta = users.data?.meta

  return (
    <div>
      <PageHeader
        title="Users List"
        description="Officers assigned to Etah Municipal Council on the survey service."
      />
      <div className="mb-4 max-w-sm">
        <label className="flex flex-col gap-1.5 text-xs font-medium text-muted-foreground">
          Search name, email, or phone
          <Input
            value={searchInput}
            onChange={(event) => {
              setSearchInput(event.target.value)
              setPage(1)
            }}
            placeholder="Name or email"
            aria-label="Search users"
          />
        </label>
      </div>

      {users.isError ? (
        isApiError(users.error) && users.error.status === 403 ? (
          <EmptyState
            title="You do not have permission to view users."
            description="User directory requires user:view on the survey service."
          />
        ) : (
          <ErrorState
            title="Unable to load users."
            description="The survey service did not return the user directory."
            onRetry={() => void users.refetch()}
          />
        )
      ) : users.isLoading ? (
        <TableSkeleton />
      ) : (users.data?.items.length ?? 0) === 0 ? (
        <EmptyState
          title="No users found for Etah Municipal Council."
          description="Try a different search, or confirm this officer has directory access."
        />
      ) : (
        <div className="overflow-x-auto rounded-xl border border-border bg-card">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Role</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Last login</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {users.data?.items.map((user) => (
                <TableRow key={user.id}>
                  <TableCell className="font-medium">{user.fullName}</TableCell>
                  <TableCell>{user.email}</TableCell>
                  <TableCell>{roleLabel(user)}</TableCell>
                  <TableCell>{user.isActive ? "Active" : "Disabled"}</TableCell>
                  <TableCell>{formatDateTime(user.lastLoginAt)}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
          {meta && meta.totalPages > 1 ? (
            <div className="flex items-center justify-between border-t border-border px-4 py-3">
              <p className="text-xs text-muted-foreground">
                Page {meta.page} of {meta.totalPages} · {formatNumber(meta.total)} users
              </p>
              <div className="flex gap-2">
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  className="cursor-pointer"
                  disabled={page <= 1}
                  onClick={() => setPage((current) => Math.max(1, current - 1))}
                >
                  Previous
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  className="cursor-pointer"
                  disabled={page >= meta.totalPages}
                  onClick={() => setPage((current) => current + 1)}
                >
                  Next
                </Button>
              </div>
            </div>
          ) : null}
        </div>
      )}
    </div>
  )
}

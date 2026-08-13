"use client"

import { PageHeader } from "@/components/layout/page-header"
import { EmptyState, ErrorState } from "@/components/shared/empty-state"
import { TableSkeleton } from "@/components/shared/loading-state"
import { SurveyStatusBadge } from "@/components/shared/survey-status-badge"
import { useDebouncedValue } from "@/hooks/use-debounced-value"
import { useEtahScope } from "@/hooks/use-etah-scope"
import { getWards } from "@/lib/api/geography"
import { getEtahSurveyRegistry } from "@/lib/api/survey"
import { formatNumber } from "@/lib/format"
import type {
  SurveyRegistrySearchField,
  SurveyRegistrySortBy,
  SurveyRegistryTab,
} from "@/types/survey"
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
import { cn } from "@workspace/ui/lib/utils"
import { Eye } from "lucide-react"
import Link from "next/link"
import { useRouter, useSearchParams } from "next/navigation"
import { useCallback, useEffect, useMemo, useState } from "react"

const TABS: Array<{ id: SurveyRegistryTab; label: string }> = [
  { id: "all", label: "All" },
  { id: "draft", label: "Draft" },
  { id: "submitted", label: "Submitted" },
  { id: "qcPending", label: "QC Pending" },
  { id: "qcApproved", label: "QC Approved" },
  { id: "rejected", label: "Rejected" },
]

const SEARCH_FIELDS: Array<{ id: SurveyRegistrySearchField; label: string }> = [
  { id: "all", label: "All fields" },
  { id: "propertyId", label: "Property ID" },
  { id: "owner", label: "Owner" },
  { id: "parcel", label: "Parcel" },
]

const PAGE_SIZE = 25

function isTab(value: string | null): value is SurveyRegistryTab {
  return TABS.some((tab) => tab.id === value)
}

function isSearchField(value: string | null): value is SurveyRegistrySearchField {
  return SEARCH_FIELDS.some((field) => field.id === value)
}

function isSortBy(value: string | null): value is SurveyRegistrySortBy {
  return value === "createdAt" || value === "propertyId" || value === "surveyStatus"
}

export function SurveyRegistryView() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const { isLoaded, isSignedIn } = useAuth()
  const scope = useEtahScope()

  const urlSearch = searchParams.get("search") ?? ""
  const [searchInput, setSearchInput] = useState(urlSearch)
  const [prevUrlSearch, setPrevUrlSearch] = useState(urlSearch)
  if (urlSearch !== prevUrlSearch) {
    setPrevUrlSearch(urlSearch)
    setSearchInput(urlSearch)
  }
  const debouncedSearch = useDebouncedValue(searchInput.trim(), 300)

  const tabParam = searchParams.get("tab")
  const tab: SurveyRegistryTab = isTab(tabParam) ? tabParam : "all"
  const searchFieldParam = searchParams.get("searchField")
  const searchField: SurveyRegistrySearchField = isSearchField(searchFieldParam)
    ? searchFieldParam
    : "all"
  const wardId = searchParams.get("wardId") ?? ""
  const page = Math.max(1, Number(searchParams.get("page") ?? "1") || 1)
  const sortByParam = searchParams.get("sortBy")
  const sortBy: SurveyRegistrySortBy = isSortBy(sortByParam)
    ? sortByParam
    : "createdAt"
  const sortOrder = searchParams.get("sortOrder") === "asc" ? "asc" : "desc"

  const replaceParams = useCallback(
    (patch: Record<string, string | undefined>) => {
      const next = new URLSearchParams(searchParams.toString())
      for (const [key, value] of Object.entries(patch)) {
        if (!value) next.delete(key)
        else next.set(key, value)
      }
      const query = next.toString()
      router.replace(query ? `/survey/properties?${query}` : "/survey/properties")
    },
    [router, searchParams]
  )

  useEffect(() => {
    if (debouncedSearch === urlSearch) return
    if (searchInput.trim() !== debouncedSearch) return
    replaceParams({
      search: debouncedSearch || undefined,
      page: "1",
    })
  }, [debouncedSearch, replaceParams, searchInput, urlSearch])

  const wards = useQuery({
    queryKey: ["etah", "geo-wards", scope.data?.ulbId],
    queryFn: () => getWards(scope.data!.ulbId),
    enabled: isLoaded && Boolean(isSignedIn) && Boolean(scope.data?.ulbId),
    staleTime: 5 * 60_000,
  })

  const registry = useQuery({
    queryKey: [
      "etah",
      "registry",
      scope.data?.districtId,
      scope.data?.ulbId,
      wardId,
      debouncedSearch,
      searchField,
      tab,
      page,
      sortBy,
      sortOrder,
    ],
    queryFn: () =>
      getEtahSurveyRegistry({
        districtId: scope.data!.districtId,
        ulbId: scope.data!.ulbId,
        wardId: wardId || undefined,
        search: debouncedSearch || undefined,
        searchField: debouncedSearch ? searchField : undefined,
        tab,
        page,
        limit: PAGE_SIZE,
        sortBy,
        sortOrder,
      }),
    enabled: isLoaded && Boolean(isSignedIn) && Boolean(scope.data),
    placeholderData: keepPreviousData,
  })

  const counts = registry.data?.counts
  const meta = registry.data?.meta
  const items = registry.data?.items ?? []
  const serialStart = ((meta?.page ?? page) - 1) * (meta?.limit ?? PAGE_SIZE)

  const scopeLabel = useMemo(() => {
    if (registry.data?.scope?.label) return registry.data.scope.label
    if (!scope.data) return "Etah Nagar Palika Parishad"
    return `${scope.data.districtName} · ${scope.data.ulbName}`
  }, [registry.data?.scope?.label, scope.data])

  function toggleSort(key: SurveyRegistrySortBy) {
    if (sortBy === key) {
      replaceParams({ sortOrder: sortOrder === "asc" ? "desc" : "asc", page: "1" })
      return
    }
    replaceParams({
      sortBy: key,
      sortOrder: key === "propertyId" ? "asc" : "desc",
      page: "1",
    })
  }

  if (scope.isError) {
    return (
      <ErrorState
        title="Unable to lock Etah geography"
        description="Survey registry requires an Etah Municipal Council scope."
        onRetry={() => void scope.refetch()}
      />
    )
  }

  return (
    <div className="space-y-5">
      <PageHeader
        title="Survey Registry"
        description={`Property surveys for ${scopeLabel}`}
      />

      <div className="rounded-xl border border-border bg-muted/40 p-3 sm:p-4">
        <form
          className="grid grid-cols-1 gap-3 md:grid-cols-2 xl:grid-cols-4"
          onSubmit={(event) => {
            event.preventDefault()
            replaceParams({
              search: searchInput.trim() || undefined,
              page: "1",
            })
          }}
        >
          <label className="flex flex-col gap-1.5 text-xs font-medium text-muted-foreground">
            Ward No
            <select
              className="h-9 rounded-lg border border-input bg-background px-2.5 text-sm text-foreground"
              value={wardId}
              onChange={(event) =>
                replaceParams({
                  wardId: event.target.value || undefined,
                  page: "1",
                })
              }
              aria-label="Filter by ward"
            >
              <option value="">All Wards</option>
              {(wards.data?.items ?? []).map((ward) => (
                <option key={ward.id} value={ward.id}>
                  {ward.wardName || `Ward ${ward.wardNumber}`}
                </option>
              ))}
            </select>
          </label>
          <label className="flex flex-col gap-1.5 text-xs font-medium text-muted-foreground">
            Property ID / Owner Search
            <Input
              value={searchInput}
              onChange={(event) => setSearchInput(event.target.value)}
              placeholder="PR-01001 or owner name"
              aria-label="Search property ID or owner"
            />
          </label>
          <label className="flex flex-col gap-1.5 text-xs font-medium text-muted-foreground">
            Search in
            <select
              className="h-9 rounded-lg border border-input bg-background px-2.5 text-sm text-foreground"
              value={searchField}
              onChange={(event) =>
                replaceParams({
                  searchField: event.target.value,
                  page: "1",
                })
              }
              aria-label="Search field"
            >
              {SEARCH_FIELDS.map((field) => (
                <option key={field.id} value={field.id}>
                  {field.label}
                </option>
              ))}
            </select>
          </label>
          <div className="flex items-end gap-2">
            <Button type="submit" className="cursor-pointer">
              Search
            </Button>
            <Button
              type="button"
              variant="outline"
              className="cursor-pointer"
              onClick={() => {
                setSearchInput("")
                replaceParams({
                  search: undefined,
                  searchField: undefined,
                  wardId: undefined,
                  tab: undefined,
                  page: undefined,
                  sortBy: undefined,
                  sortOrder: undefined,
                })
              }}
            >
              Reset
            </Button>
          </div>
        </form>
      </div>

      <div
        role="tablist"
        aria-label="Survey status"
        className="flex flex-wrap gap-1 border-b border-border"
      >
        {TABS.map((item) => {
          const selected = tab === item.id
          const count = counts?.[item.id]
          return (
            <button
              key={item.id}
              type="button"
              role="tab"
              aria-selected={selected}
              className={cn(
                "relative cursor-pointer px-3 py-2 text-sm transition-colors duration-200",
                selected
                  ? "font-medium text-brand-navy"
                  : "text-muted-foreground hover:text-foreground"
              )}
              onClick={() => replaceParams({ tab: item.id, page: "1" })}
            >
              {item.label}
              {typeof count === "number" ? (
                <span className="ml-1.5 tabular-nums">
                  ({formatNumber(count)})
                </span>
              ) : null}
              {selected ? (
                <span
                  className="absolute inset-x-2 -bottom-px h-0.5 bg-brand-navy"
                  aria-hidden
                />
              ) : null}
            </button>
          )
        })}
      </div>

      {registry.isError ? (
        <ErrorState
          title="Unable to load Etah survey data."
          description="The survey service did not respond."
          onRetry={() => void registry.refetch()}
        />
      ) : registry.isLoading ? (
        <TableSkeleton />
      ) : items.length === 0 ? (
        <EmptyState
          title="No survey data available."
          description="Try another ward, status tab, or search term."
        />
      ) : (
        <section className="rounded-xl border border-border bg-card">
          <div className="flex items-center justify-between border-b border-border px-4 py-2.5 text-sm">
            <p className="text-muted-foreground">
              {formatNumber(meta?.total ?? 0)} records
            </p>
          </div>
          <div className="overflow-x-auto">
            <Table>
              <caption className="sr-only">
                Etah survey registry, page {meta?.page ?? page} of{" "}
                {meta?.totalPages ?? 1}
              </caption>
              <TableHeader className="sticky top-0 z-10 bg-card">
                <TableRow>
                  <TableHead className="w-14">S.No</TableHead>
                  <TableHead>Action</TableHead>
                  <SortableHead
                    label="Status"
                    active={sortBy === "surveyStatus"}
                    direction={sortOrder}
                    onClick={() => toggleSort("surveyStatus")}
                  />
                  <TableHead>Survey Progress</TableHead>
                  <TableHead>Surveyor</TableHead>
                  <SortableHead
                    label="Property ID"
                    active={sortBy === "propertyId"}
                    direction={sortOrder}
                    onClick={() => toggleSort("propertyId")}
                  />
                  <TableHead>Ward Number</TableHead>
                  <TableHead>Parcel Number</TableHead>
                  <TableHead>Owner Name</TableHead>
                  <SortableHead
                    label="Survey Date"
                    active={sortBy === "createdAt"}
                    direction={sortOrder}
                    onClick={() => toggleSort("createdAt")}
                  />
                </TableRow>
              </TableHeader>
              <TableBody>
                {items.map((item, index) => {
                  const href = `/survey/properties/${item.id}`
                  return (
                    <TableRow
                      key={item.id}
                      className="cursor-pointer"
                      tabIndex={0}
                      onClick={() => router.push(href)}
                      onKeyDown={(event) => {
                        if (event.key === "Enter" || event.key === " ") {
                          event.preventDefault()
                          router.push(href)
                        }
                      }}
                    >
                      <TableCell className="tabular-nums text-muted-foreground">
                        {serialStart + index + 1}
                      </TableCell>
                      <TableCell>
                        <Link
                          href={href}
                          className="inline-flex items-center gap-1 font-medium text-brand-navy underline-offset-2 hover:underline"
                          onClick={(event) => event.stopPropagation()}
                        >
                          <Eye className="size-3.5" aria-hidden />
                          View
                        </Link>
                      </TableCell>
                      <TableCell>
                        <SurveyStatusBadge
                          status={item.status}
                          surveyStatus={item.surveyStatus}
                          qcStatus={item.qcStatus}
                        />
                      </TableCell>
                      <TableCell>
                        <ProgressCell value={item.progress} />
                      </TableCell>
                      <TableCell>{item.surveyorName || "—"}</TableCell>
                      <TableCell className="font-medium">
                        {item.propertyId}
                      </TableCell>
                      <TableCell>{item.wardNumber || "—"}</TableCell>
                      <TableCell>{item.parcelNumber || "—"}</TableCell>
                      <TableCell>{item.ownerName || "—"}</TableCell>
                      <TableCell>{item.surveyDate || "—"}</TableCell>
                    </TableRow>
                  )
                })}
              </TableBody>
            </Table>
          </div>
          <div className="flex items-center justify-between border-t border-border px-4 py-3 text-sm">
            <p className="text-muted-foreground">
              {formatNumber(meta?.total ?? 0)} surveys · page {meta?.page ?? page}{" "}
              of {meta?.totalPages ?? 1}
            </p>
            <div className="flex gap-2">
              <Button
                type="button"
                variant="outline"
                size="sm"
                className="cursor-pointer"
                disabled={(meta?.page ?? page) <= 1}
                onClick={() =>
                  replaceParams({ page: String(Math.max(1, page - 1)) })
                }
              >
                Previous
              </Button>
              <Button
                type="button"
                variant="outline"
                size="sm"
                className="cursor-pointer"
                disabled={(meta?.page ?? page) >= (meta?.totalPages ?? 1)}
                onClick={() => replaceParams({ page: String(page + 1) })}
              >
                Next
              </Button>
            </div>
          </div>
        </section>
      )}
    </div>
  )
}

function ProgressCell({ value }: { value: number }) {
  const clamped = Math.max(0, Math.min(100, value))
  return (
    <div className="flex min-w-28 items-center gap-2">
      <div
        className="h-1.5 flex-1 overflow-hidden rounded-full bg-muted"
        role="progressbar"
        aria-valuenow={clamped}
        aria-valuemin={0}
        aria-valuemax={100}
        aria-label={`Survey progress ${clamped}%`}
      >
        <div
          className="h-full rounded-full bg-brand-navy"
          style={{ width: `${clamped}%` }}
        />
      </div>
      <span className="w-10 text-right text-xs tabular-nums text-muted-foreground">
        {clamped}%
      </span>
    </div>
  )
}

function SortableHead({
  label,
  active,
  direction,
  onClick,
}: {
  label: string
  active: boolean
  direction: "asc" | "desc"
  onClick: () => void
}) {
  return (
    <TableHead aria-sort={active ? (direction === "asc" ? "ascending" : "descending") : "none"}>
      <button
        type="button"
        className="cursor-pointer font-medium"
        onClick={onClick}
      >
        {label}
        {active ? (
          <span className="sr-only">
            {direction === "asc" ? " sorted ascending" : " sorted descending"}
          </span>
        ) : null}
      </button>
    </TableHead>
  )
}

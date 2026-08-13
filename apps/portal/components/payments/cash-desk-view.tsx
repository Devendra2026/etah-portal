"use client"

import { PageHeader } from "@/components/layout/page-header"
import { EmptyState, ErrorState } from "@/components/shared/empty-state"
import { TableSkeleton } from "@/components/shared/loading-state"
import { useDebouncedValue } from "@/hooks/use-debounced-value"
import { useEtahScope } from "@/hooks/use-etah-scope"
import { isApiError } from "@/lib/api/client"
import { getEtahDemandNotice } from "@/lib/api/demand-notices"
import { getEtahSurveyRegistry } from "@/lib/api/survey"
import { displayValue, formatInrExact } from "@/lib/format"
import type { SurveyRegistryRow } from "@/types/survey"
import { useAuth } from "@clerk/nextjs"
import { useQuery } from "@tanstack/react-query"
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
import Link from "next/link"
import { useState } from "react"

export function CashDeskView() {
  const { isLoaded, isSignedIn } = useAuth()
  const scope = useEtahScope()
  const [searchInput, setSearchInput] = useState("")
  const [selected, setSelected] = useState<SurveyRegistryRow | null>(null)
  const search = useDebouncedValue(searchInput.trim(), 300)

  const results = useQuery({
    queryKey: ["etah", "cash-desk-search", scope.data?.ulbId, search],
    queryFn: () =>
      getEtahSurveyRegistry({
        districtId: scope.data!.districtId,
        ulbId: scope.data!.ulbId,
        search,
        searchField: "propertyId",
        tab: "qcApproved",
        page: 1,
        limit: 10,
      }),
    enabled: Boolean(isLoaded && isSignedIn && scope.data && search.length >= 2),
  })

  const demand = useQuery({
    queryKey: ["etah", "demand-notice", selected?.id],
    queryFn: () => getEtahDemandNotice(selected!.id),
    enabled: Boolean(selected?.id),
    retry: false,
  })

  return (
    <div>
      <PageHeader
        title="Cash Desk"
        description="Look up an approved property and print the demand notice. Offline collection is completed on the municipal payment portal."
      />

      <div className="mb-5 max-w-md rounded-xl border border-border bg-card p-4">
        <label className="flex flex-col gap-1.5 text-xs font-medium text-muted-foreground">
          Property ID
          <Input
            value={searchInput}
            onChange={(event) => {
              setSearchInput(event.target.value)
              setSelected(null)
            }}
            placeholder="Enter property ID"
            aria-label="Search property for cash desk"
          />
        </label>
      </div>

      {search.length < 2 ? (
        <EmptyState
          title="Search a property to open cash desk."
          description="Enter at least two characters of the property ID. Collection posting is not available on this portal."
        />
      ) : results.isError ? (
        <ErrorState
          title="Unable to search properties."
          description="The survey service did not return matching properties."
          onRetry={() => void results.refetch()}
        />
      ) : results.isLoading ? (
        <TableSkeleton rows={4} />
      ) : (results.data?.items.length ?? 0) === 0 ? (
        <EmptyState
          title="No QC-approved property matched that ID."
          description="Cash desk only lists approved surveys that can generate a demand notice."
        />
      ) : (
        <div className="mb-5 overflow-x-auto rounded-xl border border-border bg-card">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Property ID</TableHead>
                <TableHead>Owner</TableHead>
                <TableHead>Ward</TableHead>
                <TableHead className="text-right">Action</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {results.data?.items.map((row) => (
                <TableRow key={row.id}>
                  <TableCell className="font-medium">{row.propertyId}</TableCell>
                  <TableCell>{displayValue(row.ownerName)}</TableCell>
                  <TableCell>{displayValue(row.wardNumber)}</TableCell>
                  <TableCell className="text-right">
                    <Button
                      type="button"
                      variant={selected?.id === row.id ? "default" : "outline"}
                      size="sm"
                      className="cursor-pointer"
                      onClick={() => setSelected(row)}
                    >
                      {selected?.id === row.id ? "Selected" : "Select"}
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      )}

      {selected ? (
        <section className="rounded-xl border border-border bg-card p-4">
          <h2 className="text-sm font-semibold text-foreground">
            Demand for {selected.propertyId}
          </h2>
          {demand.isLoading ? (
            <TableSkeleton rows={3} />
          ) : demand.isError ? (
            isApiError(demand.error) && demand.error.status === 404 ? (
              <EmptyState
                title="Demand notice is available after QC approval."
                description="This property does not yet have an assessed demand."
              />
            ) : (
              <ErrorState
                title="Unable to load demand notice."
                description="Tax assessment was not returned for this property."
                onRetry={() => void demand.refetch()}
              />
            )
          ) : demand.data ? (
            <div className="mt-4 space-y-4">
              <dl className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4">
                <div>
                  <dt className="text-xs text-muted-foreground">Property tax</dt>
                  <dd className="text-sm font-medium">
                    {formatInrExact(demand.data.assessment.propertyTax)}
                  </dd>
                </div>
                <div>
                  <dt className="text-xs text-muted-foreground">Water tax</dt>
                  <dd className="text-sm font-medium">
                    {formatInrExact(demand.data.assessment.waterTax)}
                  </dd>
                </div>
                <div>
                  <dt className="text-xs text-muted-foreground">Drainage tax</dt>
                  <dd className="text-sm font-medium">
                    {formatInrExact(demand.data.assessment.drainageTax)}
                  </dd>
                </div>
                <div>
                  <dt className="text-xs text-muted-foreground">Total demand</dt>
                  <dd className="text-sm font-semibold">
                    {formatInrExact(demand.data.assessment.totalAnnualDemand)}
                  </dd>
                </div>
              </dl>
              <div className="flex flex-wrap gap-2">
                <Button
                  nativeButton={false}
                  render={<Link href={`/survey/properties/${selected.id}`} />}
                  variant="outline"
                  className="cursor-pointer"
                >
                  Open property
                </Button>
                <Button type="button" disabled className="cursor-not-allowed">
                  Collect payment
                </Button>
              </div>
              <p className="text-xs text-muted-foreground">
                Collect is disabled here. Record the receipt on the municipal
                payment portal after this demand is generated.
              </p>
            </div>
          ) : null}
        </section>
      ) : null}
    </div>
  )
}

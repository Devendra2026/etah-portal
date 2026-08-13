"use client"

import { StatusBadge } from "@/components/shared/status-badge"
import { formatNumber, formatPercent } from "@/lib/format"
import type { WardRow } from "@/types/ward"
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
import { useRouter } from "next/navigation"
import { useMemo, useState } from "react"

type SortKey =
  | "wardName"
  | "totalProperties"
  | "surveyed"
  | "pending"
  | "surveyCompletionPct"

function downloadCsv(rows: WardRow[]) {
  const header = [
    "Ward",
    "Total Properties",
    "Surveyed",
    "Pending",
    "Survey Completion %",
    "Property Tax",
    "Water Tax",
    "Drainage Tax",
    "Collection %",
  ]
  const lines = rows.map((row) =>
    [
      row.wardName,
      row.totalProperties,
      row.surveyed,
      row.pending,
      row.surveyCompletionPct.toFixed(1),
      "",
      "",
      "",
      "",
    ].join(",")
  )
  const blob = new Blob([[header.join(","), ...lines].join("\n")], {
    type: "text/csv;charset=utf-8",
  })
  const url = URL.createObjectURL(blob)
  const link = document.createElement("a")
  link.href = url
  link.download = "etah-ward-overview.csv"
  link.click()
  URL.revokeObjectURL(url)
}

export function WardPerformanceTable({ rows }: { rows: WardRow[] }) {
  const router = useRouter()
  const [search, setSearch] = useState("")
  const [sortKey, setSortKey] = useState<SortKey>("pending")
  const [sortDir, setSortDir] = useState<"asc" | "desc">("desc")
  const [page, setPage] = useState(0)
  const pageSize = 15

  const filtered = useMemo(() => {
    const query = search.trim().toLowerCase()
    const next = query
      ? rows.filter(
          (row) =>
            row.wardName.toLowerCase().includes(query) ||
            row.wardNumber.toLowerCase().includes(query)
        )
      : [...rows]

    next.sort((a, b) => {
      const left = a[sortKey]
      const right = b[sortKey]
      const compared =
        typeof left === "string"
          ? left.localeCompare(String(right))
          : Number(left) - Number(right)
      return sortDir === "asc" ? compared : -compared
    })
    return next
  }, [rows, search, sortDir, sortKey])

  const pageCount = Math.max(1, Math.ceil(filtered.length / pageSize))
  const currentPage = Math.min(page, pageCount - 1)
  const paged = filtered.slice(
    currentPage * pageSize,
    currentPage * pageSize + pageSize
  )

  function toggleSort(key: SortKey) {
    if (sortKey === key) {
      setSortDir((dir) => (dir === "asc" ? "desc" : "asc"))
      return
    }
    setSortKey(key)
    setSortDir(key === "wardName" ? "asc" : "desc")
  }

  return (
    <section
      aria-labelledby="ward-table-heading"
      className="rounded-xl border border-border bg-card"
    >
      <div className="flex flex-col gap-3 border-b border-border px-4 py-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2
            id="ward-table-heading"
            className="font-heading text-lg font-semibold"
          >
            Ward-wise Overview
          </h2>
          <p className="text-sm text-muted-foreground">
            Survey progress by ward. Tax collection columns await a ledger API.
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <Input
            value={search}
            onChange={(event) => {
              setSearch(event.target.value)
              setPage(0)
            }}
            placeholder="Search wards"
            className="h-9 w-48"
            aria-label="Search wards"
          />
          <Button
            type="button"
            variant="outline"
            className="cursor-pointer"
            onClick={() => downloadCsv(filtered)}
          >
            Export CSV
          </Button>
        </div>
      </div>
      <Table>
        <TableHeader className="sticky top-0 z-10 bg-card">
          <TableRow>
            <SortableHead
              label="Ward"
              active={sortKey === "wardName"}
              onClick={() => toggleSort("wardName")}
            />
            <SortableHead
              label="Total Properties"
              numeric
              active={sortKey === "totalProperties"}
              onClick={() => toggleSort("totalProperties")}
            />
            <SortableHead
              label="Surveyed"
              numeric
              active={sortKey === "surveyed"}
              onClick={() => toggleSort("surveyed")}
            />
            <SortableHead
              label="Pending"
              numeric
              active={sortKey === "pending"}
              onClick={() => toggleSort("pending")}
            />
            <TableHead className="text-right">Property Tax</TableHead>
            <TableHead className="text-right">Water Tax</TableHead>
            <TableHead className="text-right">Drainage Tax</TableHead>
            <TableHead className="text-right">Collection %</TableHead>
            <SortableHead
              label="Survey %"
              numeric
              active={sortKey === "surveyCompletionPct"}
              onClick={() => toggleSort("surveyCompletionPct")}
            />
            <TableHead>Status</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {paged.map((row) => (
            <TableRow
              key={row.wardId}
              className="cursor-pointer"
              tabIndex={0}
              onClick={() => router.push(`/survey/wards/${row.wardId}`)}
              onKeyDown={(event) => {
                if (event.key === "Enter" || event.key === " ") {
                  event.preventDefault()
                  router.push(`/survey/wards/${row.wardId}`)
                }
              }}
            >
              <TableCell className="font-medium">{row.wardName}</TableCell>
              <TableCell className="text-right tabular-nums">
                {formatNumber(row.totalProperties)}
              </TableCell>
              <TableCell className="text-right tabular-nums">
                {formatNumber(row.surveyed)}
              </TableCell>
              <TableCell className="text-right tabular-nums">
                {formatNumber(row.pending)}
              </TableCell>
              <TableCell
                className="text-right text-muted-foreground"
                title="Assessed totals not provided by the survey API"
              >
                —
              </TableCell>
              <TableCell
                className="text-right text-muted-foreground"
                title="Assessed totals not provided by the survey API"
              >
                —
              </TableCell>
              <TableCell
                className="text-right text-muted-foreground"
                title="Assessed totals not provided by the survey API"
              >
                —
              </TableCell>
              <TableCell
                className="text-right text-muted-foreground"
                title="Collection ledger not available"
              >
                —
              </TableCell>
              <TableCell className="text-right tabular-nums">
                {formatPercent(row.surveyCompletionPct)}
              </TableCell>
              <TableCell>
                <StatusBadge label={row.performance} />
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
      <div className="flex items-center justify-between border-t border-border px-4 py-3 text-sm">
        <p className="text-muted-foreground">
          {filtered.length} wards · page {currentPage + 1} of {pageCount}
        </p>
        <div className="flex gap-2">
          <Button
            type="button"
            variant="outline"
            size="sm"
            className="cursor-pointer"
            disabled={currentPage === 0}
            onClick={() => setPage((value) => Math.max(0, value - 1))}
          >
            Previous
          </Button>
          <Button
            type="button"
            variant="outline"
            size="sm"
            className="cursor-pointer"
            disabled={currentPage >= pageCount - 1}
            onClick={() => setPage((value) => value + 1)}
          >
            Next
          </Button>
        </div>
      </div>
    </section>
  )
}

function SortableHead({
  label,
  numeric,
  active,
  onClick,
}: {
  label: string
  numeric?: boolean
  active: boolean
  onClick: () => void
}) {
  return (
    <TableHead className={cn(numeric && "text-right")}>
      <button
        type="button"
        className="cursor-pointer font-medium"
        onClick={onClick}
      >
        {label}
        {active ? <span className="sr-only"> sorted</span> : null}
      </button>
    </TableHead>
  )
}

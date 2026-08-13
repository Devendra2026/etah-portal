"use client"

import type { DashboardFilterState } from "@/hooks/use-etah-dashboard"
import { DATE_PRESET_LABELS, type DatePreset } from "@/lib/date-range"
import type { WardRow } from "@/types/ward"
import { Button } from "@workspace/ui/components/button"
import { Input } from "@workspace/ui/components/input"

export function DashboardFilters({
  filters,
  wards,
  onChange,
  onReset,
}: {
  filters: DashboardFilterState
  wards: WardRow[]
  onChange: (next: DashboardFilterState) => void
  onReset: () => void
}) {
  return (
    <div className="mb-5 flex flex-col gap-3 rounded-xl border border-border bg-card p-3 sm:p-4">
      <div className="grid grid-cols-1 gap-3 md:grid-cols-4">
        <label className="flex flex-col gap-1.5 text-xs font-medium text-muted-foreground">
          District
          <Input
            value="Etah"
            readOnly
            aria-readonly
            className="h-9 bg-muted/50"
          />
        </label>
        <label className="flex flex-col gap-1.5 text-xs font-medium text-muted-foreground">
          Ward
          <select
            className="h-9 rounded-lg border border-input bg-background px-2.5 text-sm text-foreground"
            value={filters.wardId}
            onChange={(event) =>
              onChange({ ...filters, wardId: event.target.value })
            }
            aria-label="Filter by ward"
          >
            <option value="">All wards</option>
            {wards.map((ward) => (
              <option key={ward.wardId} value={ward.wardId}>
                {ward.wardName}
              </option>
            ))}
          </select>
        </label>
        <label className="flex flex-col gap-1.5 text-xs font-medium text-muted-foreground">
          Date range
          <select
            className="h-9 rounded-lg border border-input bg-background px-2.5 text-sm text-foreground"
            value={filters.dateRange.preset}
            onChange={(event) =>
              onChange({
                ...filters,
                dateRange: {
                  ...filters.dateRange,
                  preset: event.target.value as DatePreset,
                },
              })
            }
            aria-label="Filter by date range"
          >
            {(Object.keys(DATE_PRESET_LABELS) as DatePreset[]).map((preset) => (
              <option key={preset} value={preset}>
                {DATE_PRESET_LABELS[preset]}
              </option>
            ))}
          </select>
        </label>
        <div className="flex items-end">
          <Button
            type="button"
            variant="outline"
            className="cursor-pointer"
            onClick={onReset}
          >
            Reset
          </Button>
        </div>
      </div>
    </div>
  )
}

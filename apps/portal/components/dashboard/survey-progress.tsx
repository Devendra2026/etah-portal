"use client"

import { formatNumber, formatPercent } from "@/lib/format"
import type { CommandCenterKpis } from "@/types/survey"
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@workspace/ui/components/card"
import { Progress } from "@workspace/ui/components/progress"

export function SurveyProgress({ kpis }: { kpis: CommandCenterKpis }) {
  const surveyed = kpis.submittedSurveys + kpis.qcApproved
  const pending = Math.max(kpis.totalProperties - surveyed, 0)

  return (
    <Card size="sm" className="border-border shadow-xs">
      <CardHeader>
        <CardTitle className="text-base">Survey Progress</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <div className="mb-2 flex items-center justify-between text-sm">
            <span className="text-muted-foreground">Field completion</span>
            <span className="font-medium tabular-nums">
              {formatPercent(kpis.avgFieldCompletionPct)}
            </span>
          </div>
          <Progress
            value={kpis.avgFieldCompletionPct}
            aria-label="Survey field completion"
          />
        </div>
        <dl className="grid grid-cols-2 gap-3 text-sm">
          <Metric label="Surveyed" value={formatNumber(surveyed)} />
          <Metric label="Pending" value={formatNumber(pending)} />
          <Metric label="Draft" value={formatNumber(kpis.draftSurveys)} />
          <Metric
            label="Submitted today"
            value={formatNumber(kpis.submittedToday)}
          />
          <Metric label="QC approved" value={formatNumber(kpis.qcApproved)} />
          <Metric label="Returned" value={formatNumber(kpis.returned)} />
        </dl>
      </CardContent>
    </Card>
  )
}

function Metric({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-lg bg-muted/50 px-3 py-2">
      <dt className="text-xs text-muted-foreground">{label}</dt>
      <dd className="mt-0.5 font-medium tabular-nums">{value}</dd>
    </div>
  )
}

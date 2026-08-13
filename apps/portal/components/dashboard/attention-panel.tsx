import { EmptyState } from "@/components/shared/empty-state"
import { StatusBadge } from "@/components/shared/status-badge"
import { formatNumber, formatPercent } from "@/lib/format"
import type { WardRow } from "@/types/ward"
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@workspace/ui/components/card"

export function AttentionPanel({ wards }: { wards: WardRow[] }) {
  const withData = wards.filter((ward) => ward.totalProperties > 0)
  const highestSurvey = [...withData]
    .sort((a, b) => b.surveyCompletionPct - a.surveyCompletionPct)
    .slice(0, 5)
  const needsAttention = [...withData]
    .filter(
      (ward) =>
        ward.performance === "Attention" || ward.performance === "Critical"
    )
    .sort((a, b) => b.pending - a.pending)
    .slice(0, 5)

  return (
    <div className="grid grid-cols-1 gap-4 xl:grid-cols-3">
      <RankCard
        title="Highest Survey Progress"
        rows={highestSurvey}
        empty="No survey progress to rank yet."
      />
      <Card size="sm" className="border-border shadow-xs">
        <CardHeader>
          <CardTitle className="text-base">Highest Tax Collection</CardTitle>
        </CardHeader>
        <CardContent>
          <EmptyState
            title="Collection data is not available"
            description="The survey API does not expose a payment ledger. This ranking will appear when collection totals exist."
          />
        </CardContent>
      </Card>
      <RankCard
        title="Needs Attention"
        rows={needsAttention}
        empty="No wards currently need attention."
      />
    </div>
  )
}

function RankCard({
  title,
  rows,
  empty,
}: {
  title: string
  rows: WardRow[]
  empty: string
}) {
  return (
    <Card size="sm" className="border-border shadow-xs">
      <CardHeader>
        <CardTitle className="text-base">{title}</CardTitle>
      </CardHeader>
      <CardContent>
        {rows.length === 0 ? (
          <p className="text-sm text-muted-foreground">{empty}</p>
        ) : (
          <ul className="space-y-3">
            {rows.map((row) => (
              <li
                key={row.wardId}
                className="flex items-center justify-between gap-3"
              >
                <div className="min-w-0">
                  <p className="truncate text-sm font-medium">{row.wardName}</p>
                  <p className="text-xs text-muted-foreground">
                    {formatNumber(row.pending)} pending ·{" "}
                    {formatPercent(row.surveyCompletionPct)} complete
                  </p>
                </div>
                <StatusBadge label={row.performance} />
              </li>
            ))}
          </ul>
        )}
      </CardContent>
    </Card>
  )
}

import { EmptyState } from "@/components/shared/empty-state"
import type { DashboardAnalytics } from "@/types/survey"
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@workspace/ui/components/card"
import {
  Bar,
  BarChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts"

export function SurveyTrend({
  analytics,
}: {
  analytics: DashboardAnalytics | undefined
}) {
  const data = analytics?.dailyTrend?.slice(-14) ?? []

  return (
    <Card size="sm" className="border-border shadow-xs">
      <CardHeader>
        <CardTitle className="text-base">Survey Activity Trend</CardTitle>
      </CardHeader>
      <CardContent>
        {data.length === 0 ? (
          <EmptyState
            title="No trend data for this period"
            description="Try changing the date range or refresh once surveys are recorded."
          />
        ) : (
          <div className="h-56">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={data} barCategoryGap={8}>
                <CartesianGrid vertical={false} stroke="var(--border)" />
                <XAxis
                  dataKey="date"
                  tick={{ fontSize: 11 }}
                  tickLine={false}
                  axisLine={false}
                />
                <YAxis
                  allowDecimals={false}
                  tick={{ fontSize: 11 }}
                  tickLine={false}
                  axisLine={false}
                />
                <Tooltip />
                <Bar
                  dataKey="created"
                  name="Created"
                  fill="var(--brand-navy)"
                  radius={[4, 4, 0, 0]}
                />
                <Bar
                  dataKey="approved"
                  name="Approved"
                  fill="var(--success)"
                  radius={[4, 4, 0, 0]}
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
        )}
      </CardContent>
    </Card>
  )
}

import { Card, CardContent } from "@workspace/ui/components/card"
import { cn } from "@workspace/ui/lib/utils"
import type { LucideIcon } from "lucide-react"

export function KpiCard({
  label,
  value,
  hint,
  icon: Icon,
  tone = "default",
  unavailable,
}: {
  label: string
  value: string
  hint?: string
  icon: LucideIcon
  tone?: "default" | "success" | "warning" | "danger" | "muted"
  unavailable?: boolean
}) {
  const iconTone = {
    default: "bg-brand-navy/10 text-brand-navy dark:text-primary",
    success: "bg-emerald-500/10 text-emerald-700 dark:text-emerald-400",
    warning: "bg-amber-500/10 text-amber-700 dark:text-amber-400",
    danger: "bg-destructive/10 text-destructive",
    muted: "bg-muted text-muted-foreground",
  }[tone]

  return (
    <Card size="sm" className="border-border py-4 shadow-xs">
      <CardContent className="px-4">
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0">
            <p className="text-xs font-medium tracking-wide text-muted-foreground uppercase">
              {label}
            </p>
            <p
              className={cn(
                "mt-2 font-heading text-2xl font-semibold tracking-tight",
                unavailable && "text-muted-foreground"
              )}
            >
              {value}
            </p>
            {hint ? (
              <p className="mt-1 text-xs text-muted-foreground">{hint}</p>
            ) : null}
          </div>
          <span
            className={cn(
              "flex size-9 shrink-0 items-center justify-center rounded-lg",
              iconTone
            )}
          >
            <Icon className="size-4" aria-hidden />
          </span>
        </div>
      </CardContent>
    </Card>
  )
}

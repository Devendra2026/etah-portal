import type { PerformanceLabel } from "@/types/ward"
import { Badge } from "@workspace/ui/components/badge"
import {
  AlertTriangle,
  CheckCircle2,
  MinusCircle,
  ShieldAlert,
} from "lucide-react"

const CONFIG: Record<
  PerformanceLabel,
  { icon: typeof CheckCircle2; className: string }
> = {
  Excellent: {
    icon: CheckCircle2,
    className:
      "border-transparent bg-emerald-500/10 text-emerald-700 dark:text-emerald-400",
  },
  "On Track": {
    icon: MinusCircle,
    className:
      "border-transparent bg-sky-500/10 text-sky-700 dark:text-sky-400",
  },
  Attention: {
    icon: AlertTriangle,
    className:
      "border-transparent bg-amber-500/10 text-amber-800 dark:text-amber-400",
  },
  Critical: {
    icon: ShieldAlert,
    className: "border-transparent bg-destructive/10 text-destructive",
  },
}

export function StatusBadge({ label }: { label: PerformanceLabel }) {
  const config = CONFIG[label]
  const Icon = config.icon
  return (
    <Badge variant="outline" className={config.className}>
      <Icon aria-hidden />
      {label}
    </Badge>
  )
}

import { Badge } from "@workspace/ui/components/badge"
import {
  AlertTriangle,
  CheckCircle2,
  ClipboardList,
  Clock3,
  RotateCcw,
  ShieldAlert,
} from "lucide-react"

type Tone = {
  label: string
  className: string
  icon: typeof CheckCircle2
}

function toneFor(status: string, surveyStatus?: string, qcStatus?: string | null): Tone {
  const combined = `${status} ${surveyStatus ?? ""} ${qcStatus ?? ""}`.toLowerCase()

  if (combined.includes("reject")) {
    return {
      label: status || "Rejected",
      className: "border-transparent bg-destructive/10 text-destructive",
      icon: ShieldAlert,
    }
  }
  if (combined.includes("approved") || qcStatus === "APPROVED") {
    return {
      label: status || "QC Approved",
      className:
        "border-transparent bg-emerald-500/10 text-emerald-700 dark:text-emerald-400",
      icon: CheckCircle2,
    }
  }
  if (combined.includes("qc pending") || (surveyStatus === "SUBMITTED" && qcStatus === "PENDING")) {
    return {
      label: status || "QC Pending",
      className:
        "border-transparent bg-amber-500/10 text-amber-800 dark:text-amber-400",
      icon: AlertTriangle,
    }
  }
  if (combined.includes("submitted")) {
    return {
      label: status || "Submitted",
      className: "border-transparent bg-sky-500/10 text-sky-700 dark:text-sky-400",
      icon: ClipboardList,
    }
  }
  if (combined.includes("reopen")) {
    return {
      label: status || "Reopened",
      className:
        "border-transparent bg-orange-500/10 text-orange-800 dark:text-orange-400",
      icon: RotateCcw,
    }
  }
  if (combined.includes("progress")) {
    return {
      label: status || "In Progress",
      className: "border-transparent bg-sky-500/10 text-sky-700 dark:text-sky-400",
      icon: Clock3,
    }
  }
  return {
    label: status || "Draft",
    className: "border-transparent bg-muted text-muted-foreground",
    icon: Clock3,
  }
}

export function SurveyStatusBadge({
  status,
  surveyStatus,
  qcStatus,
}: {
  status?: string
  surveyStatus?: string
  qcStatus?: string | null
}) {
  const tone = toneFor(status ?? "", surveyStatus, qcStatus)
  const Icon = tone.icon
  return (
    <Badge variant="outline" className={tone.className}>
      <Icon aria-hidden />
      {tone.label}
    </Badge>
  )
}

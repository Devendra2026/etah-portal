export interface CommandCenterWard {
  wardId: string
  wardName: string
  wardNumber: string
  totalProperties: number
  draft: number
  submitted: number
  qcApproved: number
  completed?: number
  returned?: number
  activeSurveyors: number
}

export type PerformanceLabel =
  | "Excellent"
  | "On Track"
  | "Attention"
  | "Critical"

export interface WardRow extends CommandCenterWard {
  surveyed: number
  pending: number
  surveyCompletionPct: number
  performance: PerformanceLabel
}

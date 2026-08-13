import { TableSkeleton } from "@/components/shared/loading-state"
import { SurveyRegistryView } from "@/components/survey/survey-registry-view"
import { Suspense } from "react"

export default function SurveyRegistryPage() {
  return (
    <Suspense fallback={<TableSkeleton />}>
      <SurveyRegistryView />
    </Suspense>
  )
}

import { ModulePlaceholder } from "@/components/shared/module-placeholder"

export default function SurveyReportPage() {
  return (
    <ModulePlaceholder
      title="Survey Report"
      description="Government reporting for Etah survey operations"
      emptyTitle="Server-side survey reports are not connected in this slice."
      emptyDescription="Use the dashboard and survey registry until the reports API is wired. Local CSV export is available on the ward table."
    />
  )
}

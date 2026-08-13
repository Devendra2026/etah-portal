import { ModulePlaceholder } from "@/components/shared/module-placeholder"

export default function DrainageTaxReportPage() {
  return (
    <ModulePlaceholder
      title="Drainage Tax Report"
      description="Drainage tax assessment and collection reporting"
      emptyTitle="Drainage tax report data is not available."
      emptyDescription="The survey API does not expose drainage tax collection totals."
    />
  )
}

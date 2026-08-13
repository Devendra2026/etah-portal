import { ModulePlaceholder } from "@/components/shared/module-placeholder"

export default function PropertyTaxReportPage() {
  return (
    <ModulePlaceholder
      title="Property Tax Report"
      description="Property tax assessment and collection reporting"
      emptyTitle="Property tax report data is not available."
      emptyDescription="The survey API does not expose property tax collection totals."
    />
  )
}

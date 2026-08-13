import { ModulePlaceholder } from "@/components/shared/module-placeholder"

export default function WaterTaxReportPage() {
  return (
    <ModulePlaceholder
      title="Water Tax Report"
      description="Water tax assessment and collection reporting"
      emptyTitle="Water tax report data is not available."
      emptyDescription="The survey API does not expose water tax collection totals."
    />
  )
}

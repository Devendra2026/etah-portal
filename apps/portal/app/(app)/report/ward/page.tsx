import { ModulePlaceholder } from "@/components/shared/module-placeholder"

export default function WardReportPage() {
  return (
    <ModulePlaceholder
      title="Ward Report"
      description="Ward-level survey and tax reporting for Etah"
      emptyTitle="Ward reports require the reporting API."
      emptyDescription="Export the dashboard ward table as CSV until server-side reports are available."
    />
  )
}

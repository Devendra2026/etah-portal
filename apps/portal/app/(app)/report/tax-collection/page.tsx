import { ModulePlaceholder } from "@/components/shared/module-placeholder"

export default function CollectionReportPage() {
  return (
    <ModulePlaceholder
      title="Collection Report"
      description="Tax collection reporting for Etah Municipal Council"
      emptyTitle="Collection reports require a payment ledger API."
      emptyDescription="Do not treat empty collection figures as zero. No collection data is available yet."
    />
  )
}

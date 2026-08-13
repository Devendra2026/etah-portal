import { ModulePlaceholder } from "@/components/shared/module-placeholder"

export default function TaxCollectionOverviewPage() {
  return (
    <ModulePlaceholder
      title="Tax Collection"
      description="Property, water and drainage collection for Etah Municipal Council"
      emptyTitle="Collection data is not available."
      emptyDescription="Assessment-only mode: the survey API can classify tax, but it does not return collected, outstanding, or month-to-date totals. Those cards stay empty until a ledger API exists."
    />
  )
}

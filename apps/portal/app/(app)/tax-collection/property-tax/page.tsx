import { ModulePlaceholder } from "@/components/shared/module-placeholder"

export default function PropertyTaxPage() {
  return (
    <ModulePlaceholder
      title="Property Tax"
      description="Assessed, collected and outstanding property tax for Etah"
      emptyTitle="Property tax collection totals are not available."
      emptyDescription="Do not treat this as zero collection. The survey service does not provide a payment ledger."
    />
  )
}

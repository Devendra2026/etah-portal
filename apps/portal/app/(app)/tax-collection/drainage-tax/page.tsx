import { ModulePlaceholder } from "@/components/shared/module-placeholder"

export default function DrainageTaxPage() {
  return (
    <ModulePlaceholder
      title="Drainage Tax"
      description="Assessed, collected and outstanding drainage tax for Etah"
      emptyTitle="Drainage tax collection totals are not available."
      emptyDescription="Do not treat this as zero collection. The survey service does not provide a payment ledger."
    />
  )
}

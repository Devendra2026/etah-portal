import { ModulePlaceholder } from "@/components/shared/module-placeholder"

export default function WaterTaxPage() {
  return (
    <ModulePlaceholder
      title="Water Tax"
      description="Assessed, collected and outstanding water tax for Etah"
      emptyTitle="Water tax collection totals are not available."
      emptyDescription="Do not treat this as zero collection. The survey service does not provide a payment ledger."
    />
  )
}

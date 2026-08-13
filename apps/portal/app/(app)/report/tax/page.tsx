import { ModulePlaceholder } from "@/components/shared/module-placeholder"

export default function TaxReportPage() {
  return (
    <ModulePlaceholder
      title="Tax Report"
      description="Property, water and drainage tax reporting"
      emptyTitle="Tax reports are not generated locally."
      emptyDescription="The survey API does not yet provide assessed or collected tax aggregates for Etah."
    />
  )
}

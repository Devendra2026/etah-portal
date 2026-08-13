import { PageHeader } from "@/components/layout/page-header"
import { EmptyState } from "@/components/shared/empty-state"

export function TransactionsView() {
  return (
    <div>
      <PageHeader
        title="Transactions"
        description="Offline and online receipts for Etah Municipal Council."
      />
      <EmptyState
        title="Transaction history is not available on this portal."
        description="The survey API does not expose a payment ledger or cash-desk receipts. View collections on the municipal payment portal."
      />
    </div>
  )
}

import { PageHeader } from "@/components/layout/page-header"
import { EmptyState } from "@/components/shared/empty-state"

export function ModulePlaceholder({
  title,
  description,
  emptyTitle,
  emptyDescription,
}: {
  title: string
  description: string
  emptyTitle: string
  emptyDescription: string
}) {
  return (
    <div>
      <PageHeader title={title} description={description} />
      <EmptyState title={emptyTitle} description={emptyDescription} />
    </div>
  )
}

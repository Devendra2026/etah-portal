import { Button } from "@workspace/ui/components/button"
import { cn } from "@workspace/ui/lib/utils"

export function EmptyState({
  title,
  description,
  actionLabel,
  onAction,
  className,
}: {
  title: string
  description?: string
  actionLabel?: string
  onAction?: () => void
  className?: string
}) {
  return (
    <div
      className={cn(
        "flex flex-col items-start gap-2 rounded-xl border border-border bg-card p-6",
        className
      )}
    >
      <p className="text-sm font-medium text-foreground">{title}</p>
      {description ? (
        <p className="text-sm text-muted-foreground">{description}</p>
      ) : null}
      {actionLabel && onAction ? (
        <Button
          type="button"
          variant="outline"
          className="mt-2 cursor-pointer"
          onClick={onAction}
        >
          {actionLabel}
        </Button>
      ) : null}
    </div>
  )
}

export function ErrorState({
  title,
  description,
  onRetry,
  className,
}: {
  title: string
  description?: string
  onRetry?: () => void
  className?: string
}) {
  return (
    <div
      className={cn(
        "flex flex-col items-start gap-2 rounded-xl border border-destructive/20 bg-card p-6",
        className
      )}
      role="alert"
    >
      <p className="text-sm font-medium text-foreground">{title}</p>
      {description ? (
        <p className="text-sm text-muted-foreground">{description}</p>
      ) : null}
      {onRetry ? (
        <Button
          type="button"
          variant="outline"
          className="mt-2 cursor-pointer"
          onClick={onRetry}
        >
          Retry
        </Button>
      ) : null}
    </div>
  )
}

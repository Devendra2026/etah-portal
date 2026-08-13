import { displayValue } from "@/lib/format"
import { cn } from "@workspace/ui/lib/utils"

export interface FieldItem {
  label: string
  value: string | number | null | undefined
}

export function FieldGrid({
  items,
  uppercaseLabels = false,
}: {
  items: FieldItem[]
  uppercaseLabels?: boolean
}) {
  return (
    <dl className="grid grid-cols-1 gap-x-6 gap-y-3 sm:grid-cols-2 lg:grid-cols-3">
      {items.map((item) => (
        <div key={item.label} className="min-w-0">
          <dt
            className={cn(
              "text-xs text-muted-foreground",
              uppercaseLabels && "font-medium tracking-wide uppercase"
            )}
          >
            {item.label}
          </dt>
          <dd className="mt-0.5 text-sm font-medium break-words">
            {displayValue(item.value)}
          </dd>
        </div>
      ))}
    </dl>
  )
}

import { PageHeader } from "@/components/layout/page-header"

export default function SettingsPage() {
  return (
    <div>
      <PageHeader
        title="Settings"
        description="Etah Portal preferences. Authentication is managed by Clerk."
      />
      <div className="rounded-xl border border-border bg-card p-6 text-sm text-muted-foreground">
        District scope is locked to Etah Municipal Council. User roles and
        permissions come from the survey API profile. Theme can be toggled from
        the header.
      </div>
    </div>
  )
}

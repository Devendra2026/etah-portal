import { PageHeader } from "@/components/layout/page-header"
import { ReportExportPanel } from "@/components/report/report-export-panel"

export function SurveyExcelView() {
  return (
    <div>
      <PageHeader
        title="Survey Excel"
        description="Ward-level Excel templates from the survey service. A ward is required."
      />
      <ReportExportPanel
        title="Survey data Excel"
        description="Export all matching surveys for one ward (no tax columns)."
        reportType="survey_data"
        format="xlsx"
        requireWard
        enableAutoFilter
      />
      <ReportExportPanel
        title="QC final Excel"
        description="Export QC-approved surveys for one ward with published tax rates."
        reportType="qc_final"
        format="xlsx"
        requireWard
        enableAutoFilter
      />
    </div>
  )
}

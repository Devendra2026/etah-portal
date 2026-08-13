"use client"

import { EmptyState, ErrorState } from "@/components/shared/empty-state"
import { PanelSkeleton } from "@/components/shared/loading-state"
import { isApiError } from "@/lib/api/client"
import { getEtahDemandNotice } from "@/lib/api/demand-notices"
import { formatInrExact, formatNumber } from "@/lib/format"
import type { DemandNoticeDocument } from "@/types/demand-notice"
import { useQuery } from "@tanstack/react-query"
import { Button } from "@workspace/ui/components/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@workspace/ui/components/card"
import { Printer } from "lucide-react"

export function DemandNoticePanel({ surveyId }: { surveyId: string }) {
  const demand = useQuery({
    queryKey: ["etah", "demand-notice", surveyId],
    queryFn: () => getEtahDemandNotice(surveyId),
    enabled: Boolean(surveyId),
    retry: false,
  })

  if (demand.isLoading) {
    return <PanelSkeleton />
  }

  if (demand.isError) {
    const status = isApiError(demand.error) ? demand.error.status : 0
    if (status === 403) {
      return (
        <EmptyState
          title="You do not have permission to view demand notices."
          description="Demand assessment requires report access on the survey service."
        />
      )
    }
    if (status === 404) {
      return (
        <EmptyState
          title="Demand notice is available after QC approval."
          description="Assessed property, water, and drainage tax appear here once this survey is QC approved."
        />
      )
    }
    return (
      <ErrorState
        title="Unable to load demand notice."
        description="The survey service did not return tax assessment for this property."
        onRetry={() => void demand.refetch()}
      />
    )
  }

  const document = demand.data
  if (!document) {
    return (
      <EmptyState
        title="Demand notice is available after QC approval."
        description="No assessment document was returned for this survey."
      />
    )
  }

  return (
    <div className="space-y-4">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between print:hidden">
        <p className="text-sm text-muted-foreground">
          Assessment only. Payment is completed on the municipal payment portal.
        </p>
        <Button
          type="button"
          variant="outline"
          className="cursor-pointer"
          onClick={() => window.print()}
        >
          <Printer />
          Print demand notice
        </Button>
      </div>
      <DemandTotals document={document} />
      <DemandPrintDocument document={document} />
    </div>
  )
}

function DemandTotals({ document }: { document: DemandNoticeDocument }) {
  const { assessment } = document
  if (assessment.rateMissing) {
    return (
      <EmptyState
        title="Tax rates are not published for this assessment."
        description={
          assessment.rateMissingReason ??
          "Demand amounts are withheld until a published tax config exists. This is not zero tax."
        }
      />
    )
  }

  const tiles = [
    { label: "Property Tax", value: assessment.propertyTax },
    { label: "Water Tax", value: assessment.waterTax },
    { label: "Drainage Tax", value: assessment.drainageTax },
    { label: "Total annual demand", value: assessment.totalAnnualDemand },
  ]

  return (
    <div className="grid grid-cols-2 gap-3 lg:grid-cols-4 print:hidden">
      {tiles.map((tile) => (
        <div
          key={tile.label}
          className="rounded-xl border border-border bg-card p-4"
        >
          <p className="text-xs text-muted-foreground">{tile.label}</p>
          <p className="mt-2 font-heading text-xl font-semibold tabular-nums">
            {formatInrExact(tile.value)}
          </p>
        </div>
      ))}
    </div>
  )
}

function DemandPrintDocument({ document }: { document: DemandNoticeDocument }) {
  const { assessment, office } = document

  return (
    <Card
      id="demand-notice-print"
      className="border-border shadow-xs print:border-0 print:shadow-none print:ring-0"
    >
      <CardHeader className="border-b">
        <CardTitle>{office.headerLine1 || office.ulbName}</CardTitle>
        <CardDescription>
          {office.headerLine2 ||
            `${office.districtName} · Demand notice ${document.assessmentYearLabel}`}
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-5 pt-4">
        <dl className="grid grid-cols-1 gap-3 sm:grid-cols-2">
          <PrintField label="Property ID" value={document.propertyId} />
          <PrintField label="Owner" value={document.ownerName} />
          <PrintField label="Father / Husband" value={document.fatherName} />
          <PrintField label="Mobile" value={document.mobileNo} />
          <PrintField label="Ward" value={document.wardLabel} />
          <PrintField label="Parcel" value={document.gisParcel} />
          <PrintField label="Address" value={document.address} />
          <PrintField label="Assessment year" value={document.assessmentYearLabel} />
          <PrintField label="Notice date" value={document.noticeDate} />
          <PrintField label="Property use" value={document.propertyUseLabel} />
        </dl>

        {assessment.rateMissing ? (
          <p className="text-sm text-muted-foreground">
            {assessment.rateMissingReason ??
              "Published tax rates are missing, so demand amounts are not shown."}
          </p>
        ) : (
          <div className="overflow-x-auto rounded-lg border border-border">
            <table className="w-full text-sm">
              <thead className="bg-muted/50 text-left">
                <tr>
                  <th className="px-3 py-2 font-medium">Tax</th>
                  <th className="px-3 py-2 text-right font-medium">Amount</th>
                </tr>
              </thead>
              <tbody>
                <TaxRow label="Property Tax" amount={assessment.propertyTax} />
                <TaxRow label="Water Tax" amount={assessment.waterTax} />
                <TaxRow label="Drainage Tax" amount={assessment.drainageTax} />
                {assessment.penalty > 0 ? (
                  <TaxRow label="Penalty" amount={assessment.penalty} />
                ) : null}
                <tr className="border-t font-semibold">
                  <td className="px-3 py-2">Total annual demand</td>
                  <td className="px-3 py-2 text-right tabular-nums">
                    {formatInrExact(assessment.totalAnnualDemand)}
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        )}

        {assessment.floorRows.length > 0 ? (
          <div className="overflow-x-auto rounded-lg border border-border">
            <table className="w-full text-sm">
              <thead className="bg-muted/50 text-left">
                <tr>
                  <th className="px-3 py-2 font-medium">Floor</th>
                  <th className="px-3 py-2 font-medium">Usage</th>
                  <th className="px-3 py-2 text-right font-medium">Area (sq ft)</th>
                  <th className="px-3 py-2 text-right font-medium">Tax</th>
                </tr>
              </thead>
              <tbody>
                {assessment.floorRows.map((row) => (
                  <tr key={row.sno} className="border-t">
                    <td className="px-3 py-2">{row.floorLabel}</td>
                    <td className="px-3 py-2">{row.usageTypeLabel}</td>
                    <td className="px-3 py-2 text-right tabular-nums">
                      {formatNumber(row.areaSqFt)}
                    </td>
                    <td className="px-3 py-2 text-right tabular-nums">
                      {formatInrExact(row.tax)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : null}

        <div className="space-y-2 text-xs text-muted-foreground">
          <p>{document.legalEnglish}</p>
          <p>{document.legalHindi}</p>
        </div>
      </CardContent>
    </Card>
  )
}

function PrintField({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <dt className="text-xs text-muted-foreground">{label}</dt>
      <dd className="mt-0.5 text-sm font-medium">{value || "—"}</dd>
    </div>
  )
}

function TaxRow({ label, amount }: { label: string; amount: number }) {
  return (
    <tr className="border-t">
      <td className="px-3 py-2">{label}</td>
      <td className="px-3 py-2 text-right tabular-nums">{formatInrExact(amount)}</td>
    </tr>
  )
}

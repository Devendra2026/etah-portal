"use client"

import { EmptyState, ErrorState } from "@/components/shared/empty-state"
import { PanelSkeleton, TableSkeleton } from "@/components/shared/loading-state"
import { SurveyStatusBadge } from "@/components/shared/survey-status-badge"
import { DemandNoticePanel } from "@/components/survey/demand-notice-panel"
import { FieldGrid } from "@/components/survey/field-grid"
import { getEtahSurveyDetails } from "@/lib/api/survey"
import { displayValue, formatDateTime } from "@/lib/format"
import type { SurveyDetails } from "@/types/survey"
import { useQuery } from "@tanstack/react-query"
import type { ReactNode } from "react"
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@workspace/ui/components/breadcrumb"
import { Button } from "@workspace/ui/components/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@workspace/ui/components/card"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@workspace/ui/components/table"
import { ArrowLeft } from "lucide-react"
import Link from "next/link"
import { useParams, useRouter } from "next/navigation"

export function SurveyDetailView() {
  const params = useParams<{ id: string }>()
  const router = useRouter()
  const id = decodeURIComponent(params.id ?? "")

  const survey = useQuery({
    queryKey: ["etah", "survey-detail", id],
    queryFn: () => getEtahSurveyDetails(id),
    enabled: Boolean(id),
  })

  if (!id) {
    return (
      <EmptyState
        title="Survey not found"
        description="This property link is missing a survey identifier."
      />
    )
  }

  if (survey.isError) {
    return (
      <ErrorState
        title="Unable to load property survey."
        description="The survey service did not return this Etah property."
        onRetry={() => void survey.refetch()}
      />
    )
  }

  if (survey.isLoading || !survey.data) {
    return (
      <div className="space-y-5">
        <PanelSkeleton />
        <TableSkeleton />
      </div>
    )
  }

  const details = survey.data

  return (
    <div className="space-y-6">
      <div className="print:hidden space-y-4">
        <Breadcrumb>
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbLink render={<Link href="/survey/properties" />}>
                Survey Registry
              </BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbPage>Survey View</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>

        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <Button
            type="button"
            variant="outline"
            className="cursor-pointer"
            onClick={() => router.push("/survey/properties")}
          >
            <ArrowLeft />
            Back
          </Button>
          <h1 className="font-heading text-center text-xl font-semibold tracking-wide uppercase sm:flex-1">
            Survey View
          </h1>
          <div className="flex justify-end">
            <SurveyStatusBadge
              status={details.status}
              surveyStatus={details.surveyStatus}
              qcStatus={details.qcStatus}
            />
          </div>
        </div>

        <dl className="grid grid-cols-2 gap-3 rounded-xl border border-border bg-card p-4 lg:grid-cols-5">
          <SummaryField label="Property ID" value={details.propertyId} />
          <SummaryField label="ULB Name" value={details.ulbName} />
          <SummaryField label="Ward No" value={details.wardNo} />
          <SummaryField label="Parcel No" value={details.parcelNo} />
          <SummaryField label="Owner Name" value={details.ownerName} />
        </dl>
      </div>

      <section className="space-y-4 print:hidden" aria-labelledby="identification-heading">
        <DetailCard
          title="Property identification"
          headingId="identification-heading"
          description="ULB, ward, parcel and generated Property ID."
        >
          <FieldGrid
            uppercaseLabels
            items={[
              { label: "ULB / Local Body", value: details.ulbName },
              { label: "Ward Number", value: details.wardNo },
              { label: "Sector / Zone", value: details.sectorZone },
              { label: "Parcel Number", value: details.parcelNo },
              { label: "Unit / Sub-No", value: details.unitSubNo },
              { label: "Property ID (Old)", value: details.propertyIdOld },
              { label: "Constructed Year", value: details.constructedYear },
              { label: "District", value: details.district },
              { label: "Surveyor", value: details.surveyor },
              { label: "Assessment Year", value: details.assessmentYear },
              { label: "Slum Area", value: details.slumArea },
              { label: "Property ID", value: details.propertyId },
            ]}
          />
        </DetailCard>

        <DetailCard
          title="Owner & household details"
          headingId="owner-heading"
          description="Respondent information and co-owner records."
        >
          <FieldGrid
            uppercaseLabels
            items={[
              { label: "Respondent Name", value: details.respondentName },
              { label: "Mobile Number", value: details.mobileNumber },
              { label: "Father / Husband Name", value: details.fatherHusbandName },
              { label: "Property ID", value: details.propertyId },
              { label: "Relationship", value: details.relationshipWithOwner },
              { label: "Alternate Mobile", value: details.altMobile },
              { label: "Family Size", value: details.familySize },
              { label: "House / Door No.", value: details.houseDoorNo },
              { label: "Colony / Society", value: details.colonySociety },
              { label: "Locality", value: details.localityLandmark },
              { label: "City", value: details.city },
              { label: "PIN Code", value: details.pinCode },
            ]}
          />
          {details.owners.length > 0 ? (
            <div className="mt-4 overflow-x-auto rounded-lg border border-border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Owner</TableHead>
                    <TableHead>Father / Husband</TableHead>
                    <TableHead>Mobile</TableHead>
                    <TableHead>Alternate mobile</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {details.owners.map((owner, index) => (
                    <TableRow key={`${owner.propertyId}-${index}`}>
                      <TableCell>{owner.name || "—"}</TableCell>
                      <TableCell>{owner.fatherHusband || "—"}</TableCell>
                      <TableCell>{owner.mobile || "—"}</TableCell>
                      <TableCell>{owner.altMobile || "—"}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          ) : null}
        </DetailCard>

        <DetailCard
          title="Property details"
          headingId="property-heading"
          description="Use, construction and utility information from the survey."
        >
          <FieldGrid
            uppercaseLabels
            items={[
              { label: "Ownership type", value: details.ownershipType },
              { label: "Property use", value: details.propertyUse },
              { label: "Property type", value: details.propertyType },
              { label: "Situation", value: details.situation },
              { label: "Road type", value: details.roadType },
              { label: "Tax rate zone", value: details.taxRateZone },
              { label: "Plot area", value: details.plotArea },
              { label: "Plinth area", value: details.plinthArea },
              { label: "Built-up area", value: details.builtUpArea },
              { label: "Water connection", value: details.waterConnection },
              { label: "Source of water", value: details.sourceOfWater },
              { label: "Sanitation", value: details.sanitationType },
              { label: "Door-to-door collection", value: details.doorToDoorCollection },
              { label: "Electricity consumer no.", value: details.electricityConsumerNo },
              { label: "Coordinates", value: details.coordinates },
            ]}
          />
          {details.floors.length > 0 ? (
            <div className="mt-4 overflow-x-auto rounded-lg border border-border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>S.No</TableHead>
                    <TableHead>Floor</TableHead>
                    <TableHead>Usage</TableHead>
                    <TableHead>Construction</TableHead>
                    <TableHead>Area</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {details.floors.map((floor) => (
                    <TableRow key={floor.sNo}>
                      <TableCell>{floor.sNo}</TableCell>
                      <TableCell>{floor.floor}</TableCell>
                      <TableCell>{floor.usageType}</TableCell>
                      <TableCell>{floor.construction}</TableCell>
                      <TableCell>{floor.area}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          ) : null}
        </DetailCard>

        {details.photos.length > 0 ? (
          <DetailCard title="Survey photos" headingId="photos-heading">
            <ul className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
              {details.photos.map((photo) => (
                <li
                  key={photo.id}
                  className="overflow-hidden rounded-lg border border-border"
                >
                  {/* eslint-disable-next-line @next/next/no-img-element -- survey photo hosts are tenant-specific */}
                  <img
                    src={photo.url}
                    alt={photo.label || photo.photoType}
                    className="aspect-video w-full object-cover"
                  />
                  <div className="px-3 py-2">
                    <p className="text-sm font-medium">{photo.label}</p>
                    <p className="text-xs text-muted-foreground">
                      {photo.surveyorName}
                      {photo.capturedAt
                        ? ` · ${formatDateTime(photo.capturedAt)}`
                        : ""}
                    </p>
                  </div>
                </li>
              ))}
            </ul>
          </DetailCard>
        ) : null}

        {hasQc(details) ? (
          <DetailCard title="QC remarks" headingId="qc-heading">
            {details.qcRemarkItems.length > 0 ? (
              <ul className="space-y-3">
                {details.qcRemarkItems.map((item) => (
                  <li key={item.id} className="rounded-lg border border-border p-3">
                    <p className="text-sm">{item.body}</p>
                    <p className="mt-1 text-xs text-muted-foreground">
                      {item.author} · {formatDateTime(item.createdAt)}
                    </p>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-sm">{details.qcRemarks}</p>
            )}
          </DetailCard>
        ) : null}
      </section>

      <section aria-labelledby="demand-heading" className="space-y-3">
        <h2
          id="demand-heading"
          className="font-heading text-lg font-semibold print:hidden"
        >
          Tax assessment
        </h2>
        <DemandNoticePanel surveyId={details.id} />
      </section>
    </div>
  )
}

function DetailCard({
  title,
  headingId,
  description,
  children,
}: {
  title: string
  headingId: string
  description?: string
  children: ReactNode
}) {
  return (
    <Card className="border-border shadow-xs">
      <CardHeader>
        <CardTitle id={headingId}>{title}</CardTitle>
        {description ? <CardDescription>{description}</CardDescription> : null}
      </CardHeader>
      <CardContent>{children}</CardContent>
    </Card>
  )
}

function SummaryField({
  label,
  value,
}: {
  label: string
  value: string | number | null | undefined
}) {
  return (
    <div className="min-w-0">
      <dt className="text-[11px] font-medium tracking-wide text-muted-foreground uppercase">
        {label}
      </dt>
      <dd className="mt-0.5 truncate text-sm font-semibold">
        {displayValue(value)}
      </dd>
    </div>
  )
}

function hasQc(details: SurveyDetails): boolean {
  return Boolean(details.qcRemarks) || details.qcRemarkItems.length > 0
}

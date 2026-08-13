import { apiGetPaginated } from "@/lib/api/client"
import { DISTRICT_NAME, PREFERRED_ULB_TYPE, ULB_NAME_HINTS } from "@/lib/env"
import type { EtahScope, GeoDistrict, GeoUlb } from "@/types/geography"

function matchesDistrict(district: GeoDistrict): boolean {
  return district.name.trim().toLowerCase() === DISTRICT_NAME.toLowerCase()
}

function isMunicipalCouncil(ulb: GeoUlb): boolean {
  const type = ulb.type.toUpperCase()
  const name = ulb.name.toLowerCase()
  const hinted = ULB_NAME_HINTS.some((hint) => name.includes(hint))
  return type === PREFERRED_ULB_TYPE || hinted
}

export async function resolveEtahScope(): Promise<EtahScope> {
  const districts = await apiGetPaginated<GeoDistrict>("/districts", {
    search: DISTRICT_NAME,
    limit: 100,
    page: 1,
  })

  const district =
    districts.items.find(matchesDistrict) ??
    districts.items.find((item) =>
      item.name.toLowerCase().includes(DISTRICT_NAME.toLowerCase())
    )

  if (!district) {
    throw new Error("Etah district was not found in geography data.")
  }

  if (
    !matchesDistrict(district) &&
    !district.name.toLowerCase().includes("etah")
  ) {
    throw new Error("Geography lookup returned a district outside Etah.")
  }

  const ulbs = await apiGetPaginated<GeoUlb>("/ulbs", {
    districtId: district.id,
    limit: 100,
    page: 1,
  })

  const inDistrict = ulbs.items.filter((ulb) => ulb.districtId === district.id)
  const municipal = inDistrict.filter(isMunicipalCouncil)
  const namedEtah = municipal.find((ulb) =>
    ulb.name.toLowerCase().includes("etah")
  )
  const ulb =
    namedEtah ??
    municipal[0] ??
    inDistrict.find((item) => item.name.toLowerCase().includes("etah"))

  if (!ulb) {
    throw new Error(
      "Etah Municipal Council was not found for the Etah district."
    )
  }

  if (ulb.districtId !== district.id) {
    throw new Error("Resolved ULB does not belong to Etah.")
  }

  return {
    districtId: district.id,
    districtName: district.name,
    ulbId: ulb.id,
    ulbName: ulb.name,
    ulbType: ulb.type,
  }
}

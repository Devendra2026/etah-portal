import { apiGetPaginated } from "@/lib/api/client"
import type { GeoDistrict, GeoUlb, GeoWard } from "@/types/geography"

export async function getDistricts(search?: string) {
  return apiGetPaginated<GeoDistrict>("/districts", {
    search,
    limit: 100,
    page: 1,
  })
}

export async function getUlbs(districtId: string) {
  return apiGetPaginated<GeoUlb>("/ulbs", { districtId, limit: 100, page: 1 })
}

export async function getWards(ulbId: string) {
  return apiGetPaginated<GeoWard>("/wards", { ulbId, limit: 100, page: 1 })
}

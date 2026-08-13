export interface GeoDistrict {
  id: string
  name: string
  code: string
  stateId: string
}

export interface GeoUlb {
  id: string
  name: string
  code: string
  districtId: string
  type: string
}

export interface GeoWard {
  id: string
  wardNumber: string
  wardName: string
  ulbId: string
}

export interface EtahScope {
  districtId: string
  districtName: string
  ulbId: string
  ulbName: string
  ulbType: string
}

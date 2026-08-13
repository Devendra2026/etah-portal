import { getApiBaseUrl } from "@/lib/env"

export interface ApiResponse<T> {
  success: boolean
  message: string
  data: T | null
  errors: unknown[] | null
  timestamp?: string
  path?: string
  statusCode?: number
}

export interface PaginatedMeta {
  total: number
  page: number
  limit: number
  totalPages: number
}

export interface PaginatedResult<T> {
  items: T[]
  meta: PaginatedMeta
}

export class ApiError extends Error {
  readonly status: number
  readonly path?: string

  constructor(message: string, status: number, path?: string) {
    super(message)
    this.name = "ApiError"
    this.status = status
    this.path = path
  }
}

type TokenGetter = () => Promise<string | null>

let tokenGetter: TokenGetter | null = null

export function setApiTokenGetter(getter: TokenGetter): void {
  tokenGetter = getter
}

function toQuery(
  params?: Record<string, string | number | undefined> | object
): string {
  if (!params) return ""
  const search = new URLSearchParams()
  for (const [key, value] of Object.entries(params)) {
    if (value === undefined || value === "" || value === "any") continue
    search.set(key, String(value))
  }
  const qs = search.toString()
  return qs ? `?${qs}` : ""
}

async function request<T>(path: string, init?: RequestInit): Promise<T> {
  const headers = new Headers(init?.headers)
  if (!headers.has("Content-Type")) {
    headers.set("Content-Type", "application/json")
  }

  const token = tokenGetter ? await tokenGetter() : null
  if (token) {
    headers.set("Authorization", `Bearer ${token}`)
  }

  const url = `${getApiBaseUrl()}${path}`
  let response: Response
  try {
    response = await fetch(url, { ...init, headers, cache: "no-store" })
  } catch {
    throw new ApiError(
      `Unable to reach the survey service at ${getApiBaseUrl()}.`,
      0,
      path
    )
  }

  let body: ApiResponse<T> | null = null
  try {
    body = (await response.json()) as ApiResponse<T>
  } catch {
    body = null
  }

  if (!response.ok) {
    throw new ApiError(
      body?.message || `Request failed (${response.status})`,
      response.status,
      path
    )
  }

  if (body && body.success === false) {
    throw new ApiError(body.message || "Request failed", response.status, path)
  }

  if (body && "data" in body) {
    return body.data as T
  }

  return body as T
}

export async function apiGet<T>(
  path: string,
  params?: Record<string, string | number | undefined> | object
): Promise<T> {
  return request<T>(`${path}${toQuery(params)}`)
}

export async function apiGetPaginated<T>(
  path: string,
  params?: Record<string, string | number | undefined> | object
): Promise<PaginatedResult<T>> {
  return apiGet<PaginatedResult<T>>(path, params)
}

export async function apiPost<T>(path: string, body?: unknown): Promise<T> {
  return request<T>(path, {
    method: "POST",
    body: body === undefined ? undefined : JSON.stringify(body),
  })
}

export function isApiError(error: unknown): error is ApiError {
  return error instanceof ApiError
}

function filenameFromDisposition(
  header: string | null,
  fallback: string
): string {
  if (!header) return fallback
  const utf = /filename\*=UTF-8''([^;]+)/i.exec(header)
  if (utf?.[1]) return decodeURIComponent(utf[1])
  const simple = /filename="?([^";]+)"?/i.exec(header)
  if (simple?.[1]) return simple[1]
  return fallback
}

export async function apiDownload(
  path: string,
  params?: Record<string, string | number | undefined> | object
): Promise<{ blob: Blob; filename: string }> {
  const headers = new Headers()
  const token = tokenGetter ? await tokenGetter() : null
  if (token) {
    headers.set("Authorization", `Bearer ${token}`)
  }

  const url = `${getApiBaseUrl()}${path}${toQuery(params)}`
  let response: Response
  try {
    response = await fetch(url, { headers, cache: "no-store" })
  } catch {
    throw new ApiError(
      `Unable to reach the survey service at ${getApiBaseUrl()}.`,
      0,
      path
    )
  }

  if (!response.ok) {
    let message = `Download failed (${response.status})`
    try {
      const body = (await response.json()) as ApiResponse<unknown>
      if (body?.message) message = body.message
    } catch {
      // Binary error bodies are ignored; status message is enough.
    }
    throw new ApiError(message, response.status, path)
  }

  const blob = await response.blob()
  const filename = filenameFromDisposition(
    response.headers.get("Content-Disposition"),
    "download.bin"
  )
  return { blob, filename }
}

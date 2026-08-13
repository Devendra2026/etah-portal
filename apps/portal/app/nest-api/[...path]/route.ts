import { getNestApiOrigin, productionApiBlockedFromLocal } from "@/lib/env"
import { auth } from "@clerk/nextjs/server"
import { type NextRequest, NextResponse } from "next/server"

export const dynamic = "force-dynamic"

const HOP_BY_HOP = new Set([
  "connection",
  "keep-alive",
  "proxy-authenticate",
  "proxy-authorization",
  "te",
  "trailers",
  "transfer-encoding",
  "upgrade",
  "host",
  "content-length",
])

async function proxyNest(
  request: NextRequest,
  path: string[]
): Promise<Response> {
  const { isAuthenticated } = await auth()
  if (!isAuthenticated) {
    return NextResponse.json(
      {
        success: false,
        message: "Unauthorized",
        data: null,
        errors: null,
      },
      { status: 401 }
    )
  }

  const origin = getNestApiOrigin()
  if (productionApiBlockedFromLocal(origin, request.nextUrl.hostname)) {
    return NextResponse.json(
      {
        success: false,
        message:
          "Production survey API (backend.sdvedutech.in) cannot be used from localhost. Run api-survey-apps locally on port 4000 and set NEST_API_ORIGIN=http://localhost:4000. Portal Clerk keys are for nppetah.in.",
        data: null,
        errors: null,
      },
      { status: 409 }
    )
  }

  const target = `${origin}/${path.join("/")}${request.nextUrl.search}`

  const headers = new Headers()
  request.headers.forEach((value, key) => {
    if (!HOP_BY_HOP.has(key.toLowerCase())) {
      headers.set(key, value)
    }
  })
  headers.delete("origin")
  headers.delete("referer")
  headers.delete("cookie")

  const method = request.method
  const hasBody = method !== "GET" && method !== "HEAD"
  const body = hasBody ? await request.arrayBuffer() : undefined

  let upstream: Response
  try {
    upstream = await fetch(target, {
      method,
      headers,
      body,
      cache: "no-store",
      redirect: "manual",
    })
  } catch {
    return NextResponse.json(
      {
        success: false,
        message: `Unable to reach the survey API at ${origin}.`,
        data: null,
        errors: null,
      },
      { status: 502 }
    )
  }

  const responseHeaders = new Headers()
  upstream.headers.forEach((value, key) => {
    if (!HOP_BY_HOP.has(key.toLowerCase())) {
      responseHeaders.set(key, value)
    }
  })

  return new Response(upstream.body, {
    status: upstream.status,
    statusText: upstream.statusText,
    headers: responseHeaders,
  })
}

type RouteContext = { params: Promise<{ path: string[] }> }

export async function GET(request: NextRequest, context: RouteContext) {
  const { path } = await context.params
  return proxyNest(request, path)
}

export async function POST(request: NextRequest, context: RouteContext) {
  const { path } = await context.params
  return proxyNest(request, path)
}

export async function PUT(request: NextRequest, context: RouteContext) {
  const { path } = await context.params
  return proxyNest(request, path)
}

export async function PATCH(request: NextRequest, context: RouteContext) {
  const { path } = await context.params
  return proxyNest(request, path)
}

export async function DELETE(request: NextRequest, context: RouteContext) {
  const { path } = await context.params
  return proxyNest(request, path)
}

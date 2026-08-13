import { clerkSatelliteOptions, isClerkSatellite } from "@/lib/clerk-runtime"
import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server"
import { NextResponse } from "next/server"

const isPublicRoute = createRouteMatcher([
  "/sign-in(.*)",
  "/sign-up(.*)",
  "/__clerk(.*)",
])
const isAuthRoute = createRouteMatcher(["/sign-in(.*)", "/sign-up(.*)"])

const satelliteOptions = isClerkSatellite() ? clerkSatelliteOptions() : {}

export default clerkMiddleware(async (auth, req) => {
  const { isAuthenticated } = await auth()
  const pathname = req.nextUrl.pathname

  if (pathname === "/") {
    if (isAuthenticated) {
      return NextResponse.redirect(new URL("/dashboard", req.url))
    }
    const signIn = isClerkSatellite()
      ? clerkSatelliteOptions().signInUrl
      : "/sign-in"
    return NextResponse.redirect(new URL(signIn, req.url))
  }

  if (isAuthenticated && isAuthRoute(req)) {
    return NextResponse.redirect(new URL("/dashboard", req.url))
  }

  if (!isPublicRoute(req)) {
    await auth.protect()
  }
}, satelliteOptions)

export const config = {
  matcher: [
    "/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)",
    "/__clerk/(.*)",
    "/(api|trpc)(.*)",
  ],
}

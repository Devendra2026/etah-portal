import { getPortalOrigin } from "@/lib/clerk-env"
import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server"
import { NextResponse } from "next/server"

const isPublicRoute = createRouteMatcher([
  "/sign-in(.*)",
  "/sign-up(.*)",
  "/__clerk(.*)",
])
const isAuthRoute = createRouteMatcher(["/sign-in(.*)", "/sign-up(.*)"])
const isNestApi = createRouteMatcher(["/nest-api(.*)"])

export default clerkMiddleware(
  async (auth, req) => {
    const { isAuthenticated } = await auth()
    const pathname = req.nextUrl.pathname

    if (pathname === "/") {
      if (isAuthenticated) {
        return NextResponse.redirect(new URL("/dashboard", req.url))
      }
      return NextResponse.redirect(new URL("/sign-in", req.url))
    }

    if (isAuthenticated && isAuthRoute(req)) {
      return NextResponse.redirect(new URL("/dashboard", req.url))
    }

    if (isNestApi(req)) {
      return
    }

    if (!isPublicRoute(req)) {
      await auth.protect()
    }
  },
  {
    authorizedParties: [getPortalOrigin()],
    signInUrl: "/sign-in",
    signUpUrl: "/sign-up",
  }
)

export const config = {
  matcher: [
    "/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)",
    "/__clerk/(.*)",
    "/(api|trpc)(.*)",
  ],
}

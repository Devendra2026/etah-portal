import { AppProviders } from "@/components/providers"
import { ThemeProvider } from "@/components/theme-provider"
import { clerkAppearance } from "@/lib/clerk-appearance"
import {
  clerkSatelliteOptions,
  isClerkSatellite,
} from "@/lib/clerk-runtime"
import { ClerkProvider } from "@clerk/nextjs"
import { Toaster } from "@workspace/ui/components/sonner"
import { cn } from "@workspace/ui/lib/utils"
import type { Metadata } from "next"
import { Geist, Geist_Mono, Plus_Jakarta_Sans } from "next/font/google"

import "@workspace/ui/globals.css"

const geist = Geist({ subsets: ["latin"], variable: "--font-sans" })
const jakarta = Plus_Jakarta_Sans({
  subsets: ["latin"],
  variable: "--font-heading",
  weight: ["500", "600", "700"],
})
const fontMono = Geist_Mono({ subsets: ["latin"], variable: "--font-mono" })

export const metadata: Metadata = {
  title: "Etah Portal — Survey, Property & Tax Administration",
  description: "Etah district survey, property and tax administration system",
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={cn(
        "h-full antialiased",
        geist.variable,
        jakarta.variable,
        fontMono.variable,
        "font-sans"
      )}
    >
      <body className="min-h-full">
        <ClerkProvider
          appearance={clerkAppearance}
          {...(isClerkSatellite()
            ? clerkSatelliteOptions()
            : {
                signInUrl: "/sign-in",
                signUpUrl: "/sign-up",
              })}
          signInForceRedirectUrl="/dashboard"
          signUpForceRedirectUrl="/dashboard"
          afterSignOutUrl={
            isClerkSatellite()
              ? clerkSatelliteOptions().signInUrl
              : "/sign-in"
          }
        >
          <ThemeProvider>
            <AppProviders>
              {children}
              <Toaster closeButton position="top-right" />
            </AppProviders>
          </ThemeProvider>
        </ClerkProvider>
      </body>
    </html>
  )
}

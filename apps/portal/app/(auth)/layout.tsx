import { MUNICIPALITY_NAME } from "@/lib/branding"

export const dynamic = "force-dynamic"

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="flex min-h-svh items-center justify-center bg-background px-4">
      <div className="w-full max-w-md">
        <div className="mb-6 text-center">
          {/* eslint-disable-next-line @next/next/no-img-element -- municipal seal is a local SVG asset */}
          <img
            src="/municipal-emblem.svg"
            alt=""
            width={56}
            height={56}
            className="mx-auto mb-3 size-14 rounded-full"
          />
          <p className="font-heading text-lg font-semibold text-foreground">
            {MUNICIPALITY_NAME}
          </p>
          <p className="mt-1 text-sm text-muted-foreground">
            Survey, property and tax administration
          </p>
        </div>
        {children}
      </div>
    </div>
  )
}

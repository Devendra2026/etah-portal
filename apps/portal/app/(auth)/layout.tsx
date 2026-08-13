export default function AuthLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="flex min-h-svh items-center justify-center bg-background">
      <div className="w-full max-w-md">
        <div className="mb-6 text-center">
          <p className="text-2xl font-medium tracking-wide text-muted-foreground uppercase">
            Etah Administration System
          </p>
        </div>
        {children}
      </div>
    </div>
  )
}

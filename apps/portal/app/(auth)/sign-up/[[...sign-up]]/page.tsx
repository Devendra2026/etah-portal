import { clerkAppearance } from "@/lib/clerk-appearance"
import { SignUp } from "@clerk/nextjs"

export const dynamic = "force-dynamic"

export default function SignUpPage() {
  return (
    <SignUp
      appearance={clerkAppearance}
      routing="path"
      path="/sign-up"
      signInUrl="/sign-in"
      fallbackRedirectUrl="/dashboard"
      forceRedirectUrl="/dashboard"
    />
  )
}

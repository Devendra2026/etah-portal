import { clerkAppearance } from "@/lib/clerk-appearance"
import { SignIn } from "@clerk/nextjs"

export const dynamic = "force-dynamic"

export default function SignInPage() {
  return (
    <SignIn
      appearance={clerkAppearance}
      routing="path"
      path="/sign-in"
      signUpUrl="/sign-up"
      fallbackRedirectUrl="/dashboard"
      forceRedirectUrl="/dashboard"
    />
  )
}

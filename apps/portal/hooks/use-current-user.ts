"use client"

import { getCurrentUser } from "@/lib/api/survey"
import type { AuthenticatedProfile } from "@/types/auth"
import { useAuth } from "@clerk/nextjs"
import { useQuery } from "@tanstack/react-query"

export function useCurrentUserProfile() {
  const { isLoaded, isSignedIn } = useAuth()

  return useQuery<AuthenticatedProfile>({
    queryKey: ["users", "me"],
    queryFn: getCurrentUser,
    enabled: isLoaded && Boolean(isSignedIn),
    retry: 1,
  })
}

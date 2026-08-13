"use client"

import { resolveEtahScope } from "@/lib/api/scope"
import type { EtahScope } from "@/types/geography"
import { useAuth } from "@clerk/nextjs"
import { useQuery } from "@tanstack/react-query"

export function useEtahScope() {
  const { isLoaded, isSignedIn } = useAuth()

  return useQuery<EtahScope>({
    queryKey: ["etah", "scope"],
    queryFn: resolveEtahScope,
    enabled: isLoaded && Boolean(isSignedIn),
    staleTime: Infinity,
    retry: 1,
  })
}

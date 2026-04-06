/**
 * Metadata feature — TanStack Query hooks wrapping @pg-atlas/data-sdk.
 *
 * Key convention: ["metadata", action, ...params]
 */
import { useQuery, useSuspenseQuery } from "@tanstack/react-query";
import { getMetadata } from "@pg-atlas/data-sdk";
import { client } from "../client";

export const metadataKeys = {
  all: ["metadata"] as const,
  summary: () => [...metadataKeys.all, "summary"] as const,
};

async function fetchMetadata() {
  const { data } = await getMetadata({ client, throwOnError: true });
  return data;
}

/**
 * Ecosystem summary metrics (/metadata).
 * Use inside a `<Suspense>` boundary — this is blocking data.
 */
export function useMetadataSuspense() {
  return useSuspenseQuery({
    queryKey: metadataKeys.summary(),
    queryFn: fetchMetadata,
  });
}

/**
 * Non-suspending variant for panels that can render without metadata.
 */
export function useMetadata() {
  return useQuery({
    queryKey: metadataKeys.summary(),
    queryFn: fetchMetadata,
  });
}

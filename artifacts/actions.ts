"use server";

import { getSuggestionsByArtifactId } from "@/lib/db/queries";

export async function getSuggestions({ documentId }: { documentId: string }) {
  const suggestions = await getSuggestionsByArtifactId({ documentId });
  return suggestions ?? [];
}

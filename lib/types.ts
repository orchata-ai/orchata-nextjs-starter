import type { InferUITool, ToolUIPart, UIMessage } from "ai";
import { z } from "zod";
import type { ArtifactKind } from "@/components/artifact";
import type { createArtifact } from "./ai/tools/create-document";
import type { getWeather } from "./ai/tools/get-weather";
import type { requestSuggestions } from "./ai/tools/request-suggestions";
import type { updateArtifact } from "./ai/tools/update-document";
import type { Suggestion } from "./db/schema";

export type DataPart = { type: "append-message"; message: string };

export const messageMetadataSchema = z.object({
  createdAt: z.string(),
});

export type MessageMetadata = z.infer<typeof messageMetadataSchema>;

type weatherTool = InferUITool<typeof getWeather>;
type createArtifactTool = InferUITool<ReturnType<typeof createArtifact>>;
type updateArtifactTool = InferUITool<ReturnType<typeof updateArtifact>>;
type requestSuggestionsTool = InferUITool<
  ReturnType<typeof requestSuggestions>
>;

// Orchata Knowledge Base Tools (from SDK)
type OrchataToolBase<TInput, TOutput> = ToolUIPart & {
  input: TInput;
  output: TOutput;
};

type QueryKnowledgeTool = OrchataToolBase<
  { query: string; spaceIds?: string | string[]; limit?: number },
  {
    results?: Array<{
      content: string;
      similarity: number;
      source?: string;
      documentId?: string;
    }>;
    error?: string;
  }
>;

type FindRelevantSpacesTool = OrchataToolBase<
  { query: string; limit?: number },
  {
    spaces?: Array<{
      id: string;
      name: string;
      description?: string;
      relevance?: number;
    }>;
    error?: string;
  }
>;

type ListSpacesTool = OrchataToolBase<
  { page?: string; pageSize?: string; status?: string },
  {
    spaces?: Array<{
      id: string;
      name: string;
      description?: string;
      isArchived?: boolean;
    }>;
    error?: string;
  }
>;

type GetDocumentContentTool = OrchataToolBase<
  { spaceId: string; id?: string; filename?: string },
  {
    content?: string;
    filename?: string;
    documentId?: string;
    error?: string;
  }
>;

type UploadDocumentTool = OrchataToolBase<
  { spaceId: string; content: string; filename?: string },
  {
    success?: boolean;
    documentId?: string;
    filename?: string;
    spaceName?: string;
    error?: string;
  }
>;

type CreateSpaceTool = OrchataToolBase<
  { name: string; description?: string; icon?: string; slug?: string },
  {
    success?: boolean;
    space?: { id: string; name: string; description?: string };
    // Flat format from Orchata SDK
    spaceId?: string;
    name?: string;
    slug?: string;
    error?: string;
  }
>;

type GetSpaceTool = OrchataToolBase<
  { id: string },
  {
    success?: boolean;
    space?: {
      id: string;
      name: string;
      description?: string;
      slug?: string;
      isArchived?: boolean;
    };
    error?: string;
  }
>;

type UpdateSpaceTool = OrchataToolBase<
  { id: string; name?: string; description?: string },
  {
    success?: boolean;
    space?: { id: string; name: string; description?: string };
    error?: string;
  }
>;

type DeleteSpaceTool = OrchataToolBase<
  { id: string },
  {
    success?: boolean;
    message?: string;
    error?: string;
  }
>;

export type ChatTools = {
  getWeather: weatherTool;
  createArtifact: createArtifactTool;
  updateArtifact: updateArtifactTool;
  requestSuggestions: requestSuggestionsTool;
  // Orchata Knowledge Base Tools
  queryKnowledge: QueryKnowledgeTool;
  findRelevantSpaces: FindRelevantSpacesTool;
  listSpaces: ListSpacesTool;
  getDocumentContent: GetDocumentContentTool;
  uploadDocument: UploadDocumentTool;
  createSpace: CreateSpaceTool;
  getSpace: GetSpaceTool;
  updateSpace: UpdateSpaceTool;
  deleteSpace: DeleteSpaceTool;
};

export type CustomUIDataTypes = {
  textDelta: string;
  imageDelta: string;
  sheetDelta: string;
  codeDelta: string;
  suggestion: Suggestion;
  appendMessage: string;
  id: string;
  title: string;
  kind: ArtifactKind;
  clear: null;
  finish: null;
  "chat-title": string;
};

export type ChatMessage = UIMessage<
  MessageMetadata,
  CustomUIDataTypes,
  ChatTools
>;

export type Attachment = {
  name: string;
  url: string;
  contentType: string;
};

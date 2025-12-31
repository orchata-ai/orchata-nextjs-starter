"use client";
import type { UseChatHelpers } from "@ai-sdk/react";
import equal from "fast-deep-equal";
import { Loader2 } from "lucide-react";
import { memo, useState } from "react";
import type { Vote } from "@/lib/db/schema";
import type { ChatMessage } from "@/lib/types";
import { cn, sanitizeText } from "@/lib/utils";
import { useDataStream } from "./data-stream-provider";
import { DocumentToolResult } from "./document";
import { DocumentPreview } from "./document-preview";
import { MessageContent } from "./elements/message";
import { Response } from "./elements/response";
import {
  Tool,
  ToolContent,
  ToolHeader,
  ToolInput,
  ToolOutput,
} from "./elements/tool";
import { SparklesIcon } from "./icons";
import { MessageActions } from "./message-actions";
import { MessageEditor } from "./message-editor";
import { MessageReasoning } from "./message-reasoning";
import {
  CreateSpaceResult,
  DeleteSpaceResult,
  DocumentContentResult,
  QueryKnowledgeResult,
  RelevantSpacesResult,
  SpaceDetailResult,
  SpaceListResult,
  ToolLoading,
  UpdateSpaceResult,
  UploadDocumentResult,
} from "./orchata-tools";
import { PreviewAttachment } from "./preview-attachment";
import { Weather } from "./weather";

const PurePreviewMessage = ({
  addToolApprovalResponse,
  chatId,
  message,
  vote,
  isLoading,
  setMessages,
  regenerate,
  isReadonly,
  requiresScrollPadding: _requiresScrollPadding,
}: {
  addToolApprovalResponse: UseChatHelpers<ChatMessage>["addToolApprovalResponse"];
  chatId: string;
  message: ChatMessage;
  vote: Vote | undefined;
  isLoading: boolean;
  setMessages: UseChatHelpers<ChatMessage>["setMessages"];
  regenerate: UseChatHelpers<ChatMessage>["regenerate"];
  isReadonly: boolean;
  requiresScrollPadding: boolean;
}) => {
  const [mode, setMode] = useState<"view" | "edit">("view");

  const attachmentsFromMessage = message.parts.filter(
    (part) => part.type === "file"
  );

  useDataStream();

  return (
    <div
      className="group/message fade-in w-full animate-in duration-200"
      data-role={message.role}
      data-testid={`message-${message.role}`}
    >
      <div
        className={cn("flex w-full items-start gap-2 md:gap-3", {
          "justify-end": message.role === "user" && mode !== "edit",
          "justify-start": message.role === "assistant",
        })}
      >
        {message.role === "assistant" && (
          <div className="-mt-1 flex size-8 shrink-0 items-center justify-center rounded-full bg-background ring-1 ring-border">
            <SparklesIcon size={14} />
          </div>
        )}

        <div
          className={cn("flex flex-col", {
            "gap-2 md:gap-4":
              message.parts?.some((p) => p.type === "text" && p.text?.trim()) ||
              message.parts?.some((p) => p.type.startsWith("tool-")),
            "w-full":
              (message.role === "assistant" &&
                (message.parts?.some(
                  (p) => p.type === "text" && p.text?.trim()
                ) ||
                  message.parts?.some((p) => p.type.startsWith("tool-")))) ||
              mode === "edit",
            "max-w-[calc(100%-2.5rem)] sm:max-w-[min(fit-content,80%)]":
              message.role === "user" && mode !== "edit",
          })}
        >
          {attachmentsFromMessage.length > 0 && (
            <div
              className="flex flex-row justify-end gap-2"
              data-testid={"message-attachments"}
            >
              {attachmentsFromMessage.map((attachment) => (
                <PreviewAttachment
                  attachment={{
                    name: attachment.filename ?? "file",
                    contentType: attachment.mediaType,
                    url: attachment.url,
                  }}
                  key={attachment.url}
                />
              ))}
            </div>
          )}

          {/* Show "Thinking..." for assistant messages with no visible content yet */}
          {message.role === "assistant" &&
            isLoading &&
            message.parts?.every(
              (p) =>
                (p.type === "text" && (!p.text || p.text.trim() === "")) ||
                p.type === "step-start"
            ) && <ThinkingIndicator />}

          {message.parts?.map((part, index) => {
            const { type } = part;
            const key = `message-${message.id}-part-${index}`;

            if (type === "reasoning" && part.text?.trim().length > 0) {
              return (
                <MessageReasoning
                  isLoading={isLoading}
                  key={key}
                  reasoning={part.text}
                />
              );
            }

            if (type === "text") {
              if (mode === "view") {
                return (
                  <div key={key}>
                    <MessageContent
                      className={cn({
                        "wrap-break-word w-fit rounded px-3 py-2 text-right text-white":
                          message.role === "user",
                        "bg-transparent px-0 py-0 text-left":
                          message.role === "assistant",
                      })}
                      data-testid="message-content"
                      style={
                        message.role === "user"
                          ? { backgroundColor: "#fa8565", color: "black" }
                          : undefined
                      }
                    >
                      <Response>{sanitizeText(part.text)}</Response>
                    </MessageContent>
                  </div>
                );
              }

              if (mode === "edit") {
                return (
                  <div
                    className="flex w-full flex-row items-start gap-3"
                    key={key}
                  >
                    <div className="size-8" />
                    <div className="min-w-0 flex-1">
                      <MessageEditor
                        key={message.id}
                        message={message}
                        regenerate={regenerate}
                        setMessages={setMessages}
                        setMode={setMode}
                      />
                    </div>
                  </div>
                );
              }
            }

            if (type === "tool-getWeather") {
              const { toolCallId, state } = part;
              const approvalId = (part as { approval?: { id: string } })
                .approval?.id;
              const isDenied =
                state === "output-denied" ||
                (state === "approval-responded" &&
                  (part as { approval?: { approved?: boolean } }).approval
                    ?.approved === false);
              const widthClass = "w-[min(100%,450px)]";

              if (state === "output-available") {
                return (
                  <div className={widthClass} key={toolCallId}>
                    <Weather weatherAtLocation={part.output} />
                  </div>
                );
              }

              if (isDenied) {
                return (
                  <div className={widthClass} key={toolCallId}>
                    <Tool className="w-full" defaultOpen={true}>
                      <ToolHeader
                        state="output-denied"
                        type="tool-getWeather"
                      />
                      <ToolContent>
                        <div className="px-4 py-3 text-muted-foreground text-sm">
                          Weather lookup was denied.
                        </div>
                      </ToolContent>
                    </Tool>
                  </div>
                );
              }

              if (state === "approval-responded") {
                return (
                  <div className={widthClass} key={toolCallId}>
                    <Tool className="w-full" defaultOpen={true}>
                      <ToolHeader state={state} type="tool-getWeather" />
                      <ToolContent>
                        <ToolInput input={part.input} />
                      </ToolContent>
                    </Tool>
                  </div>
                );
              }

              return (
                <div className={widthClass} key={toolCallId}>
                  <Tool className="w-full" defaultOpen={true}>
                    <ToolHeader state={state} type="tool-getWeather" />
                    <ToolContent>
                      {(state === "input-available" ||
                        state === "approval-requested") && (
                        <ToolInput input={part.input} />
                      )}
                      {state === "approval-requested" && approvalId && (
                        <div className="flex items-center justify-end gap-2 border-t px-4 py-3">
                          <button
                            className="rounded-md px-3 py-1.5 text-muted-foreground text-sm transition-colors hover:bg-muted hover:text-foreground"
                            onClick={() => {
                              addToolApprovalResponse({
                                id: approvalId,
                                approved: false,
                                reason: "User denied weather lookup",
                              });
                            }}
                            type="button"
                          >
                            Deny
                          </button>
                          <button
                            className="rounded-md bg-primary px-3 py-1.5 text-primary-foreground text-sm transition-colors hover:bg-primary/90"
                            onClick={() => {
                              addToolApprovalResponse({
                                id: approvalId,
                                approved: true,
                              });
                            }}
                            type="button"
                          >
                            Allow
                          </button>
                        </div>
                      )}
                    </ToolContent>
                  </Tool>
                </div>
              );
            }

            if (type === "tool-createArtifact") {
              const { toolCallId } = part;

              if (part.output && "error" in part.output) {
                return (
                  <div
                    className="rounded-lg border border-red-200 bg-red-50 p-4 text-red-500 dark:bg-red-950/50"
                    key={toolCallId}
                  >
                    Error creating document: {String(part.output.error)}
                  </div>
                );
              }

              return (
                <DocumentPreview
                  isReadonly={isReadonly}
                  key={toolCallId}
                  result={part.output}
                />
              );
            }

            if (type === "tool-updateArtifact") {
              const { toolCallId } = part;

              if (part.output && "error" in part.output) {
                return (
                  <div
                    className="rounded-lg border border-red-200 bg-red-50 p-4 text-red-500 dark:bg-red-950/50"
                    key={toolCallId}
                  >
                    Error updating document: {String(part.output.error)}
                  </div>
                );
              }

              return (
                <div className="relative" key={toolCallId}>
                  <DocumentPreview
                    args={{ ...part.output, isUpdate: true }}
                    isReadonly={isReadonly}
                    result={part.output}
                  />
                </div>
              );
            }

            if (type === "tool-requestSuggestions") {
              const { toolCallId, state } = part;

              return (
                <Tool defaultOpen={true} key={toolCallId}>
                  <ToolHeader state={state} type="tool-requestSuggestions" />
                  <ToolContent>
                    {state === "input-available" && (
                      <ToolInput input={part.input} />
                    )}
                    {state === "output-available" && (
                      <ToolOutput
                        errorText={undefined}
                        output={
                          "error" in part.output ? (
                            <div className="rounded border p-2 text-red-500">
                              Error: {String(part.output.error)}
                            </div>
                          ) : (
                            <DocumentToolResult
                              isReadonly={isReadonly}
                              result={part.output}
                              type="request-suggestions"
                            />
                          )
                        }
                      />
                    )}
                  </ToolContent>
                </Tool>
              );
            }

            // Orchata Knowledge Base Tools
            if (type === "tool-queryKnowledge") {
              const { toolCallId, state } = part;

              if (state === "output-available") {
                const output = part.output as {
                  results?: Array<{
                    content: string;
                    similarity: number;
                    source?: string;
                  }>;
                  error?: string;
                };

                return (
                  <QueryKnowledgeResult
                    key={toolCallId}
                    query={(part.input as { query?: string })?.query}
                    results={output?.results ?? []}
                  />
                );
              }

              return (
                <ToolLoading
                  key={toolCallId}
                  title="Searching knowledge base..."
                />
              );
            }

            if (type === "tool-findRelevantSpaces") {
              const { toolCallId, state } = part;

              if (state === "output-available") {
                const output = part.output as {
                  spaces?: Array<{
                    id: string;
                    name: string;
                    description?: string;
                    relevance?: number;
                  }>;
                  error?: string;
                };

                return (
                  <RelevantSpacesResult
                    key={toolCallId}
                    query={(part.input as { query?: string })?.query}
                    spaces={output?.spaces ?? []}
                  />
                );
              }

              return (
                <ToolLoading
                  key={toolCallId}
                  title="Finding relevant spaces..."
                />
              );
            }

            if (type === "tool-listSpaces") {
              const { toolCallId, state } = part;

              if (state === "output-available") {
                const output = part.output as {
                  spaces?: Array<{
                    id: string;
                    name: string;
                    description?: string;
                    isArchived?: boolean;
                  }>;
                  error?: string;
                };

                return (
                  <SpaceListResult
                    key={toolCallId}
                    spaces={output?.spaces ?? []}
                  />
                );
              }

              return <ToolLoading key={toolCallId} title="Loading spaces..." />;
            }

            if (type === "tool-getDocumentContent") {
              const { toolCallId, state } = part;

              if (state === "output-available") {
                const output = part.output as {
                  content?: string;
                  filename?: string;
                  documentId?: string;
                  error?: string;
                };

                return (
                  <DocumentContentResult
                    content={output?.content ?? ""}
                    documentId={output?.documentId}
                    filename={output?.filename}
                    key={toolCallId}
                  />
                );
              }

              return (
                <ToolLoading key={toolCallId} title="Loading document..." />
              );
            }

            if (type === "tool-uploadDocument") {
              const { toolCallId, state } = part;

              if (state === "output-available") {
                const output = part.output as {
                  success?: boolean;
                  documentId?: string;
                  filename?: string;
                  spaceName?: string;
                  error?: string;
                };

                return (
                  <UploadDocumentResult
                    documentId={output?.documentId}
                    error={output?.error}
                    filename={
                      output?.filename ??
                      (part.input as { filename?: string })?.filename
                    }
                    key={toolCallId}
                    spaceName={output?.spaceName}
                    success={output?.success ?? !output?.error}
                  />
                );
              }

              return (
                <ToolLoading key={toolCallId} title="Uploading document..." />
              );
            }

            if (type === "tool-createSpace") {
              const { toolCallId, state } = part;

              if (state === "output-available") {
                const output = part.output as {
                  success?: boolean;
                  space?: {
                    id: string;
                    name: string;
                    description?: string;
                  };
                  // Flat format from Orchata SDK
                  spaceId?: string;
                  name?: string;
                  slug?: string;
                  error?: string;
                };

                return (
                  <CreateSpaceResult
                    error={output?.error}
                    key={toolCallId}
                    name={output?.name}
                    slug={output?.slug}
                    space={output?.space}
                    spaceId={output?.spaceId}
                    success={output?.success ?? !output?.error}
                  />
                );
              }

              return <ToolLoading key={toolCallId} title="Creating space..." />;
            }

            if (type === "tool-getSpace") {
              const { toolCallId, state } = part;

              if (state === "output-available") {
                const output = part.output as {
                  success?: boolean;
                  space?: {
                    id: string;
                    name: string;
                    description?: string;
                    slug?: string;
                    isArchived?: boolean;
                  };
                  error?: string;
                };

                if (output?.space) {
                  return (
                    <SpaceDetailResult key={toolCallId} space={output.space} />
                  );
                }
              }

              return (
                <ToolLoading
                  key={toolCallId}
                  title="Loading space details..."
                />
              );
            }

            if (type === "tool-updateSpace") {
              const { toolCallId, state } = part;

              if (state === "output-available") {
                const output = part.output as {
                  success?: boolean;
                  space?: {
                    id: string;
                    name: string;
                    description?: string;
                  };
                  error?: string;
                };

                return (
                  <UpdateSpaceResult
                    error={output?.error}
                    key={toolCallId}
                    space={output?.space}
                    success={output?.success ?? !output?.error}
                  />
                );
              }

              return <ToolLoading key={toolCallId} title="Updating space..." />;
            }

            if (type === "tool-deleteSpace") {
              const { toolCallId, state } = part;

              if (state === "output-available") {
                const output = part.output as {
                  success?: boolean;
                  message?: string;
                  error?: string;
                };

                return (
                  <DeleteSpaceResult
                    error={output?.error}
                    key={toolCallId}
                    message={output?.message}
                    success={output?.success ?? !output?.error}
                  />
                );
              }

              return <ToolLoading key={toolCallId} title="Deleting space..." />;
            }

            return null;
          })}

          {!isReadonly && (
            <MessageActions
              chatId={chatId}
              isLoading={isLoading}
              key={`action-${message.id}`}
              message={message}
              setMode={setMode}
              vote={vote}
            />
          )}
        </div>
      </div>
    </div>
  );
};

export const PreviewMessage = memo(
  PurePreviewMessage,
  (prevProps, nextProps) => {
    if (
      prevProps.isLoading === nextProps.isLoading &&
      prevProps.message.id === nextProps.message.id &&
      prevProps.requiresScrollPadding === nextProps.requiresScrollPadding &&
      equal(prevProps.message.parts, nextProps.message.parts) &&
      equal(prevProps.vote, nextProps.vote)
    ) {
      return true;
    }
    return false;
  }
);

/** Reusable thinking indicator - just the text, no avatar */
export const ThinkingIndicator = () => {
  return (
    <div className="flex items-center gap-1.5 text-muted-foreground text-sm">
      <Loader2 className="h-3.5 w-3.5 animate-spin" />
      <span>Thinking</span>
      <span className="flex gap-0.5">
        <span className="animate-pulse">.</span>
        <span className="animate-pulse [animation-delay:200ms]">.</span>
        <span className="animate-pulse [animation-delay:400ms]">.</span>
      </span>
    </div>
  );
};

/** Full thinking message with avatar - used as standalone loading state */
export const ThinkingMessage = () => {
  return (
    <div
      className="group/message fade-in w-full animate-in duration-300"
      data-role="assistant"
      data-testid="message-assistant-loading"
    >
      <div className="flex items-start justify-start gap-3">
        <div className="-mt-1 flex size-8 shrink-0 animate-pulse items-center justify-center rounded-full bg-background ring-1 ring-border">
          <SparklesIcon size={14} />
        </div>

        <div className="flex w-full flex-col gap-2 md:gap-4">
          <ThinkingIndicator />
        </div>
      </div>
    </div>
  );
};

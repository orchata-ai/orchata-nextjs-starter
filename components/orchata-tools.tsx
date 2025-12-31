"use client";

import type { ReactNode } from "react";
import { cn } from "@/lib/utils";
import {
  CheckCircleFillIcon,
  DatabaseIcon,
  EditIcon,
  FileIcon,
  FolderIcon,
  LoaderIcon,
  PlusIcon,
  SearchIcon,
  TrashIcon,
  UploadIcon,
} from "./icons";

// Base card wrapper for tool results
type ToolCardProps = {
  icon: ReactNode;
  title: string;
  description?: string;
  variant?: "default" | "success" | "warning" | "error";
  children?: ReactNode;
  className?: string;
};

export const ToolCard = ({
  icon,
  title,
  description,
  variant = "default",
  children,
  className,
}: ToolCardProps) => {
  const variantStyles = {
    default: "border-border bg-card",
    success:
      "border-green-200 bg-green-50 dark:border-green-900 dark:bg-green-950/30",
    warning:
      "border-amber-200 bg-amber-50 dark:border-amber-900 dark:bg-amber-950/30",
    error: "border-red-200 bg-red-50 dark:border-red-900 dark:bg-red-950/30",
  };

  return (
    <div
      className={cn(
        "w-full max-w-md overflow-hidden rounded-xl border",
        variantStyles[variant],
        className
      )}
    >
      <div className="flex items-start gap-3 p-4">
        <div className="mt-0.5 shrink-0 text-muted-foreground">{icon}</div>
        <div className="min-w-0 flex-1">
          <div className="font-medium text-sm">{title}</div>
          {description ? (
            <div className="mt-0.5 text-muted-foreground text-xs">
              {description}
            </div>
          ) : null}
        </div>
      </div>
      {children ? <div className="border-t px-4 py-3">{children}</div> : null}
    </div>
  );
};

// Loading state for tools
export const ToolLoading = ({ title }: { title: string }) => (
  <ToolCard
    description="Processing..."
    icon={
      <div className="animate-spin">
        <LoaderIcon size={16} />
      </div>
    }
    title={title}
  />
);

// Query Knowledge Result
type QueryKnowledgeResultProps = {
  results: Array<{
    content: string;
    similarity: number;
    source?: string;
    documentId?: string;
  }>;
  query?: string;
};

export const QueryKnowledgeResult = ({
  results,
  query,
}: QueryKnowledgeResultProps) => {
  if (!results || results.length === 0) {
    return (
      <ToolCard
        description="No relevant information found in the knowledge base"
        icon={<SearchIcon size={16} />}
        title="No Results"
        variant="warning"
      />
    );
  }

  return (
    <div className="w-full max-w-lg space-y-2">
      <div className="flex items-center gap-2 text-muted-foreground text-xs">
        <SearchIcon size={14} />
        <span>
          Found {results.length} result{results.length !== 1 ? "s" : ""}
          {query ? ` for "${query}"` : ""}
        </span>
      </div>
      <div className="space-y-2">
        {results.slice(0, 5).map((result, index) => (
          <div
            className="rounded-lg border bg-card p-3"
            key={result.documentId ?? `result-${index}`}
          >
            <div className="flex items-center justify-between gap-2">
              <div className="text-muted-foreground text-xs">
                {result.source ?? `Result ${index + 1}`}
              </div>
              <div className="rounded-full bg-muted px-2 py-0.5 text-muted-foreground text-xs">
                {Math.round(result.similarity * 100)}% match
              </div>
            </div>
            <p className="mt-1.5 line-clamp-3 text-sm">{result.content}</p>
          </div>
        ))}
      </div>
      {results.length > 5 ? (
        <div className="text-center text-muted-foreground text-xs">
          +{results.length - 5} more results
        </div>
      ) : null}
    </div>
  );
};

// Find Relevant Spaces Result
type RelevantSpacesResultProps = {
  spaces: Array<{
    id: string;
    name: string;
    description?: string;
    relevance?: number;
    icon?: string;
  }>;
  query?: string;
};

export const RelevantSpacesResult = ({
  spaces,
  query,
}: RelevantSpacesResultProps) => {
  if (!spaces || spaces.length === 0) {
    return (
      <ToolCard
        description="No relevant spaces found for this query"
        icon={<FolderIcon size={16} />}
        title="No Spaces Found"
        variant="warning"
      />
    );
  }

  return (
    <div className="w-full max-w-md space-y-2">
      <div className="flex items-center gap-2 text-muted-foreground text-xs">
        <FolderIcon size={14} />
        <span>
          {spaces.length} relevant space{spaces.length !== 1 ? "s" : ""}
          {query ? ` for "${query}"` : ""}
        </span>
      </div>
      <div className="space-y-1">
        {spaces.map((space) => (
          <div
            className="flex items-center gap-3 rounded-lg border bg-card px-3 py-2"
            key={space.id}
          >
            <div className="text-muted-foreground">
              <FolderIcon size={16} />
            </div>
            <div className="min-w-0 flex-1">
              <div className="truncate font-medium text-sm">{space.name}</div>
              {space.description ? (
                <div className="truncate text-muted-foreground text-xs">
                  {space.description}
                </div>
              ) : null}
            </div>
            {space.relevance !== undefined ? (
              <div className="shrink-0 rounded-full bg-muted px-2 py-0.5 text-muted-foreground text-xs">
                {Math.round(space.relevance * 100)}%
              </div>
            ) : null}
          </div>
        ))}
      </div>
    </div>
  );
};

// List Spaces Result
type SpaceListResultProps = {
  spaces: Array<{
    id: string;
    name: string;
    description?: string;
    icon?: string;
    isArchived?: boolean;
  }>;
};

export const SpaceListResult = ({ spaces }: SpaceListResultProps) => {
  if (!spaces || spaces.length === 0) {
    return (
      <ToolCard
        description="No knowledge spaces found"
        icon={<DatabaseIcon size={16} />}
        title="No Spaces"
        variant="warning"
      />
    );
  }

  return (
    <div className="w-full max-w-md space-y-2">
      <div className="flex items-center gap-2 text-muted-foreground text-xs">
        <DatabaseIcon size={14} />
        <span>
          {spaces.length} knowledge space{spaces.length !== 1 ? "s" : ""}
        </span>
      </div>
      <div className="grid gap-2">
        {spaces.map((space) => (
          <div
            className={cn(
              "flex items-center gap-3 rounded-lg border bg-card px-3 py-2",
              space.isArchived && "opacity-50"
            )}
            key={space.id}
          >
            <div className="text-muted-foreground">
              <FolderIcon size={16} />
            </div>
            <div className="min-w-0 flex-1">
              <div className="flex items-center gap-2">
                <span className="truncate font-medium text-sm">
                  {space.name}
                </span>
                {space.isArchived ? (
                  <span className="shrink-0 rounded bg-muted px-1.5 py-0.5 text-muted-foreground text-xs">
                    Archived
                  </span>
                ) : null}
              </div>
              {space.description ? (
                <div className="truncate text-muted-foreground text-xs">
                  {space.description}
                </div>
              ) : null}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

// Get Document Content Result
type DocumentContentResultProps = {
  content: string;
  filename?: string;
  documentId?: string;
};

export const DocumentContentResult = ({
  content,
  filename,
}: DocumentContentResultProps) => {
  return (
    <ToolCard
      description={`${content.length} characters`}
      icon={<FileIcon size={16} />}
      title={filename ?? "Document Content"}
    >
      <div className="max-h-48 overflow-y-auto">
        <pre className="whitespace-pre-wrap text-xs">{content}</pre>
      </div>
    </ToolCard>
  );
};

// Upload Document Result
type UploadDocumentResultProps = {
  success: boolean;
  documentId?: string;
  filename?: string;
  spaceName?: string;
  error?: string;
};

export const UploadDocumentResult = ({
  success,
  filename,
  spaceName,
  error,
}: UploadDocumentResultProps) => {
  if (!success) {
    return (
      <ToolCard
        description={error ?? "Failed to upload document"}
        icon={<UploadIcon size={16} />}
        title="Upload Failed"
        variant="error"
      />
    );
  }

  return (
    <ToolCard
      description={
        spaceName
          ? `Saved to "${spaceName}"`
          : "Document saved to knowledge base"
      }
      icon={
        <div className="text-green-600">
          <CheckCircleFillIcon size={16} />
        </div>
      }
      title={`Uploaded "${filename ?? "Document"}"`}
      variant="success"
    />
  );
};

// Create Space Result
type CreateSpaceResultProps = {
  success: boolean;
  space?: {
    id: string;
    name: string;
    description?: string;
    icon?: string;
  };
  // Alternative flat format from Orchata SDK
  spaceId?: string;
  name?: string;
  slug?: string;
  error?: string;
};

export const CreateSpaceResult = ({
  success,
  space,
  spaceId,
  name,
  slug,
  error,
}: CreateSpaceResultProps) => {
  // Handle both nested and flat response formats
  const spaceName = space?.name ?? name;
  const hasSpace = space ?? (spaceId && name);

  if (!success || !hasSpace) {
    return (
      <ToolCard
        description={error ?? "Failed to create space"}
        icon={<PlusIcon size={16} />}
        title="Space Creation Failed"
        variant="error"
      />
    );
  }

  return (
    <ToolCard
      description={
        space?.description ??
        (slug ? `Slug: ${slug}` : "New knowledge space created")
      }
      icon={
        <div className="text-green-600">
          <CheckCircleFillIcon size={16} />
        </div>
      }
      title={`Created "${spaceName}"`}
      variant="success"
    />
  );
};

// Get Space Result
type SpaceDetailResultProps = {
  space: {
    id: string;
    name: string;
    description?: string;
    icon?: string;
    slug?: string;
    isArchived?: boolean;
  };
};

export const SpaceDetailResult = ({ space }: SpaceDetailResultProps) => {
  return (
    <ToolCard
      description={space.description ?? "No description"}
      icon={<FolderIcon size={16} />}
      title={space.name}
    >
      <div className="space-y-1 text-xs">
        <div className="flex justify-between">
          <span className="text-muted-foreground">ID:</span>
          <span className="font-mono">{space.id}</span>
        </div>
        {space.slug ? (
          <div className="flex justify-between">
            <span className="text-muted-foreground">Slug:</span>
            <span>{space.slug}</span>
          </div>
        ) : null}
        <div className="flex justify-between">
          <span className="text-muted-foreground">Status:</span>
          <span
            className={space.isArchived ? "text-amber-600" : "text-green-600"}
          >
            {space.isArchived ? "Archived" : "Active"}
          </span>
        </div>
      </div>
    </ToolCard>
  );
};

// Update Space Result
type UpdateSpaceResultProps = {
  success: boolean;
  space?: {
    id: string;
    name: string;
    description?: string;
  };
  error?: string;
};

export const UpdateSpaceResult = ({
  success,
  space,
  error,
}: UpdateSpaceResultProps) => {
  if (!success) {
    return (
      <ToolCard
        description={error ?? "Failed to update space"}
        icon={<EditIcon size={16} />}
        title="Update Failed"
        variant="error"
      />
    );
  }

  return (
    <ToolCard
      description={space?.description ?? "Space updated successfully"}
      icon={
        <div className="text-green-600">
          <CheckCircleFillIcon size={16} />
        </div>
      }
      title={`Updated "${space?.name ?? "Space"}"`}
      variant="success"
    />
  );
};

// Delete Space Result
type DeleteSpaceResultProps = {
  success: boolean;
  message?: string;
  error?: string;
};

export const DeleteSpaceResult = ({
  success,
  message,
  error,
}: DeleteSpaceResultProps) => {
  if (!success) {
    return (
      <ToolCard
        description={error ?? "Failed to delete space"}
        icon={<TrashIcon size={16} />}
        title="Deletion Failed"
        variant="error"
      />
    );
  }

  return (
    <ToolCard
      description={message ?? "Space has been archived"}
      icon={
        <div className="text-amber-600">
          <TrashIcon size={16} />
        </div>
      }
      title="Space Deleted"
      variant="warning"
    />
  );
};

// Generic error result
type ErrorResultProps = {
  error: string;
  toolName?: string;
};

export const ErrorResult = ({ error, toolName }: ErrorResultProps) => (
  <ToolCard
    description={error}
    icon={<DatabaseIcon size={16} />}
    title={`${toolName ?? "Tool"} Error`}
    variant="error"
  />
);

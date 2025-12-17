"use client"

import { useState } from "react"
import type { Report } from "@/lib/db"
import { Button } from "@/components/ui/button"
import { AlertTriangle, ArrowLeft, ArrowRight, GitMerge } from "lucide-react"
import { syncEngine } from "@/lib/sync-engine"
import { cn } from "@/lib/utils"

interface ConflictResolverProps {
  report: Report
  onClose: () => void
}

export function ConflictResolver({ report, onClose }: ConflictResolverProps) {
  const [selectedResolution, setSelectedResolution] = useState<"local" | "remote" | "merge" | null>(null)
  const [isResolving, setIsResolving] = useState(false)

  const handleResolve = async (resolution: "local" | "remote" | "merge") => {
    setIsResolving(true)
    await syncEngine.resolveConflict(report.id, resolution)
    setIsResolving(false)
    onClose()
  }

  const remoteVersion = report.remoteVersion

  if (!remoteVersion) {
    onClose()
    return null
  }

  return (
    <div className="flex flex-col h-screen bg-background">
      {/* Header */}
      <div className="border-b border-border bg-card shrink-0">
        <div className="px-3 sm:px-4 lg:px-6 py-3 sm:py-4">
          <div className="flex items-center gap-2 sm:gap-3 mb-2">
            <div className="flex items-center justify-center w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-warning/10 text-warning shrink-0">
              <AlertTriangle className="w-4 h-4" />
            </div>
            <h1 className="text-base sm:text-lg lg:text-xl font-semibold">Sync Conflict Detected</h1>
          </div>
          <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
            This report was modified both locally and remotely while you were offline. Choose which version to keep.
          </p>
        </div>
      </div>

      {/* Comparison View */}
      <div className="flex-1 overflow-auto">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6 p-3 sm:p-4 lg:p-6">
          {/* Local Version */}
          <div
            className={cn(
              "border-2 rounded-lg transition-all",
              selectedResolution === "local" ? "border-primary bg-primary/5" : "border-border bg-card",
            )}
          >
            <div className="p-3 sm:p-4 border-b border-border bg-card/50">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-2">
                <h2 className="font-semibold text-sm sm:text-base">Your Local Version</h2>
                <Button
                  size="sm"
                  variant={selectedResolution === "local" ? "default" : "outline"}
                  onClick={() => setSelectedResolution("local")}
                  className="self-start"
                >
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  Keep Local
                </Button>
              </div>
              <p className="text-[10px] sm:text-xs text-muted-foreground">
                Last modified {new Date(report.updatedAt).toLocaleString()}
              </p>
            </div>

            <div className="p-3 sm:p-4 space-y-3 sm:space-y-4">
              <div>
                <h3 className="text-xs sm:text-sm font-medium text-muted-foreground mb-1">Title</h3>
                <p className="font-medium text-sm sm:text-base">{report.title}</p>
              </div>

              {report.tags.length > 0 && (
                <div>
                  <h3 className="text-xs sm:text-sm font-medium text-muted-foreground mb-2">Tags</h3>
                  <div className="flex flex-wrap gap-1 sm:gap-1.5">
                    {report.tags.map((tag) => (
                      <span
                        key={tag}
                        className="px-2 py-0.5 text-[10px] sm:text-xs bg-secondary text-secondary-foreground rounded-full"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              <div>
                <h3 className="text-xs sm:text-sm font-medium text-muted-foreground mb-2">Content</h3>
                <div className="p-2 sm:p-3 bg-secondary/50 rounded text-xs sm:text-sm whitespace-pre-wrap font-mono leading-relaxed max-h-60 sm:max-h-96 overflow-auto">
                  {report.content}
                </div>
              </div>
            </div>
          </div>

          {/* Remote Version */}
          <div
            className={cn(
              "border-2 rounded-lg transition-all",
              selectedResolution === "remote" ? "border-primary bg-primary/5" : "border-border bg-card",
            )}
          >
            <div className="p-3 sm:p-4 border-b border-border bg-card/50">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-2">
                <h2 className="font-semibold text-sm sm:text-base">Remote Version</h2>
                <Button
                  size="sm"
                  variant={selectedResolution === "remote" ? "default" : "outline"}
                  onClick={() => setSelectedResolution("remote")}
                  className="self-start"
                >
                  Keep Remote
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
              </div>
              <p className="text-[10px] sm:text-xs text-muted-foreground">
                Last modified {new Date(remoteVersion.updatedAt).toLocaleString()}
              </p>
            </div>

            <div className="p-3 sm:p-4 space-y-3 sm:space-y-4">
              <div>
                <h3 className="text-xs sm:text-sm font-medium text-muted-foreground mb-1">Title</h3>
                <p className="font-medium text-sm sm:text-base">{remoteVersion.title}</p>
              </div>

              {remoteVersion.tags.length > 0 && (
                <div>
                  <h3 className="text-xs sm:text-sm font-medium text-muted-foreground mb-2">Tags</h3>
                  <div className="flex flex-wrap gap-1 sm:gap-1.5">
                    {remoteVersion.tags.map((tag) => (
                      <span
                        key={tag}
                        className="px-2 py-0.5 text-[10px] sm:text-xs bg-secondary text-secondary-foreground rounded-full"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              <div>
                <h3 className="text-xs sm:text-sm font-medium text-muted-foreground mb-2">Content</h3>
                <div className="p-2 sm:p-3 bg-secondary/50 rounded text-xs sm:text-sm whitespace-pre-wrap font-mono leading-relaxed max-h-60 sm:max-h-96 overflow-auto">
                  {remoteVersion.content}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Action Bar */}
      <div className="border-t border-border bg-card p-3 sm:p-4 lg:p-6 shrink-0">
        <div className="max-w-4xl mx-auto space-y-3">
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 sm:gap-3">
            <Button
              onClick={() => handleResolve("local")}
              disabled={isResolving}
              variant={selectedResolution === "local" ? "default" : "outline"}
              size="sm"
              className="flex-1 sm:flex-none"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Keep Local
            </Button>
            <Button
              onClick={() => handleResolve("remote")}
              disabled={isResolving}
              variant={selectedResolution === "remote" ? "default" : "outline"}
              size="sm"
              className="flex-1 sm:flex-none"
            >
              Keep Remote
              <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
            <Button
              onClick={() => handleResolve("merge")}
              disabled={isResolving}
              variant={selectedResolution === "merge" ? "default" : "outline"}
              size="sm"
              className="flex-1 sm:flex-none"
            >
              <GitMerge className="w-4 h-4 mr-2" />
              Merge Both
            </Button>
          </div>

          <p className="text-[10px] sm:text-xs text-muted-foreground leading-relaxed">
            <strong>Merge Both:</strong> Combines your local changes with the remote changes. You can edit the merged
            version afterward.
          </p>
        </div>
      </div>
    </div>
  )
}

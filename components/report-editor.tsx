"use client"

import type React from "react"

import { useEffect, useState } from "react"
import type { Report } from "@/lib/db"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Save, X, Trash2, Check } from "lucide-react"
import { cn } from "@/lib/utils"

interface ReportEditorProps {
  report?: Report
  onSave: (data: { title: string; content: string; tags: string[] }) => void
  onCancel: () => void
  onDelete?: () => void
}

export function ReportEditor({ report, onSave, onCancel, onDelete }: ReportEditorProps) {
  const [title, setTitle] = useState(report?.title || "")
  const [content, setContent] = useState(report?.content || "")
  const [tagsInput, setTagsInput] = useState(report?.tags.join(", ") || "")
  const [isDirty, setIsDirty] = useState(false)
  const [saveStatus, setSaveStatus] = useState<"idle" | "saving" | "saved">("idle")

  useEffect(() => {
    setIsDirty(
      title !== (report?.title || "") ||
        content !== (report?.content || "") ||
        tagsInput !== (report?.tags.join(", ") || ""),
    )
  }, [title, content, tagsInput, report])

  const handleSave = async () => {
    if (!title.trim()) return

    setSaveStatus("saving")

    const tags = tagsInput
      .split(",")
      .map((tag) => tag.trim())
      .filter(Boolean)

    await onSave({ title, content, tags })

    setSaveStatus("saved")
    setTimeout(() => setSaveStatus("idle"), 2000)
    setIsDirty(false)
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if ((e.metaKey || e.ctrlKey) && e.key === "s") {
      e.preventDefault()
      handleSave()
    }
  }

  return (
    <div className="h-full flex flex-col bg-background" onKeyDown={handleKeyDown}>
      {/* Editor Header */}
      <div className="border-b border-border bg-card shrink-0">
        <div className="flex items-center justify-between px-3 sm:px-4 lg:px-6 h-12 sm:h-14">
          <div className="flex items-center gap-2 sm:gap-3 min-w-0 flex-1">
            <h2 className="font-semibold text-xs sm:text-sm lg:text-base truncate">
              {report ? "Edit Report" : "New Report"}
            </h2>
            {isDirty && (
              <span className="hidden sm:inline text-xs text-muted-foreground whitespace-nowrap">
                (Unsaved changes)
              </span>
            )}
            {saveStatus === "saved" && (
              <span className="hidden sm:flex items-center gap-1 text-xs text-success whitespace-nowrap">
                <Check className="w-3 h-3" />
                Saved
              </span>
            )}
          </div>
          <div className="flex items-center gap-1 sm:gap-2">
            {report && onDelete && (
              <Button variant="ghost" size="sm" onClick={onDelete} className="text-destructive px-2 sm:px-3">
                <Trash2 className="w-4 h-4 sm:mr-2" />
                <span className="hidden sm:inline">Delete</span>
              </Button>
            )}
            <Button variant="ghost" size="sm" onClick={onCancel} className="px-2 sm:px-3">
              <X className="w-4 h-4 sm:mr-2" />
              <span className="hidden sm:inline">Cancel</span>
            </Button>
            <Button
              size="sm"
              onClick={handleSave}
              disabled={!title.trim() || saveStatus === "saving"}
              className={cn("px-2 sm:px-3", saveStatus === "saved" && "bg-success hover:bg-success/90")}
            >
              {saveStatus === "saving" ? (
                <>
                  <span className="w-4 h-4 border-2 border-primary-foreground/30 border-t-primary-foreground rounded-full animate-spin sm:mr-2" />
                  <span className="hidden sm:inline">Saving...</span>
                </>
              ) : (
                <>
                  <Save className="w-4 h-4 sm:mr-2" />
                  <span className="hidden sm:inline">Save</span>
                </>
              )}
            </Button>
          </div>
        </div>
      </div>

      {/* Editor Content */}
      <div className="flex-1 overflow-auto">
        <div className="max-w-3xl xl:max-w-4xl 2xl:max-w-5xl mx-auto p-4 sm:p-6 lg:p-8 xl:p-10 space-y-4 sm:space-y-6">
          <div className="space-y-2">
            <Label htmlFor="title" className="text-xs sm:text-sm font-medium">
              Title
            </Label>
            <Input
              id="title"
              placeholder="Report title..."
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="text-base sm:text-lg font-semibold h-10 sm:h-11"
              autoFocus={!report}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="tags" className="text-xs sm:text-sm font-medium">
              Tags
            </Label>
            <Input
              id="tags"
              placeholder="Separate tags with commas..."
              value={tagsInput}
              onChange={(e) => setTagsInput(e.target.value)}
              className="h-9 sm:h-10"
            />
            <p className="text-[10px] sm:text-xs text-muted-foreground">
              Example: field-report, emergency, high-priority
            </p>
          </div>

          <div className="space-y-2">
            <Label htmlFor="content" className="text-xs sm:text-sm font-medium">
              Content
            </Label>
            <Textarea
              id="content"
              placeholder="Write your report here..."
              value={content}
              onChange={(e) => setContent(e.target.value)}
              className="min-h-75 sm:min-h-[400px] lg:min-h-[500px] resize-none font-mono text-xs sm:text-sm leading-relaxed"
            />
          </div>

          <div className="flex items-start gap-2 sm:gap-3 p-3 sm:p-4 rounded-lg bg-muted/50 text-[10px] sm:text-xs text-muted-foreground">
            <svg
              className="w-4 h-4 flex-shrink-0 mt-0.5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
            <span className="leading-relaxed">
              Your report is automatically saved locally and will sync when you&apos;re back online.
            </span>
          </div>
        </div>
      </div>
    </div>
  )
}

"use client"

import type { Report } from "@/lib/db"
import { StatusBadge } from "@/components/status-badge"
import { Skeleton } from "@/components/ui/skeleton"
import { cn } from "@/lib/utils"

interface ReportListProps {
  reports: Report[]
  selectedId: string | null
  onSelect: (id: string) => void
  loading: boolean
}

export function ReportList({ reports, selectedId, onSelect, loading }: ReportListProps) {
  if (loading) {
    return (
      <div className="p-3 sm:p-4 space-y-3">
        {Array.from({ length: 5 }).map((_, i) => (
          <div key={i} className="space-y-2">
            <Skeleton className="h-4 sm:h-5 w-3/4" />
            <Skeleton className="h-3 sm:h-4 w-full" />
            <Skeleton className="h-3 w-1/2" />
          </div>
        ))}
      </div>
    )
  }

  if (reports.length === 0) {
    return (
      <div className="flex-1 flex items-center justify-center p-6 sm:p-8">
        <p className="text-xs sm:text-sm text-muted-foreground text-center">No reports found</p>
      </div>
    )
  }

  return (
    <div className="flex-1 overflow-auto">
      <div className="divide-y divide-border">
        {reports.map((report) => (
          <button
            key={report.id}
            onClick={() => onSelect(report.id)}
            className={cn(
              "w-full text-left p-3 sm:p-4 transition-colors hover:bg-accent/50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring active:bg-accent/70",
              selectedId === report.id && "bg-accent",
            )}
          >
            <div className="space-y-2">
              <div className="flex items-start justify-between gap-2">
                <h3 className="font-medium text-xs sm:text-sm leading-tight line-clamp-1 text-balance">
                  {report.title}
                </h3>
                <StatusBadge status={report.status} />
              </div>
              <p className="text-xs sm:text-sm text-muted-foreground line-clamp-2 leading-relaxed">{report.content}</p>
              <div className="flex items-center justify-between gap-2 text-[10px] sm:text-xs text-muted-foreground">
                <span>{new Date(report.updatedAt).toLocaleDateString()}</span>
                {report.tags.length > 0 && <span className="line-clamp-1 truncate">{report.tags.join(", ")}</span>}
              </div>
            </div>
          </button>
        ))}
      </div>
    </div>
  )
}

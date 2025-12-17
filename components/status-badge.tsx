import type { Report } from "@/lib/db"
import { CheckCircle2, CloudOff, Loader2, AlertTriangle } from "lucide-react"
import { cn } from "@/lib/utils"

interface StatusBadgeProps {
  status: Report["status"]
  className?: string
}

export function StatusBadge({ status, className }: StatusBadgeProps) {
  const config = {
    offline: {
      icon: CloudOff,
      label: "Offline",
      className: "bg-muted text-muted-foreground",
    },
    syncing: {
      icon: Loader2,
      label: "Syncing",
      className: "bg-primary/10 text-primary",
    },
    synced: {
      icon: CheckCircle2,
      label: "Synced",
      className: "bg-success/10 text-success",
    },
    conflict: {
      icon: AlertTriangle,
      label: "Conflict",
      className: "bg-warning/10 text-warning",
    },
  }

  const { icon: Icon, label, className: statusClassName } = config[status]

  return (
    <span
      className={cn(
        "inline-flex items-center gap-1 px-1.5 sm:px-2 py-0.5 text-[10px] sm:text-xs font-medium rounded-full shrink-0",
        statusClassName,
        className,
      )}
    >
      <Icon className={cn("w-2.5 h-2.5 sm:w-3 sm:h-3", status === "syncing" && "animate-spin")} />
      <span className="hidden xs:inline sm:inline">{label}</span>
    </span>
  )
}

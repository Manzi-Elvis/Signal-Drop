"use client"

import { Wifi, WifiOff, WifiIcon as WifiLow } from "lucide-react"
import { useNetwork } from "@/components/network-provider"
import { cn } from "@/lib/utils"

export function NetworkStatus() {
  const { status } = useNetwork()

  const config = {
    online: {
      icon: Wifi,
      label: "Online",
      className: "text-success",
    },
    offline: {
      icon: WifiOff,
      label: "Offline",
      className: "text-muted-foreground",
    },
    slow: {
      icon: WifiLow,
      label: "Slow",
      className: "text-warning",
    },
  }

  const { icon: Icon, label, className } = config[status]

  return (
    <div className="flex items-center gap-1.5 sm:gap-2 text-xs sm:text-sm">
      <Icon className={cn("w-4 h-4 sm:w-4 sm:h-4", className)} />
      <span className={cn("hidden sm:inline", className)}>{label}</span>
    </div>
  )
}

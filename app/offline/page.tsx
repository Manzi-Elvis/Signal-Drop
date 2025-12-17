"use client"

import { WifiOff } from "lucide-react"
import { Button } from "@/components/ui/button"

export default function OfflinePage() {
  return (
    <div className="min-h-screen flex items-center justify-center p-4 sm:p-6 lg:p-8 bg-background">
      <div className="text-center space-y-4 sm:space-y-6 max-w-md">
        <div className="flex justify-center">
          <div className="p-4 sm:p-5 lg:p-6 bg-muted rounded-full">
            <WifiOff className="w-8 h-8 sm:w-10 sm:h-10 lg:w-12 lg:h-12 text-muted-foreground" />
          </div>
        </div>
        <div className="space-y-2 sm:space-y-3">
          <h1 className="text-xl sm:text-2xl lg:text-3xl font-semibold text-balance">You're Offline</h1>
          <p className="text-sm sm:text-base text-muted-foreground text-balance leading-relaxed px-4">
            SignalDrop is designed to work offline. Your data is safe and will sync automatically when you're back
            online.
          </p>
        </div>
        <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center pt-2">
          <Button variant="default" onClick={() => window.location.reload()} className="w-full sm:w-auto" size="sm">
            Try Again
          </Button>
          <Button variant="outline" onClick={() => (window.location.href = "/")} className="w-full sm:w-auto" size="sm">
            Go Home
          </Button>
        </div>
      </div>
    </div>
  )
}

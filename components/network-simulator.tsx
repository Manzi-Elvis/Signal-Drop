"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Separator } from "@/components/ui/separator"
import { useNetwork } from "@/components/network-provider"
import { syncEngine } from "@/lib/sync-engine"
import { useReports } from "@/hooks/use-reports"
import { Wifi, WifiOff, WifiIcon as WifiLow, CloudUpload, AlertCircle, Activity } from "lucide-react"

export function NetworkSimulator() {
  const { status, setSimulatedStatus } = useNetwork()
  const { reports } = useReports()
  const [syncFailure, setSyncFailure] = useState(false)

  const handleNetworkChange = (newStatus: "online" | "offline" | "slow") => {
    setSimulatedStatus(newStatus)
  }

  const handleSync = async () => {
    await syncEngine.sync(status === "online", syncFailure)
  }

  const handleSimulateConflict = async () => {
    const offlineReports = reports.filter((r) => r.status === "offline" || r.status === "synced")
    if (offlineReports.length > 0) {
      await syncEngine.simulateRemoteConflict(offlineReports[0].id)
    }
  }

  const offlineCount = reports.filter((r) => r.status === "offline").length
  const syncingCount = reports.filter((r) => r.status === "syncing").length
  const conflictCount = reports.filter((r) => r.status === "conflict").length

  return (
    <div className="h-full flex flex-col">
      <div className="p-3 sm:p-4 border-b border-border shrink-0">
        <div className="flex items-center gap-2 mb-1">
          <Activity className="w-4 h-4 text-muted-foreground" />
          <h2 className="font-semibold text-xs sm:text-sm">Network Chaos Simulator</h2>
        </div>
        <p className="text-[10px] sm:text-xs text-muted-foreground">Developer tool for testing offline scenarios</p>
      </div>

      <div className="flex-1 overflow-auto p-3 sm:p-4 space-y-4 sm:space-y-6">
        {/* Network Status Controls */}
        <div className="space-y-2 sm:space-y-3">
          <h3 className="text-[10px] sm:text-xs font-medium text-muted-foreground uppercase tracking-wide">
            Network Status
          </h3>

          <button
            onClick={() => handleNetworkChange("online")}
            className={`w-full flex items-center justify-between p-2.5 sm:p-3 rounded-lg border-2 transition-all ${
              status === "online"
                ? "border-success bg-success/10 text-success"
                : "border-border bg-card hover:bg-accent"
            }`}
          >
            <div className="flex items-center gap-2 sm:gap-3">
              <Wifi className="w-4 h-4" />
              <span className="text-xs sm:text-sm font-medium">Online</span>
            </div>
            {status === "online" && <div className="w-2 h-2 rounded-full bg-success animate-pulse" />}
          </button>

          <button
            onClick={() => handleNetworkChange("slow")}
            className={`w-full flex items-center justify-between p-2.5 sm:p-3 rounded-lg border-2 transition-all ${
              status === "slow" ? "border-warning bg-warning/10 text-warning" : "border-border bg-card hover:bg-accent"
            }`}
          >
            <div className="flex items-center gap-2 sm:gap-3">
              <WifiLow className="w-4 h-4" />
              <span className="text-xs sm:text-sm font-medium">Slow Network</span>
            </div>
            {status === "slow" && <div className="w-2 h-2 rounded-full bg-warning animate-pulse" />}
          </button>

          <button
            onClick={() => handleNetworkChange("offline")}
            className={`w-full flex items-center justify-between p-2.5 sm:p-3 rounded-lg border-2 transition-all ${
              status === "offline"
                ? "border-muted-foreground bg-muted text-foreground"
                : "border-border bg-card hover:bg-accent"
            }`}
          >
            <div className="flex items-center gap-2 sm:gap-3">
              <WifiOff className="w-4 h-4" />
              <span className="text-xs sm:text-sm font-medium">Offline</span>
            </div>
            {status === "offline" && <div className="w-2 h-2 rounded-full bg-muted-foreground animate-pulse" />}
          </button>
        </div>

        <Separator />

        {/* Sync Actions */}
        <div className="space-y-2 sm:space-y-3">
          <h3 className="text-[10px] sm:text-xs font-medium text-muted-foreground uppercase tracking-wide">
            Sync Actions
          </h3>

          <Button onClick={handleSync} disabled={status === "offline" || syncingCount > 0} className="w-full" size="sm">
            <CloudUpload className="w-4 h-4 mr-2" />
            Trigger Sync {offlineCount > 0 && `(${offlineCount})`}
          </Button>

          <div className="flex items-center justify-between p-2.5 sm:p-3 rounded-lg bg-card border border-border">
            <Label htmlFor="sync-failure" className="text-xs sm:text-sm cursor-pointer">
              Simulate Sync Failure
            </Label>
            <Switch id="sync-failure" checked={syncFailure} onCheckedChange={setSyncFailure} />
          </div>

          <Button
            onClick={handleSimulateConflict}
            disabled={reports.length === 0}
            variant="outline"
            className="w-full bg-transparent"
            size="sm"
          >
            <AlertCircle className="w-4 h-4 mr-2" />
            Create Conflict
          </Button>
        </div>

        <Separator />

        {/* Status Summary */}
        <div className="space-y-2 sm:space-y-3">
          <h3 className="text-[10px] sm:text-xs font-medium text-muted-foreground uppercase tracking-wide">
            Status Summary
          </h3>

          <div className="space-y-1.5 sm:space-y-2 text-xs sm:text-sm">
            <div className="flex items-center justify-between p-2 rounded bg-muted/50">
              <span className="text-muted-foreground">Offline Reports</span>
              <span className="font-medium">{offlineCount}</span>
            </div>

            <div className="flex items-center justify-between p-2 rounded bg-muted/50">
              <span className="text-muted-foreground">Syncing</span>
              <span className="font-medium">{syncingCount}</span>
            </div>

            <div className="flex items-center justify-between p-2 rounded bg-muted/50">
              <span className="text-muted-foreground">Conflicts</span>
              <span className="font-medium text-warning">{conflictCount}</span>
            </div>
          </div>
        </div>

        <Separator />

        {/* Info */}
        <div className="p-2.5 sm:p-3 rounded-lg bg-muted/30 text-[10px] sm:text-xs text-muted-foreground space-y-2 leading-relaxed">
          <p>
            <strong>Testing Offline Functionality:</strong>
          </p>
          <ul className="list-disc list-inside space-y-1 ml-2">
            <li>Create reports while offline</li>
            <li>Switch to online and sync</li>
            <li>Simulate conflicts to test resolution UI</li>
            <li>Test slow networks and sync failures</li>
          </ul>
        </div>
      </div>
    </div>
  )
}

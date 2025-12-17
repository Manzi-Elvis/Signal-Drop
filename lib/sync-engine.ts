import type { Report } from "./db"
import { db } from "./db"

class SyncEngine {
  private syncInProgress = false
  private listeners: Array<() => void> = []

  subscribe(listener: () => void) {
    this.listeners.push(listener)
    return () => {
      this.listeners = this.listeners.filter((l) => l !== listener)
    }
  }

  private notify() {
    this.listeners.forEach((listener) => listener())
  }

  async simulateRemoteConflict(reportId: string): Promise<void> {
    const report = await db.getReport(reportId)
    if (!report) return

    // Simulate a remote version that conflicts
    const remoteVersion: Report = {
      ...report,
      title: `${report.title} (Remote Edit)`,
      content: `${report.content}\n\n[Remote changes made while offline]`,
      updatedAt: Date.now() + 1000,
      syncVersion: (report.syncVersion || 0) + 1,
    }

    await db.saveReport({
      ...report,
      status: "conflict",
      remoteVersion,
    })

    this.notify()
  }

  async resolveConflict(reportId: string, resolution: "local" | "remote" | "merge"): Promise<void> {
    const report = await db.getReport(reportId)
    if (!report || !report.remoteVersion) return

    let resolvedReport: Report

    switch (resolution) {
      case "local":
        resolvedReport = {
          ...report,
          status: "offline",
          remoteVersion: undefined,
          updatedAt: Date.now(),
        }
        break
      case "remote":
        resolvedReport = {
          ...report.remoteVersion,
          id: report.id,
          status: "synced",
          remoteVersion: undefined,
        }
        break
      case "merge":
        resolvedReport = {
          ...report,
          title: report.title,
          content: `${report.content}\n\n---\nRemote changes:\n${report.remoteVersion.content}`,
          status: "offline",
          remoteVersion: undefined,
          updatedAt: Date.now(),
        }
        break
    }

    await db.saveReport(resolvedReport)
    this.notify()
  }

  async sync(isOnline: boolean, shouldFail = false): Promise<void> {
    if (this.syncInProgress || !isOnline) return

    this.syncInProgress = true

    try {
      const reports = await db.getReportsByStatus("offline")

      for (const report of reports) {
        // Update to syncing status
        await db.saveReport({ ...report, status: "syncing" })
        this.notify()

        // Simulate network delay
        await new Promise((resolve) => setTimeout(resolve, 800 + Math.random() * 400))

        if (shouldFail) {
          // Simulate sync failure
          await db.saveReport({ ...report, status: "offline" })
        } else {
          // Simulate successful sync
          await db.saveReport({ ...report, status: "synced", syncVersion: (report.syncVersion || 0) + 1 })
        }

        this.notify()
      }
    } finally {
      this.syncInProgress = false
    }
  }

  isSyncing(): boolean {
    return this.syncInProgress
  }
}

export const syncEngine = new SyncEngine()

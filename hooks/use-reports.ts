"use client"

import { useEffect, useState } from "react"
import type { Report } from "@/lib/db"
import { db } from "@/lib/db"
import { syncEngine } from "@/lib/sync-engine"
import { useNetwork } from "@/components/network-provider"

const SAMPLE_REPORTS: Report[] = [
  {
    id: "sample-1",
    title: "Welcome to SignalDrop",
    content: `SignalDrop is an offline-first field reporting application designed for professionals working in challenging environments.

Key Features:
• Offline-first architecture - Create and edit reports without internet
• Automatic synchronization when connection is restored
• Conflict resolution for simultaneous edits
• Real-time network status monitoring
• Network simulator for testing offline scenarios

Try creating a new report or editing this one to see the offline capabilities in action!`,
    tags: ["welcome", "tutorial"],
    createdAt: Date.now() - 86400000,
    updatedAt: Date.now() - 86400000,
    status: "synced",
  },
  {
    id: "sample-2",
    title: "Testing Offline Functionality",
    content: `To test the offline capabilities:

1. Use the Network Simulator (gear icon in header on desktop)
2. Set the network to "Offline" mode
3. Create or edit reports - they'll be saved locally
4. Switch back to "Online" to see automatic synchronization

The app uses IndexedDB for local storage, ensuring your data is always safe even when offline.`,
    tags: ["testing", "offline"],
    createdAt: Date.now() - 172800000,
    updatedAt: Date.now() - 172800000,
    status: "synced",
  },
]

export function useReports() {
  const [reports, setReports] = useState<Report[]>([])
  const [loading, setLoading] = useState(true)
  const { isOnline } = useNetwork()

  const loadReports = async () => {
    try {
      const allReports = await db.getAllReports()

      if (allReports.length === 0) {
        for (const sample of SAMPLE_REPORTS) {
          await db.saveReport(sample)
        }
        const updatedReports = await db.getAllReports()
        setReports(updatedReports.sort((a, b) => b.updatedAt - a.updatedAt))
      } else {
        setReports(allReports.sort((a, b) => b.updatedAt - a.updatedAt))
      }
    } catch (error) {
      console.error("Failed to load reports:", error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadReports()

    // Subscribe to sync engine updates
    const unsubscribe = syncEngine.subscribe(() => {
      loadReports()
    })

    return unsubscribe
  }, [])

  const createReport = async (data: Omit<Report, "id" | "createdAt" | "updatedAt" | "status">) => {
    const newReport: Report = {
      ...data,
      id: crypto.randomUUID(),
      createdAt: Date.now(),
      updatedAt: Date.now(),
      status: "offline",
    }

    await db.saveReport(newReport)
    await loadReports()

    // Try to sync if online
    if (isOnline) {
      syncEngine.sync(true)
    }

    return newReport
  }

  const updateReport = async (id: string, updates: Partial<Report>) => {
    const existing = await db.getReport(id)
    if (!existing) return

    const updated: Report = {
      ...existing,
      ...updates,
      updatedAt: Date.now(),
      status: "offline",
    }

    await db.saveReport(updated)
    await loadReports()

    // Try to sync if online
    if (isOnline) {
      syncEngine.sync(true)
    }
  }

  const deleteReport = async (id: string) => {
    await db.deleteReport(id)
    await loadReports()
  }

  return {
    reports,
    loading,
    createReport,
    updateReport,
    deleteReport,
    refresh: loadReports,
  }
}

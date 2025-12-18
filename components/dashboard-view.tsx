"use client"

import { useState } from "react"
import { Plus, Search, Menu, CloverIcon as CloseIcon } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { ReportList } from "@/components/report-list"
import { ReportEditor } from "@/components/report-editor"
import { ConflictResolver } from "@/components/conflict-resolver"
import { NetworkStatus } from "@/components/network-status"
import { NetworkSimulator } from "@/components/network-simulator"
import { useReports } from "@/hooks/use-reports"
import { cn } from "@/lib/utils"

export function DashboardView() {
  const { reports, loading, createReport, updateReport, deleteReport } = useReports()
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedReportId, setSelectedReportId] = useState<string | null>(null)
  const [isEditing, setIsEditing] = useState(false)
  const [showSimulator, setShowSimulator] = useState(false)
  const [showSidebar, setShowSidebar] = useState(false)

  const filteredReports = reports.filter(
    (report) =>
      report.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      report.content.toLowerCase().includes(searchQuery.toLowerCase()) ||
      report.tags.some((tag) => tag.toLowerCase().includes(searchQuery.toLowerCase())),
  )

  const selectedReport = reports.find((r) => r.id === selectedReportId)
  const conflictReport = reports.find((r) => r.status === "conflict")

  const handleCreateNew = () => {
    setSelectedReportId(null)
    setIsEditing(true)
  }

  const handleSelectReport = (id: string) => {
    setSelectedReportId(id)
    setIsEditing(false)
    setShowSidebar(false)
  }

  const handleEdit = () => {
    if (selectedReportId) {
      setIsEditing(true)
    }
  }

  const handleSave = async (data: { title: string; content: string; tags: string[] }) => {
    if (selectedReportId) {
      await updateReport(selectedReportId, data)
    } else {
      const newReport = await createReport(data)
      setSelectedReportId(newReport.id)
    }
    setIsEditing(false)
  }

  const handleCancel = () => {
    setIsEditing(false)
    if (!selectedReportId) {
      setSelectedReportId(reports[0]?.id || null)
    }
  }

  const handleDelete = async () => {
    if (selectedReportId) {
      await deleteReport(selectedReportId)
      setSelectedReportId(reports[0]?.id || null)
      setIsEditing(false)
    }
  }

  if (conflictReport) {
    return <ConflictResolver report={conflictReport} onClose={() => setSelectedReportId(null)} />
  }

  return (
    <div className="flex flex-col h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border bg-card shrink-0">
        <div className="flex items-center justify-between px-3 sm:px-4 lg:px-6 h-14 lg:h-16">
          <div className="flex items-center gap-2 sm:gap-3">
            <Button variant="ghost" size="icon" className="md:hidden" onClick={() => setShowSidebar(!showSidebar)}>
              <Menu className="w-5 h-5" />
              <span className="sr-only">Toggle sidebar</span>
            </Button>
            <div className="flex items-center justify-center w-7 h-7 sm:w-8 sm:h-8 rounded-lg bg-primary text-primary-foreground font-semibold text-xs sm:text-sm">
              SD
            </div>
            <h1 className="text-base sm:text-lg lg:text-xl font-semibold tracking-tight">SignalDrop</h1>
          </div>
          <div className="flex items-center gap-1 sm:gap-2">
            <NetworkStatus />
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setShowSimulator(!showSimulator)}
              className="hidden lg:flex"
            >
              <span className="sr-only">Toggle network simulator</span>
              <svg
                className="w-4 h-4"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"
                />
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                />
              </svg>
            </Button>
          </div>
        </div>
      </header>

      <div className="flex flex-1 overflow-hidden relative">
        {showSidebar && (
          <div
            className="fixed inset-0 bg-background/80 backdrop-blur-sm z-40 md:hidden"
            onClick={() => setShowSidebar(false)}
          />
        )}

        <aside
          className={cn(
            "w-full sm:w-80 lg:w-96 xl:w-112 border-r border-border flex flex-col bg-card shrink-0",
            "fixed md:relative inset-y-0 left-0 z-50 md:z-auto",
            "transform transition-transform duration-200 ease-in-out md:transform-none",
            showSidebar ? "translate-x-0" : "-translate-x-full md:translate-x-0",
          )}
        >
          <div className="flex md:hidden items-center justify-between px-3 py-2 border-b border-border">
            <h2 className="font-semibold text-sm">Reports</h2>
            <Button variant="ghost" size="icon" onClick={() => setShowSidebar(false)}>
              <CloseIcon className="w-4 h-4" />
              <span className="sr-only">Close sidebar</span>
            </Button>
          </div>

          <div className="p-3 sm:p-4 space-y-3 border-b border-border shrink-0">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                type="search"
                placeholder="Search reports..."
                className="pl-9 h-9 sm:h-10"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <Button onClick={handleCreateNew} className="w-full" size="sm">
              <Plus className="w-4 h-4 mr-2" />
              New Report
            </Button>
          </div>

          <ReportList
            reports={filteredReports}
            selectedId={selectedReportId}
            onSelect={handleSelectReport}
            loading={loading}
          />
        </aside>

        <main className="flex-1 overflow-hidden">
          {isEditing ? (
            <ReportEditor report={selectedReport} onSave={handleSave} onCancel={handleCancel} onDelete={handleDelete} />
          ) : selectedReport ? (
            <div className="h-full overflow-auto">
              <div className="max-w-3xl xl:max-w-4xl 2xl:max-w-5xl mx-auto p-4 sm:p-6 lg:p-8 xl:p-10 space-y-4 sm:space-y-6">
                <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3 sm:gap-4">
                  <div className="flex-1 space-y-1">
                    <h2 className="text-xl sm:text-2xl lg:text-3xl font-semibold tracking-tight text-balance leading-tight">
                      {selectedReport.title}
                    </h2>
                    <p className="text-xs sm:text-sm text-muted-foreground">
                      Last updated {new Date(selectedReport.updatedAt).toLocaleString()}
                    </p>
                  </div>
                  <Button onClick={handleEdit} variant="outline" size="sm" className="self-start bg-transparent">
                    Edit
                  </Button>
                </div>

                {selectedReport.tags.length > 0 && (
                  <div className="flex flex-wrap gap-2">
                    {selectedReport.tags.map((tag) => (
                      <span
                        key={tag}
                        className="px-2.5 py-1 text-xs font-medium bg-secondary text-secondary-foreground rounded-full"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                )}

                <div className="prose prose-sm sm:prose-base lg:prose-lg prose-neutral dark:prose-invert max-w-none">
                  <div className="whitespace-pre-wrap leading-relaxed text-sm sm:text-base">
                    {selectedReport.content}
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div className="h-full flex items-center justify-center p-4">
              <div className="text-center space-y-3 max-w-sm">
                <p className="text-sm sm:text-base text-muted-foreground">No report selected</p>
                <Button onClick={handleCreateNew} size="sm">
                  <Plus className="w-4 h-4 mr-2" />
                  Create your first report
                </Button>
              </div>
            </div>
          )}
        </main>

        {showSimulator && (
          <aside className="hidden lg:block w-80 xl:w-96 border-l border-border bg-card overflow-auto shrink-0">
            <NetworkSimulator />
          </aside>
        )}
      </div>
    </div>
  )
}

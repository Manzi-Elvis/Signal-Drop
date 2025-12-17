export interface Report {
  id: string
  title: string
  content: string
  tags: string[]
  location?: { lat: number; lng: number }
  createdAt: number
  updatedAt: number
  status: "offline" | "syncing" | "synced" | "conflict"
  syncVersion?: number
  remoteVersion?: Report
}

const DB_NAME = "signaldrop-db"
const DB_VERSION = 1
const REPORTS_STORE = "reports"

class Database {
  private db: IDBDatabase | null = null

  async init(): Promise<void> {
    if (this.db) return

    return new Promise((resolve, reject) => {
      const request = indexedDB.open(DB_NAME, DB_VERSION)

      request.onerror = () => reject(request.error)
      request.onsuccess = () => {
        this.db = request.result
        resolve()
      }

      request.onupgradeneeded = (event) => {
        const db = (event.target as IDBOpenDBRequest).result

        if (!db.objectStoreNames.contains(REPORTS_STORE)) {
          const store = db.createObjectStore(REPORTS_STORE, { keyPath: "id" })
          store.createIndex("status", "status", { unique: false })
          store.createIndex("updatedAt", "updatedAt", { unique: false })
        }
      }
    })
  }

  async getAllReports(): Promise<Report[]> {
    await this.init()
    return new Promise((resolve, reject) => {
      const transaction = this.db!.transaction([REPORTS_STORE], "readonly")
      const store = transaction.objectStore(REPORTS_STORE)
      const request = store.getAll()

      request.onsuccess = () => resolve(request.result)
      request.onerror = () => reject(request.error)
    })
  }

  async getReport(id: string): Promise<Report | undefined> {
    await this.init()
    return new Promise((resolve, reject) => {
      const transaction = this.db!.transaction([REPORTS_STORE], "readonly")
      const store = transaction.objectStore(REPORTS_STORE)
      const request = store.get(id)

      request.onsuccess = () => resolve(request.result)
      request.onerror = () => reject(request.error)
    })
  }

  async saveReport(report: Report): Promise<void> {
    await this.init()
    return new Promise((resolve, reject) => {
      const transaction = this.db!.transaction([REPORTS_STORE], "readwrite")
      const store = transaction.objectStore(REPORTS_STORE)
      const request = store.put(report)

      request.onsuccess = () => resolve()
      request.onerror = () => reject(request.error)
    })
  }

  async deleteReport(id: string): Promise<void> {
    await this.init()
    return new Promise((resolve, reject) => {
      const transaction = this.db!.transaction([REPORTS_STORE], "readwrite")
      const store = transaction.objectStore(REPORTS_STORE)
      const request = store.delete(id)

      request.onsuccess = () => resolve()
      request.onerror = () => reject(request.error)
    })
  }

  async getReportsByStatus(status: Report["status"]): Promise<Report[]> {
    await this.init()
    return new Promise((resolve, reject) => {
      const transaction = this.db!.transaction([REPORTS_STORE], "readonly")
      const store = transaction.objectStore(REPORTS_STORE)
      const index = store.index("status")
      const request = index.getAll(status)

      request.onsuccess = () => resolve(request.result)
      request.onerror = () => reject(request.error)
    })
  }
}

export const db = new Database()

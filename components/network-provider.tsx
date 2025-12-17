"use client"

import type React from "react"

import { createContext, useContext, useEffect, useState } from "react"

type NetworkStatus = "online" | "offline" | "slow"

interface NetworkContextType {
  status: NetworkStatus
  isOnline: boolean
  setSimulatedStatus: (status: NetworkStatus) => void
  isSimulated: boolean
}

const NetworkContext = createContext<NetworkContextType>({
  status: "online",
  isOnline: true,
  setSimulatedStatus: () => {},
  isSimulated: false,
})

export function NetworkProvider({ children }: { children: React.ReactNode }) {
  const [status, setStatus] = useState<NetworkStatus>("online")
  const [simulatedStatus, setSimulatedStatus] = useState<NetworkStatus | null>(null)

  useEffect(() => {
    // The app still functions with offline-first capabilities using IndexedDB

    const updateStatus = () => {
      if (simulatedStatus) return
      setStatus(navigator.onLine ? "online" : "offline")
    }

    updateStatus()
    window.addEventListener("online", updateStatus)
    window.addEventListener("offline", updateStatus)

    return () => {
      window.removeEventListener("online", updateStatus)
      window.removeEventListener("offline", updateStatus)
    }
  }, [simulatedStatus])

  const handleSetSimulatedStatus = (newStatus: NetworkStatus) => {
    setSimulatedStatus(newStatus)
    setStatus(newStatus)
  }

  return (
    <NetworkContext.Provider
      value={{
        status: simulatedStatus || status,
        isOnline: (simulatedStatus || status) === "online",
        setSimulatedStatus: handleSetSimulatedStatus,
        isSimulated: simulatedStatus !== null,
      }}
    >
      {children}
    </NetworkContext.Provider>
  )
}

export const useNetwork = () => useContext(NetworkContext)

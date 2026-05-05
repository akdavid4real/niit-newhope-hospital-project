"use client"

import type React from "react"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import Sidebar from "@/components/Sidebar"
import Navbar from "@/components/Navbar"

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false)
  const router = useRouter()

  useEffect(() => {
    const token = localStorage.getItem("token")
    const sidebarCollapsed = localStorage.getItem("sidebar-collapsed")
    if (!token) {
      router.push("/auth/login")
    } else {
      setIsAuthenticated(true)
    }
    if (sidebarCollapsed) {
      setIsSidebarCollapsed(sidebarCollapsed === "true")
    }
    setIsLoading(false)
  }, [router])

  const toggleSidebarCollapse = () => {
    setIsSidebarCollapsed((current) => {
      const next = !current
      localStorage.setItem("sidebar-collapsed", String(next))
      return next
    })
  }

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-green-600"></div>
      </div>
    )
  }

  if (!isAuthenticated) {
    return null
  }

  return (
    <div className="min-h-screen bg-gray-50 flex">
      <aside
        className={`hidden lg:block fixed inset-y-0 left-0 bg-white border-r shadow-sm z-30 transition-all duration-300 ${
          isSidebarCollapsed ? "w-20" : "w-64"
        }`}
      >
        <Sidebar isCollapsed={isSidebarCollapsed} onToggleCollapse={toggleSidebarCollapse} />
      </aside>
      <div className={`flex-1 flex flex-col min-h-screen transition-all duration-300 ${isSidebarCollapsed ? "lg:ml-20" : "lg:ml-64"}`}>
        <Navbar />
        <main className="flex-1 p-4 md:p-8 max-w-6xl w-full mx-auto">
          {children}
        </main>
      </div>
    </div>
  )
}

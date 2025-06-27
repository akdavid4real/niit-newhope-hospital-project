"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Users, UserCheck, Building, CreditCard, Activity, AlertCircle } from "lucide-react"

interface DashboardStats {
  totalDoctors: number
  totalPatients: number
  totalWards: number
  totalBeds: number
  availableBeds: number
  pendingPayments: number
  totalRevenue: number
  recentAdmissions: number
}

export default function DashboardPage() {
  const [stats, setStats] = useState<DashboardStats | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    fetchDashboardStats()
  }, [])

  const fetchDashboardStats = async () => {
    try {
      const response = await fetch("/api/stats/dashboard")
      const data = await response.json()
      setStats(data)
    } catch (error) {
      console.error("Error fetching dashboard stats:", error)
    } finally {
      setIsLoading(false)
    }
  }

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {[...Array(4)].map((_, i) => (
            <Card key={i} className="animate-pulse">
              <CardHeader className="pb-2">
                <div className="h-4 bg-gray-200 rounded w-3/4"></div>
              </CardHeader>
              <CardContent>
                <div className="h-8 bg-gray-200 rounded w-1/2 mb-2"></div>
                <div className="h-3 bg-gray-200 rounded w-full"></div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-8">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
          <p className="text-gray-600">Welcome to NewHope Hospital Management System</p>
        </div>
        <Badge className="bg-green-100 text-green-800 hover:bg-green-100">System Online</Badge>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="shadow-md border-0 bg-white">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Doctors</CardTitle>
            <UserCheck className="h-4 w-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats?.totalDoctors || 0}</div>
            <p className="text-xs text-muted-foreground">Active medical staff</p>
          </CardContent>
        </Card>

        <Card className="shadow-md border-0 bg-white">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Patients</CardTitle>
            <Users className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats?.totalPatients || 0}</div>
            <p className="text-xs text-muted-foreground">Currently admitted</p>
          </CardContent>
        </Card>

        <Card className="shadow-md border-0 bg-white">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Available Beds</CardTitle>
            <Building className="h-4 w-4 text-purple-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {stats?.availableBeds || 0}/{stats?.totalBeds || 0}
            </div>
            <p className="text-xs text-muted-foreground">Bed occupancy rate</p>
          </CardContent>
        </Card>

        <Card className="shadow-md border-0 bg-white">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pending Payments</CardTitle>
            <CreditCard className="h-4 w-4 text-red-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats?.pendingPayments || 0}</div>
            <p className="text-xs text-muted-foreground">Require attention</p>
          </CardContent>
        </Card>
      </div>

      {/* Additional Info Cards */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="shadow-md border-0 bg-white">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Activity className="h-5 w-5 text-green-600" />
              <span>Hospital Activity</span>
            </CardTitle>
            <CardDescription>Recent hospital statistics</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600">Total Revenue (This Month)</span>
              <span className="font-semibold">₦{stats?.totalRevenue?.toLocaleString() || "0"}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600">Recent Admissions (24h)</span>
              <span className="font-semibold">{stats?.recentAdmissions || 0}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600">Ward Utilization</span>
              <span className="font-semibold">
                {stats?.totalBeds ? Math.round(((stats.totalBeds - stats.availableBeds) / stats.totalBeds) * 100) : 0}%
              </span>
            </div>
          </CardContent>
        </Card>

        <Card className="shadow-md border-0 bg-white">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <AlertCircle className="h-5 w-5 text-yellow-600" />
              <span>System Alerts</span>
            </CardTitle>
            <CardDescription>Important notifications</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            {stats?.pendingPayments && stats.pendingPayments > 0 && (
              <div className="flex items-center space-x-2 p-2 bg-red-50 rounded-lg">
                <AlertCircle className="h-4 w-4 text-red-600" />
                <span className="text-sm text-red-800">{stats.pendingPayments} pending payments require attention</span>
              </div>
            )}

            {stats?.availableBeds && stats.availableBeds < 10 && (
              <div className="flex items-center space-x-2 p-2 bg-yellow-50 rounded-lg">
                <AlertCircle className="h-4 w-4 text-yellow-600" />
                <span className="text-sm text-yellow-800">
                  Low bed availability: Only {stats.availableBeds} beds remaining
                </span>
              </div>
            )}

            <div className="flex items-center space-x-2 p-2 bg-green-50 rounded-lg">
              <Activity className="h-4 w-4 text-green-600" />
              <span className="text-sm text-green-800">All systems operational</span>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

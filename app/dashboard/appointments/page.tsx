"use client"

import { useEffect, useState } from "react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { CalendarCheck2, CheckCircle2, Clock3, Search, SquarePen, XCircle } from "lucide-react"
import TableView from "@/components/TableView"
import AppointmentManagementForm from "@/components/forms/AppointmentManagementForm"
import { useToast } from "@/hooks/use-toast"

interface Appointment {
  _id: string
  FirstName: string
  LastName: string
  Phone_Num: string
  Email?: string
  Preferred_Date: string
  Reason_For_Visit: string
  Notes?: string
  Status: "Pending" | "Confirmed" | "Cancelled" | "Completed"
  Assigned_DoctorID?: { _id: string; FirstName: string; LastName: string } | null
  Assigned_Ward_ID?: { _id: string; WardName: string } | null
}

const statusStyles: Record<Appointment["Status"], string> = {
  Pending: "bg-yellow-100 text-yellow-800 hover:bg-yellow-100",
  Confirmed: "bg-blue-100 text-blue-800 hover:bg-blue-100",
  Cancelled: "bg-red-100 text-red-800 hover:bg-red-100",
  Completed: "bg-green-100 text-green-800 hover:bg-green-100",
}

export default function AppointmentsPage() {
  const [appointments, setAppointments] = useState<Appointment[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState("All")
  const [selectedAppointment, setSelectedAppointment] = useState<Appointment | null>(null)
  const { toast } = useToast()

  useEffect(() => {
    fetchAppointments()
  }, [])

  const fetchAppointments = async () => {
    try {
      const response = await fetch("/api/appointments")
      const data = await response.json()
      setAppointments(Array.isArray(data) ? data : [])
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to fetch appointments",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const filteredAppointments = appointments.filter((appointment) => {
    const matchesSearch =
      `${appointment.FirstName} ${appointment.LastName}`.toLowerCase().includes(searchTerm.toLowerCase()) ||
      appointment.Phone_Num.includes(searchTerm) ||
      appointment.Reason_For_Visit.toLowerCase().includes(searchTerm.toLowerCase())

    const matchesStatus = statusFilter === "All" || appointment.Status === statusFilter

    return matchesSearch && matchesStatus
  })

  const columns = [
    {
      key: "name",
      label: "Patient",
      headerClassName: "w-[240px]",
      cellClassName: "min-w-[240px]",
      render: (_: unknown, appointment: Appointment) => (
        <div>
          <div className="font-medium text-gray-900">
            {appointment.FirstName} {appointment.LastName}
          </div>
          <div className="text-xs text-gray-500">{appointment.Phone_Num}</div>
        </div>
      ),
    },
    {
      key: "Preferred_Date",
      label: "Preferred Date",
      headerClassName: "w-[160px]",
      render: (value: string) => new Date(value).toLocaleDateString(),
    },
    {
      key: "Reason_For_Visit",
      label: "Reason",
      headerClassName: "w-[360px]",
      cellClassName: "whitespace-normal max-w-[360px]",
      render: (value: string) => {
        const preview = value.length > 110 ? `${value.slice(0, 110).trimEnd()}...` : value
        return (
          <div className="max-w-[360px] leading-6 text-sm text-gray-700" title={value}>
            {preview}
          </div>
        )
      },
    },
    {
      key: "Status",
      label: "Status",
      headerClassName: "w-[140px]",
      render: (value: Appointment["Status"]) => <Badge className={statusStyles[value]}>{value}</Badge>,
    },
    {
      key: "Assigned_DoctorID",
      label: "Assigned Doctor",
      headerClassName: "w-[220px]",
      cellClassName: "min-w-[180px] whitespace-normal",
      render: (doctor: Appointment["Assigned_DoctorID"]) =>
        doctor ? `${doctor.FirstName} ${doctor.LastName}` : "Unassigned",
    },
    {
      key: "Assigned_Ward_ID",
      label: "Ward",
      headerClassName: "w-[160px]",
      render: (ward: Appointment["Assigned_Ward_ID"]) => ward?.WardName || "Unassigned",
    },
    {
      key: "actions",
      label: "Actions",
      headerClassName: "w-[160px]",
      render: (_: unknown, appointment: Appointment) => (
        <Button size="sm" variant="outline" onClick={() => setSelectedAppointment(appointment)}>
          <SquarePen className="h-4 w-4 mr-2" />
          Manage
        </Button>
      ),
    },
  ]

  const pendingCount = appointments.filter((appointment) => appointment.Status === "Pending").length
  const confirmedCount = appointments.filter((appointment) => appointment.Status === "Confirmed").length
  const completedCount = appointments.filter((appointment) => appointment.Status === "Completed").length
  const cancelledCount = appointments.filter((appointment) => appointment.Status === "Cancelled").length

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Appointments</h1>
          <p className="text-gray-600">Review and manage visitor booking requests</p>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
        <Card>
          <CardContent className="pt-6 flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Pending</p>
              <p className="text-2xl font-bold text-gray-900">{pendingCount}</p>
            </div>
            <Clock3 className="h-5 w-5 text-yellow-600" />
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6 flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Confirmed</p>
              <p className="text-2xl font-bold text-gray-900">{confirmedCount}</p>
            </div>
            <CalendarCheck2 className="h-5 w-5 text-blue-600" />
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6 flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Completed</p>
              <p className="text-2xl font-bold text-gray-900">{completedCount}</p>
            </div>
            <CheckCircle2 className="h-5 w-5 text-green-600" />
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6 flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Cancelled</p>
              <p className="text-2xl font-bold text-gray-900">{cancelledCount}</p>
            </div>
            <XCircle className="h-5 w-5 text-red-600" />
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Appointment Requests</CardTitle>
          <CardDescription>Search incoming requests, update status, and assign staff follow-up.</CardDescription>
          <div className="flex flex-col md:flex-row gap-3">
            <div className="flex items-center space-x-2">
              <Search className="h-4 w-4 text-gray-400" />
              <Input
                placeholder="Search by name, phone, or reason..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full md:w-80"
              />
            </div>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-full md:w-48">
                <SelectValue placeholder="Filter by status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="All">All statuses</SelectItem>
                <SelectItem value="Pending">Pending</SelectItem>
                <SelectItem value="Confirmed">Confirmed</SelectItem>
                <SelectItem value="Cancelled">Cancelled</SelectItem>
                <SelectItem value="Completed">Completed</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardHeader>
        <CardContent>
          <TableView data={filteredAppointments} columns={columns} isLoading={isLoading} />
        </CardContent>
      </Card>

      {selectedAppointment && (
        <AppointmentManagementForm
          appointment={selectedAppointment}
          onClose={() => setSelectedAppointment(null)}
          onSuccess={() => {
            setSelectedAppointment(null)
            fetchAppointments()
          }}
        />
      )}
    </div>
  )
}

"use client"

import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Plus, Search, Edit, Trash2, Download } from "lucide-react"
import TableView from "@/components/TableView"
import DoctorForm from "@/components/forms/DoctorForm"
import { useToast } from "@/hooks/use-toast"

interface Doctor {
  _id: string
  FirstName: string
  LastName: string
  Phone_Num: string
  Employment_Type: string
  Ward_ID: {
    _id: string
    WardName: string
  }
}

export default function DoctorsPage() {
  const [doctors, setDoctors] = useState<Doctor[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")
  const [showForm, setShowForm] = useState(false)
  const [editingDoctor, setEditingDoctor] = useState<Doctor | null>(null)
  const { toast } = useToast()

  useEffect(() => {
    fetchDoctors()
  }, [])

  const fetchDoctors = async () => {
    try {
      const response = await fetch("/api/doctors")
      const data = await response.json()
      setDoctors(data)
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to fetch doctors",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this doctor?")) return

    try {
      const response = await fetch(`/api/doctors/${id}`, {
        method: "DELETE",
      })

      if (response.ok) {
        setDoctors(doctors.filter((d) => d._id !== id))
        toast({
          title: "Success",
          description: "Doctor deleted successfully",
        })
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to delete doctor",
        variant: "destructive",
      })
    }
  }

  const handleExportReport = async () => {
    try {
      const response = await fetch("/api/export/doctors")
      const blob = await response.blob()
      const url = window.URL.createObjectURL(blob)
      const a = document.createElement("a")
      a.href = url
      a.download = `doctors-report-${new Date().toISOString().split("T")[0]}.txt`
      document.body.appendChild(a)
      a.click()
      window.URL.revokeObjectURL(url)
      document.body.removeChild(a)

      toast({
        title: "Success",
        description: "Doctors report exported successfully",
      })
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to export report",
        variant: "destructive",
      })
    }
  }

  const filteredDoctors = doctors.filter(
    (doctor) =>
      `${doctor.FirstName} ${doctor.LastName}`.toLowerCase().includes(searchTerm.toLowerCase()) ||
      doctor.Phone_Num.includes(searchTerm) ||
      doctor.Ward_ID?.WardName.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  const columns = [
    { key: "FirstName", label: "First Name" },
    { key: "LastName", label: "Last Name" },
    { key: "Phone_Num", label: "Phone" },
    {
      key: "Employment_Type",
      label: "Employment Type",
      render: (value: string) => <Badge variant={value === "Resident" ? "default" : "secondary"}>{value}</Badge>,
    },
    {
      key: "Ward_ID",
      label: "Ward",
      render: (ward: any) => ward?.WardName || "Unassigned",
    },
    {
      key: "actions",
      label: "Actions",
      render: (_: any, doctor: Doctor) => (
        <div className="flex space-x-2">
          <Button
            size="sm"
            variant="outline"
            onClick={() => {
              setEditingDoctor(doctor)
              setShowForm(true)
            }}
          >
            <Edit className="h-4 w-4" />
          </Button>
          <Button size="sm" variant="outline" onClick={() => handleDelete(doctor._id)}>
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
      ),
    },
  ]

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Doctor Management</h1>
          <p className="text-gray-600">Manage medical staff and assignments</p>
        </div>
        <div className="flex space-x-2">
          <Button variant="outline" onClick={handleExportReport}>
            <Download className="h-4 w-4 mr-2" />
            Export Report
          </Button>
          <Button
            onClick={() => {
              setEditingDoctor(null)
              setShowForm(true)
            }}
            className="bg-green-600 hover:bg-green-700"
          >
            <Plus className="h-4 w-4 mr-2" />
            Add Doctor
          </Button>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Medical Staff</CardTitle>
          <CardDescription>View and manage all doctors and medical staff</CardDescription>
          <div className="flex items-center space-x-2">
            <Search className="h-4 w-4 text-gray-400" />
            <Input
              placeholder="Search doctors by name, phone, or ward..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="max-w-sm"
            />
          </div>
        </CardHeader>
        <CardContent>
          <TableView data={filteredDoctors} columns={columns} isLoading={isLoading} />
        </CardContent>
      </Card>

      {showForm && (
        <DoctorForm
          doctor={editingDoctor}
          onClose={() => {
            setShowForm(false)
            setEditingDoctor(null)
          }}
          onSuccess={() => {
            fetchDoctors()
            setShowForm(false)
            setEditingDoctor(null)
          }}
        />
      )}
    </div>
  )
}

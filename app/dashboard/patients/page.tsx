"use client"

import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Plus, Search, Edit, Trash2, UserMinus } from "lucide-react"
import TableView from "@/components/TableView"
import PatientForm from "@/components/forms/PatientForm"
import { useToast } from "@/hooks/use-toast"

interface Patient {
  _id: string
  FirstName: string
  LastName: string
  Age: number
  Gender: string
  Phone_Num: string
  Address: string
  Blood_Grp: string
  Admit_Date: string
  Discharge_Date?: string
  Status: string
}

export default function PatientsPage() {
  const [patients, setPatients] = useState<Patient[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")
  const [showForm, setShowForm] = useState(false)
  const [editingPatient, setEditingPatient] = useState<Patient | null>(null)
  const { toast } = useToast()

  useEffect(() => {
    fetchPatients()
  }, [])

  const fetchPatients = async () => {
    try {
      const response = await fetch("/api/patients")
      const data = await response.json()
      setPatients(data)
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to fetch patients",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this patient?")) return

    try {
      const response = await fetch(`/api/patients/${id}`, {
        method: "DELETE",
      })

      if (response.ok) {
        setPatients(patients.filter((p) => p._id !== id))
        toast({
          title: "Success",
          description: "Patient deleted successfully",
        })
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to delete patient",
        variant: "destructive",
      })
    }
  }

  const handleDischarge = async (id: string) => {
    try {
      const response = await fetch(`/api/patients/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          Status: "Discharged",
          Discharge_Date: new Date().toISOString().split("T")[0],
        }),
      })

      if (response.ok) {
        fetchPatients()
        toast({
          title: "Success",
          description: "Patient discharged successfully",
        })
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to discharge patient",
        variant: "destructive",
      })
    }
  }

  const filteredPatients = patients.filter(
    (patient) =>
      `${patient.FirstName} ${patient.LastName}`.toLowerCase().includes(searchTerm.toLowerCase()) ||
      patient.Phone_Num.includes(searchTerm),
  )

  const columns = [
    { key: "FirstName", label: "First Name" },
    { key: "LastName", label: "Last Name" },
    { key: "Age", label: "Age" },
    { key: "Gender", label: "Gender" },
    { key: "Phone_Num", label: "Phone" },
    { key: "Blood_Grp", label: "Blood Group" },
    {
      key: "Status",
      label: "Status",
      render: (value: string) => <Badge variant={value === "Admitted" ? "default" : "secondary"}>{value}</Badge>,
    },
    {
      key: "actions",
      label: "Actions",
      render: (_: any, patient: Patient) => (
        <div className="flex space-x-2">
          <Button
            size="sm"
            variant="outline"
            onClick={() => {
              setEditingPatient(patient)
              setShowForm(true)
            }}
          >
            <Edit className="h-4 w-4" />
          </Button>
          {patient.Status === "Admitted" && (
            <Button size="sm" variant="outline" onClick={() => handleDischarge(patient._id)}>
              <UserMinus className="h-4 w-4" />
            </Button>
          )}
          <Button size="sm" variant="outline" onClick={() => handleDelete(patient._id)}>
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
          <h1 className="text-3xl font-bold text-gray-900">Patient Management</h1>
          <p className="text-gray-600">Manage patient admissions and records</p>
        </div>
        <Button
          onClick={() => {
            setEditingPatient(null)
            setShowForm(true)
          }}
          className="bg-green-600 hover:bg-green-700"
        >
          <Plus className="h-4 w-4 mr-2" />
          Admit Patient
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Patient Records</CardTitle>
          <CardDescription>View and manage all patient information</CardDescription>
          <div className="flex items-center space-x-2">
            <Search className="h-4 w-4 text-gray-400" />
            <Input
              placeholder="Search patients by name or phone..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="max-w-sm"
            />
          </div>
        </CardHeader>
        <CardContent>
          <TableView data={filteredPatients} columns={columns} isLoading={isLoading} />
        </CardContent>
      </Card>

      {showForm && (
        <PatientForm
          patient={editingPatient}
          onClose={() => {
            setShowForm(false)
            setEditingPatient(null)
          }}
          onSuccess={() => {
            fetchPatients()
            setShowForm(false)
            setEditingPatient(null)
          }}
        />
      )}
    </div>
  )
}

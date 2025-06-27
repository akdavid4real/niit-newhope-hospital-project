"use client"

import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Plus, Search, Edit, Trash2, FileText } from "lucide-react"
import TableView from "@/components/TableView"
import HistoryForm from "@/components/forms/HistoryForm"
import { useToast } from "@/hooks/use-toast"

interface MedicalHistory {
  _id: string
  Patient_ID: {
    _id: string
    FirstName: string
    LastName: string
  }
  Doctor_ID: {
    _id: string
    FirstName: string
    LastName: string
  }
  Disease: string
  OriginalWard: {
    _id: string
    WardName: string
  }
  DischargeWard?: {
    _id: string
    WardName: string
  }
  Treatment: string
  createdAt: string
}

export default function HistoryPage() {
  const [history, setHistory] = useState<MedicalHistory[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")
  const [showForm, setShowForm] = useState(false)
  const [editingHistory, setEditingHistory] = useState<MedicalHistory | null>(null)
  const { toast } = useToast()

  useEffect(() => {
    fetchHistory()
  }, [])

  const fetchHistory = async () => {
    try {
      const response = await fetch("/api/history")
      const data = await response.json()
      setHistory(data)
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to fetch medical history",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this medical record?")) return

    try {
      const response = await fetch(`/api/history/${id}`, {
        method: "DELETE",
      })

      if (response.ok) {
        setHistory(history.filter((h) => h._id !== id))
        toast({
          title: "Success",
          description: "Medical record deleted successfully",
        })
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to delete medical record",
        variant: "destructive",
      })
    }
  }

  const filteredHistory = history.filter(
    (record) =>
      `${record.Patient_ID?.FirstName} ${record.Patient_ID?.LastName}`
        .toLowerCase()
        .includes(searchTerm.toLowerCase()) ||
      `${record.Doctor_ID?.FirstName} ${record.Doctor_ID?.LastName}`.toLowerCase().includes(searchTerm.toLowerCase()) ||
      record.Disease.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  const columns = [
    {
      key: "Patient_ID",
      label: "Patient",
      render: (patient: any) => (patient ? `${patient.FirstName} ${patient.LastName}` : "Unknown"),
    },
    {
      key: "Doctor_ID",
      label: "Doctor",
      render: (doctor: any) => (doctor ? `Dr. ${doctor.FirstName} ${doctor.LastName}` : "Unknown"),
    },
    { key: "Disease", label: "Disease/Condition" },
    { key: "Treatment", label: "Treatment" },
    {
      key: "OriginalWard",
      label: "Original Ward",
      render: (ward: any) => <Badge variant="outline">{ward?.WardName || "N/A"}</Badge>,
    },
    {
      key: "DischargeWard",
      label: "Discharge Ward",
      render: (ward: any) =>
        ward ? <Badge variant="secondary">{ward.WardName}</Badge> : <Badge variant="outline">Same Ward</Badge>,
    },
    {
      key: "createdAt",
      label: "Date",
      render: (date: string) => new Date(date).toLocaleDateString(),
    },
    {
      key: "actions",
      label: "Actions",
      render: (_: any, record: MedicalHistory) => (
        <div className="flex space-x-2">
          <Button
            size="sm"
            variant="outline"
            onClick={() => {
              setEditingHistory(record)
              setShowForm(true)
            }}
          >
            <Edit className="h-4 w-4" />
          </Button>
          <Button size="sm" variant="outline" onClick={() => handleDelete(record._id)}>
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
          <h1 className="text-3xl font-bold text-gray-900">Medical History</h1>
          <p className="text-gray-600">Track patient medical records and treatments</p>
        </div>
        <Button
          onClick={() => {
            setEditingHistory(null)
            setShowForm(true)
          }}
          className="bg-green-600 hover:bg-green-700"
        >
          <Plus className="h-4 w-4 mr-2" />
          Add Record
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <FileText className="h-5 w-5" />
            <span>Medical Records</span>
          </CardTitle>
          <CardDescription>View and manage patient medical history and treatments</CardDescription>
          <div className="flex items-center space-x-2">
            <Search className="h-4 w-4 text-gray-400" />
            <Input
              placeholder="Search by patient, doctor, or disease..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="max-w-sm"
            />
          </div>
        </CardHeader>
        <CardContent>
          <TableView data={filteredHistory} columns={columns} isLoading={isLoading} />
        </CardContent>
      </Card>

      {showForm && (
        <HistoryForm
          history={editingHistory}
          onClose={() => {
            setShowForm(false)
            setEditingHistory(null)
          }}
          onSuccess={() => {
            fetchHistory()
            setShowForm(false)
            setEditingHistory(null)
          }}
        />
      )}
    </div>
  )
}

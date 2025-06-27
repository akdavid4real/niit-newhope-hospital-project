"use client"

import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Plus, Search, Edit, Trash2, Building, Users } from "lucide-react"
import TableView from "@/components/TableView"
import WardForm from "@/components/forms/WardForm"
import { useToast } from "@/hooks/use-toast"

interface Ward {
  _id: string
  WardName: string
  TotalBeds: number
  AvailableBeds: number
  WardType: string
  doctorCount?: number
}

export default function WardsPage() {
  const [wards, setWards] = useState<Ward[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")
  const [showForm, setShowForm] = useState(false)
  const [editingWard, setEditingWard] = useState<Ward | null>(null)
  const { toast } = useToast()

  useEffect(() => {
    fetchWards()
  }, [])

  const fetchWards = async () => {
    try {
      const response = await fetch("/api/wards/availability")
      const data = await response.json()
      setWards(data)
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to fetch wards",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this ward?")) return

    try {
      const response = await fetch(`/api/wards/${id}`, {
        method: "DELETE",
      })

      if (response.ok) {
        setWards(wards.filter((w) => w._id !== id))
        toast({
          title: "Success",
          description: "Ward deleted successfully",
        })
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to delete ward",
        variant: "destructive",
      })
    }
  }

  const filteredWards = wards.filter(
    (ward) =>
      ward.WardName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      ward.WardType.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  const columns = [
    { key: "WardName", label: "Ward Name" },
    {
      key: "WardType",
      label: "Type",
      render: (value: string) => <Badge variant="outline">{value}</Badge>,
    },
    { key: "TotalBeds", label: "Total Beds" },
    {
      key: "AvailableBeds",
      label: "Available Beds",
      render: (value: number, ward: Ward) => (
        <Badge variant={value > 0 ? "default" : "destructive"}>
          {value}/{ward.TotalBeds}
        </Badge>
      ),
    },
    {
      key: "doctorCount",
      label: "Assigned Doctors",
      render: (value: number) => (
        <div className="flex items-center space-x-1">
          <Users className="h-4 w-4" />
          <span>{value || 0}</span>
        </div>
      ),
    },
    {
      key: "actions",
      label: "Actions",
      render: (_: any, ward: Ward) => (
        <div className="flex space-x-2">
          <Button
            size="sm"
            variant="outline"
            onClick={() => {
              setEditingWard(ward)
              setShowForm(true)
            }}
          >
            <Edit className="h-4 w-4" />
          </Button>
          <Button size="sm" variant="outline" onClick={() => handleDelete(ward._id)}>
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
          <h1 className="text-3xl font-bold text-gray-900">Ward Management</h1>
          <p className="text-gray-600">Manage hospital wards and bed availability</p>
        </div>
        <Button
          onClick={() => {
            setEditingWard(null)
            setShowForm(true)
          }}
          className="bg-green-600 hover:bg-green-700"
        >
          <Plus className="h-4 w-4 mr-2" />
          Add Ward
        </Button>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Wards</CardTitle>
            <Building className="h-4 w-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{wards.length}</div>
            <p className="text-xs text-muted-foreground">Active hospital wards</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Beds</CardTitle>
            <Building className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{wards.reduce((sum, ward) => sum + ward.TotalBeds, 0)}</div>
            <p className="text-xs text-muted-foreground">Hospital bed capacity</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Available Beds</CardTitle>
            <Building className="h-4 w-4 text-purple-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{wards.reduce((sum, ward) => sum + ward.AvailableBeds, 0)}</div>
            <p className="text-xs text-muted-foreground">Ready for admission</p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Ward Information</CardTitle>
          <CardDescription>View and manage all hospital wards</CardDescription>
          <div className="flex items-center space-x-2">
            <Search className="h-4 w-4 text-gray-400" />
            <Input
              placeholder="Search wards by name or type..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="max-w-sm"
            />
          </div>
        </CardHeader>
        <CardContent>
          <TableView data={filteredWards} columns={columns} isLoading={isLoading} />
        </CardContent>
      </Card>

      {showForm && (
        <WardForm
          ward={editingWard}
          onClose={() => {
            setShowForm(false)
            setEditingWard(null)
          }}
          onSuccess={() => {
            fetchWards()
            setShowForm(false)
            setEditingWard(null)
          }}
        />
      )}
    </div>
  )
}

"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { X } from "lucide-react"
import { useToast } from "@/hooks/use-toast"

interface Doctor {
  _id?: string
  FirstName: string
  LastName: string
  Phone_Num: string
  Employment_Type: string
  Ward_ID: string
}

interface Ward {
  _id: string
  WardName: string
}

interface DoctorFormProps {
  doctor?: Doctor | null
  onClose: () => void
  onSuccess: () => void
}

export default function DoctorForm({ doctor, onClose, onSuccess }: DoctorFormProps) {
  const [formData, setFormData] = useState<Doctor>({
    FirstName: "",
    LastName: "",
    Phone_Num: "",
    Employment_Type: "",
    Ward_ID: "",
  })
  const [wards, setWards] = useState<Ward[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const { toast } = useToast()

  useEffect(() => {
    fetchWards()
    if (doctor) {
      setFormData({
        ...doctor,
        Ward_ID: typeof doctor.Ward_ID === "object" ? doctor.Ward_ID._id : doctor.Ward_ID,
      })
    }
  }, [doctor])

  const fetchWards = async () => {
    try {
      const response = await fetch("/api/wards")
      const data = await response.json()
      setWards(data)
    } catch (error) {
      console.error("Error fetching wards:", error)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    try {
      const url = doctor ? `/api/doctors/${doctor._id}` : "/api/doctors"
      const method = doctor ? "PUT" : "POST"

      const response = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      })

      const data = await response.json()

      if (response.ok) {
        toast({
          title: "Success",
          description: doctor ? "Doctor updated successfully" : "Doctor added successfully",
        })
        onSuccess()
      } else {
        toast({
          title: "Error",
          description: data.message || "Something went wrong",
          variant: "destructive",
        })
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to save doctor",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <Card className="w-full max-w-lg">
        <CardHeader>
          <div className="flex justify-between items-center">
            <div>
              <CardTitle>{doctor ? "Edit Doctor" : "Add New Doctor"}</CardTitle>
              <CardDescription>{doctor ? "Update doctor information" : "Enter doctor details"}</CardDescription>
            </div>
            <Button variant="ghost" size="icon" onClick={onClose}>
              <X className="h-4 w-4" />
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="firstName">First Name *</Label>
                <Input
                  id="firstName"
                  value={formData.FirstName}
                  onChange={(e) => setFormData({ ...formData, FirstName: e.target.value })}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="lastName">Last Name *</Label>
                <Input
                  id="lastName"
                  value={formData.LastName}
                  onChange={(e) => setFormData({ ...formData, LastName: e.target.value })}
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="phone">Phone Number *</Label>
              <Input
                id="phone"
                value={formData.Phone_Num}
                onChange={(e) => setFormData({ ...formData, Phone_Num: e.target.value })}
                placeholder="+234 XXX XXX XXXX"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="employmentType">Employment Type *</Label>
              <Select
                value={formData.Employment_Type}
                onValueChange={(value) => setFormData({ ...formData, Employment_Type: value })}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select employment type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Resident">Resident</SelectItem>
                  <SelectItem value="Visiting">Visiting</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="ward">Assigned Ward *</Label>
              <Select value={formData.Ward_ID} onValueChange={(value) => setFormData({ ...formData, Ward_ID: value })}>
                <SelectTrigger>
                  <SelectValue placeholder="Select ward" />
                </SelectTrigger>
                <SelectContent>
                  {wards.map((ward) => (
                    <SelectItem key={ward._id} value={ward._id}>
                      {ward.WardName}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="flex justify-end space-x-2 pt-4">
              <Button type="button" variant="outline" onClick={onClose}>
                Cancel
              </Button>
              <Button type="submit" disabled={isLoading} className="bg-green-600 hover:bg-green-700">
                {isLoading ? "Saving..." : doctor ? "Update Doctor" : "Add Doctor"}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}

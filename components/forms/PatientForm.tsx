"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { X } from "lucide-react"
import { useToast } from "@/hooks/use-toast"

interface Patient {
  _id?: string
  FirstName: string
  LastName: string
  Age: number
  Height?: number
  Weight?: number
  Gender: string
  Phone_Num: string
  Address: string
  Blood_Grp: string
  Admit_Date: string
  Discharge_Date?: string
  Status: string
  Treatment_Type: string
  DoctorID: string
  Ward_ID: string
}

interface PatientFormProps {
  patient?: Patient | null
  onClose: () => void
  onSuccess: () => void
}

export default function PatientForm({ patient, onClose, onSuccess }: PatientFormProps) {
  const [formData, setFormData] = useState<Patient>({
    FirstName: "",
    LastName: "",
    Age: 0,
    Height: 0,
    Weight: 0,
    Gender: "",
    Phone_Num: "",
    Address: "",
    Blood_Grp: "",
    Admit_Date: new Date().toISOString().split("T")[0],
    Status: "Admitted",
    Treatment_Type: "",
    DoctorID: "",
    Ward_ID: "",
  })
  const [doctors, setDoctors] = useState<any[]>([])
  const [wards, setWards] = useState<any[]>([])
  const { toast } = useToast()

  useEffect(() => {
    if (patient) {
      setFormData({
        ...patient,
        Admit_Date: patient.Admit_Date ? new Date(patient.Admit_Date).toISOString().split("T")[0] : "",
        Discharge_Date: patient.Discharge_Date ? new Date(patient.Discharge_Date).toISOString().split("T")[0] : undefined,
      })
    }
    fetch("/api/doctors").then(res => res.json()).then(setDoctors)
    fetch("/api/wards").then(res => res.json()).then(setWards)
  }, [patient])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    try {
      const url = patient ? `/api/patients/${patient._id}` : "/api/patients"
      const method = patient ? "PUT" : "POST"

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
          description: patient ? "Patient updated successfully" : "Patient admitted successfully",
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
        description: "Failed to save patient",
        variant: "destructive",
      })
    }
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <Card className="w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <CardHeader>
          <div className="flex justify-between items-center">
            <div>
              <CardTitle>{patient ? "Edit Patient" : "Admit New Patient"}</CardTitle>
              <CardDescription>
                {patient ? "Update patient information" : "Enter patient details for admission"}
              </CardDescription>
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

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label htmlFor="age">Age *</Label>
                <Input
                  id="age"
                  type="number"
                  min="0"
                  value={formData.Age}
                  onChange={(e) => setFormData({ ...formData, Age: Number.parseInt(e.target.value) || 0 })}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="gender">Gender *</Label>
                <Select value={formData.Gender} onValueChange={(value) => setFormData({ ...formData, Gender: value })}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select gender" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Male">Male</SelectItem>
                    <SelectItem value="Female">Female</SelectItem>
                    <SelectItem value="Other">Other</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="bloodGroup">Blood Group *</Label>
                <Select
                  value={formData.Blood_Grp}
                  onValueChange={(value) => setFormData({ ...formData, Blood_Grp: value })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select blood group" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="A+">A+</SelectItem>
                    <SelectItem value="A-">A-</SelectItem>
                    <SelectItem value="B+">B+</SelectItem>
                    <SelectItem value="B-">B-</SelectItem>
                    <SelectItem value="AB+">AB+</SelectItem>
                    <SelectItem value="AB-">AB-</SelectItem>
                    <SelectItem value="O+">O+</SelectItem>
                    <SelectItem value="O-">O-</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="height">Height (cm)</Label>
                <Input
                  id="height"
                  type="number"
                  min="0"
                  value={formData.Height || ""}
                  onChange={(e) => setFormData({ ...formData, Height: Number(e.target.value) })}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="weight">Weight (kg)</Label>
                <Input
                  id="weight"
                  type="number"
                  min="0"
                  value={formData.Weight || ""}
                  onChange={(e) => setFormData({ ...formData, Weight: Number(e.target.value) })}
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
              <Label htmlFor="address">Address *</Label>
              <Textarea
                id="address"
                value={formData.Address}
                onChange={(e) => setFormData({ ...formData, Address: e.target.value })}
                placeholder="Enter full address"
                required
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="admitDate">Admit Date *</Label>
                <Input
                  id="admitDate"
                  type="date"
                  value={formData.Admit_Date}
                  onChange={(e) => setFormData({ ...formData, Admit_Date: e.target.value })}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="status">Status</Label>
                <Select value={formData.Status} onValueChange={(value) => setFormData({ ...formData, Status: value })}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Admitted">Admitted</SelectItem>
                    <SelectItem value="Discharged">Discharged</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            {formData.Status === "Discharged" && (
              <div className="space-y-2">
                <Label htmlFor="dischargeDate">Discharge Date</Label>
                <Input
                  id="dischargeDate"
                  type="date"
                  value={formData.Discharge_Date || ""}
                  onChange={(e) => setFormData({ ...formData, Discharge_Date: e.target.value })}
                />
              </div>
            )}

            <div className="space-y-2">
              <Label htmlFor="treatmentType">Treatment Type *</Label>
              <Input
                id="treatmentType"
                value={formData.Treatment_Type}
                onChange={(e) => setFormData({ ...formData, Treatment_Type: e.target.value })}
                required
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="doctor">Doctor *</Label>
                <Select
                  value={formData.DoctorID}
                  onValueChange={(value) => setFormData({ ...formData, DoctorID: value })}
                  required
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select doctor" />
                  </SelectTrigger>
                  <SelectContent>
                    {doctors.map((doc) => (
                      <SelectItem key={doc._id} value={doc._id}>
                        {doc.FirstName} {doc.LastName}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="ward">Ward *</Label>
                <Select
                  value={formData.Ward_ID}
                  onValueChange={(value) => setFormData({ ...formData, Ward_ID: value })}
                  required
                >
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
            </div>

            <div className="flex justify-end space-x-2 pt-4">
              <Button type="button" variant="outline" onClick={onClose}>
                Cancel
              </Button>
              <Button type="submit" className="bg-green-600 hover:bg-green-700">
                {patient ? "Update Patient" : "Admit Patient"}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}

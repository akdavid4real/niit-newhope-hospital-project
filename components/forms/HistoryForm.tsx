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

interface MedicalHistory {
  _id?: string
  Patient_ID: string
  Doctor_ID: string
  Disease: string
  OriginalWard: string
  DischargeWard?: string
  Treatment: string
}

interface Patient {
  _id: string
  FirstName: string
  LastName: string
}

interface Doctor {
  _id: string
  FirstName: string
  LastName: string
}

interface Ward {
  _id: string
  WardName: string
}

interface HistoryFormProps {
  history?: MedicalHistory | null
  onClose: () => void
  onSuccess: () => void
}

export default function HistoryForm({ history, onClose, onSuccess }: HistoryFormProps) {
  const [formData, setFormData] = useState<MedicalHistory>({
    Patient_ID: "",
    Doctor_ID: "",
    Disease: "",
    OriginalWard: "",
    DischargeWard: "",
    Treatment: "",
  })
  const [patients, setPatients] = useState<Patient[]>([])
  const [doctors, setDoctors] = useState<Doctor[]>([])
  const [wards, setWards] = useState<Ward[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const { toast } = useToast()

  useEffect(() => {
    fetchData()
    if (history) {
      setFormData({
        ...history,
        Patient_ID: typeof history.Patient_ID === "object" ? history.Patient_ID._id : history.Patient_ID,
        Doctor_ID: typeof history.Doctor_ID === "object" ? history.Doctor_ID._id : history.Doctor_ID,
        OriginalWard: typeof history.OriginalWard === "object" ? history.OriginalWard._id : history.OriginalWard,
        DischargeWard: typeof history.DischargeWard === "object" ? history.DischargeWard?._id : history.DischargeWard,
      })
    }
  }, [history])

  const fetchData = async () => {
    try {
      const [patientsRes, doctorsRes, wardsRes] = await Promise.all([
        fetch("/api/patients"),
        fetch("/api/doctors"),
        fetch("/api/wards"),
      ])

      const [patientsData, doctorsData, wardsData] = await Promise.all([
        patientsRes.json(),
        doctorsRes.json(),
        wardsRes.json(),
      ])

      setPatients(patientsData)
      setDoctors(doctorsData)
      setWards(wardsData)
    } catch (error) {
      console.error("Error fetching data:", error)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    try {
      const url = history ? `/api/history/${history._id}` : "/api/history"
      const method = history ? "PUT" : "POST"

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
          description: history ? "Medical record updated successfully" : "Medical record added successfully",
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
        description: "Failed to save medical record",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <Card className="w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <CardHeader>
          <div className="flex justify-between items-center">
            <div>
              <CardTitle>{history ? "Edit Medical Record" : "Add Medical Record"}</CardTitle>
              <CardDescription>
                {history ? "Update medical history information" : "Enter patient medical history"}
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
                <Label htmlFor="patient">Patient *</Label>
                <Select
                  value={formData.Patient_ID}
                  onValueChange={(value) => setFormData({ ...formData, Patient_ID: value })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select patient" />
                  </SelectTrigger>
                  <SelectContent>
                    {patients.map((patient) => (
                      <SelectItem key={patient._id} value={patient._id}>
                        {patient.FirstName} {patient.LastName}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="doctor">Doctor *</Label>
                <Select
                  value={formData.Doctor_ID}
                  onValueChange={(value) => setFormData({ ...formData, Doctor_ID: value })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select doctor" />
                  </SelectTrigger>
                  <SelectContent>
                    {doctors.map((doctor) => (
                      <SelectItem key={doctor._id} value={doctor._id}>
                        Dr. {doctor.FirstName} {doctor.LastName}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="disease">Disease/Condition *</Label>
              <Input
                id="disease"
                value={formData.Disease}
                onChange={(e) => setFormData({ ...formData, Disease: e.target.value })}
                placeholder="Enter disease or medical condition"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="treatment">Treatment *</Label>
              <Textarea
                id="treatment"
                value={formData.Treatment}
                onChange={(e) => setFormData({ ...formData, Treatment: e.target.value })}
                placeholder="Enter treatment details"
                required
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="originalWard">Original Ward *</Label>
                <Select
                  value={formData.OriginalWard}
                  onValueChange={(value) => setFormData({ ...formData, OriginalWard: value })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select original ward" />
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
              <div className="space-y-2">
                <Label htmlFor="dischargeWard">Discharge Ward (Optional)</Label>
                <Select
                  value={formData.DischargeWard || "same"}
                  onValueChange={(value) =>
                    setFormData({ ...formData, DischargeWard: value === "same" ? undefined : value })
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select discharge ward" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="same">Same as original ward</SelectItem>
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
              <Button type="submit" disabled={isLoading} className="bg-green-600 hover:bg-green-700">
                {isLoading ? "Saving..." : history ? "Update Record" : "Add Record"}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}

"use client"

import type React from "react"

import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { X } from "lucide-react"
import { useToast } from "@/hooks/use-toast"

interface Appointment {
  _id: string
  FirstName: string
  LastName: string
  Phone_Num: string
  Email?: string
  Age?: number
  Gender?: string
  Preferred_Date: string
  Reason_For_Visit: string
  Notes?: string
  Status: string
  Assigned_DoctorID?: string | { _id: string; FirstName: string; LastName: string } | null
  Assigned_Ward_ID?: string | { _id: string; WardName: string } | null
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

interface AppointmentManagementFormProps {
  appointment: Appointment
  onClose: () => void
  onSuccess: () => void
}

const UNASSIGNED = "__unassigned__"

export default function AppointmentManagementForm({
  appointment,
  onClose,
  onSuccess,
}: AppointmentManagementFormProps) {
  const [formData, setFormData] = useState({
    Preferred_Date: "",
    Reason_For_Visit: "",
    Notes: "",
    Status: "Pending",
    Assigned_DoctorID: UNASSIGNED,
    Assigned_Ward_ID: UNASSIGNED,
  })
  const [doctors, setDoctors] = useState<Doctor[]>([])
  const [wards, setWards] = useState<Ward[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const { toast } = useToast()

  useEffect(() => {
    setFormData({
      Preferred_Date: appointment.Preferred_Date ? new Date(appointment.Preferred_Date).toISOString().split("T")[0] : "",
      Reason_For_Visit: appointment.Reason_For_Visit || "",
      Notes: appointment.Notes || "",
      Status: appointment.Status || "Pending",
      Assigned_DoctorID:
        typeof appointment.Assigned_DoctorID === "object" && appointment.Assigned_DoctorID?._id
          ? appointment.Assigned_DoctorID._id
          : appointment.Assigned_DoctorID || UNASSIGNED,
      Assigned_Ward_ID:
        typeof appointment.Assigned_Ward_ID === "object" && appointment.Assigned_Ward_ID?._id
          ? appointment.Assigned_Ward_ID._id
          : appointment.Assigned_Ward_ID || UNASSIGNED,
    })

    fetch("/api/doctors").then((res) => res.json()).then((data) => setDoctors(Array.isArray(data) ? data : []))
    fetch("/api/wards").then((res) => res.json()).then((data) => setWards(Array.isArray(data) ? data : []))
  }, [appointment])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    try {
      const response = await fetch(`/api/appointments/${appointment._id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ...formData,
          Assigned_DoctorID: formData.Assigned_DoctorID === UNASSIGNED ? null : formData.Assigned_DoctorID,
          Assigned_Ward_ID: formData.Assigned_Ward_ID === UNASSIGNED ? null : formData.Assigned_Ward_ID,
        }),
      })

      const data = await response.json()

      if (response.ok) {
        toast({
          title: "Success",
          description: "Appointment updated successfully",
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
        description: "Failed to update appointment",
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
          <div className="flex justify-between items-center gap-4">
            <div>
              <CardTitle>Manage Appointment</CardTitle>
              <CardDescription>
                {appointment.FirstName} {appointment.LastName} requested an appointment
              </CardDescription>
            </div>
            <Button variant="ghost" size="icon" onClick={onClose}>
              <X className="h-4 w-4" />
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6 text-sm">
            <div>
              <p className="font-medium text-gray-900">Phone</p>
              <p className="text-gray-600">{appointment.Phone_Num}</p>
            </div>
            <div>
              <p className="font-medium text-gray-900">Email</p>
              <p className="text-gray-600">{appointment.Email || "Not provided"}</p>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="preferredDate">Preferred Date *</Label>
                <Input
                  id="preferredDate"
                  type="date"
                  value={formData.Preferred_Date}
                  onChange={(e) => setFormData({ ...formData, Preferred_Date: e.target.value })}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="status">Status *</Label>
                <Select value={formData.Status} onValueChange={(value) => setFormData({ ...formData, Status: value })}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Pending">Pending</SelectItem>
                    <SelectItem value="Confirmed">Confirmed</SelectItem>
                    <SelectItem value="Cancelled">Cancelled</SelectItem>
                    <SelectItem value="Completed">Completed</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="doctor">Assigned Doctor</Label>
                <Select
                  value={formData.Assigned_DoctorID}
                  onValueChange={(value) => setFormData({ ...formData, Assigned_DoctorID: value })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select doctor" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value={UNASSIGNED}>Unassigned</SelectItem>
                    {doctors.map((doctor) => (
                      <SelectItem key={doctor._id} value={doctor._id}>
                        {doctor.FirstName} {doctor.LastName}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="ward">Assigned Ward</Label>
                <Select
                  value={formData.Assigned_Ward_ID}
                  onValueChange={(value) => setFormData({ ...formData, Assigned_Ward_ID: value })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select ward" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value={UNASSIGNED}>Unassigned</SelectItem>
                    {wards.map((ward) => (
                      <SelectItem key={ward._id} value={ward._id}>
                        {ward.WardName}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="reason">Reason For Visit *</Label>
              <Textarea
                id="reason"
                value={formData.Reason_For_Visit}
                onChange={(e) => setFormData({ ...formData, Reason_For_Visit: e.target.value })}
                rows={4}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="notes">Staff Notes</Label>
              <Textarea
                id="notes"
                value={formData.Notes}
                onChange={(e) => setFormData({ ...formData, Notes: e.target.value })}
                rows={4}
                placeholder="Add follow-up notes, callback outcomes, or next steps"
              />
            </div>

            <div className="flex justify-end space-x-2 pt-4">
              <Button type="button" variant="outline" onClick={onClose}>
                Cancel
              </Button>
              <Button type="submit" disabled={isLoading} className="bg-green-600 hover:bg-green-700">
                {isLoading ? "Saving..." : "Update Appointment"}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}

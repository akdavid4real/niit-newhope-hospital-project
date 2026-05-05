"use client"

import type React from "react"

import { useState } from "react"
import Link from "next/link"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { CalendarDays, CheckCircle2, ChevronLeft, Heart, PhoneCall } from "lucide-react"
import { useToast } from "@/hooks/use-toast"

type AppointmentFormData = {
  FirstName: string
  LastName: string
  Phone_Num: string
  Email: string
  Age: string
  Gender: string
  Preferred_Date: string
  Reason_For_Visit: string
  Notes: string
}

const initialFormData: AppointmentFormData = {
  FirstName: "",
  LastName: "",
  Phone_Num: "",
  Email: "",
  Age: "",
  Gender: "",
  Preferred_Date: "",
  Reason_For_Visit: "",
  Notes: "",
}

export default function AppointmentsPage() {
  const [formData, setFormData] = useState<AppointmentFormData>(initialFormData)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isSubmitted, setIsSubmitted] = useState(false)
  const { toast } = useToast()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    try {
      const response = await fetch("/api/appointments", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ...formData,
          Age: formData.Age ? Number(formData.Age) : undefined,
          Email: formData.Email || undefined,
          Gender: formData.Gender || undefined,
          Notes: formData.Notes || undefined,
        }),
      })

      const data = await response.json()

      if (response.ok) {
        setIsSubmitted(true)
        setFormData(initialFormData)
      } else {
        toast({
          title: "Unable to book appointment",
          description: data.message || "Please review your details and try again.",
          variant: "destructive",
        })
      }
    } catch (error) {
      toast({
        title: "Unable to book appointment",
        description: "Please try again in a moment.",
        variant: "destructive",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-white to-emerald-50">
      <header className="border-b bg-white/90 backdrop-blur">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-5 flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="bg-green-600 p-2 rounded-lg">
              <Heart className="h-6 w-6 text-white" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-gray-900">NewHope Hospital</h1>
              <p className="text-sm text-gray-600">Appointment Request Desk</p>
            </div>
          </div>
          <Button asChild variant="outline">
            <Link href="/">
              <ChevronLeft className="h-4 w-4" />
              Back Home
            </Link>
          </Button>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-[1.1fr_0.9fr] gap-8 items-start">
          <section className="space-y-6">
            <Badge className="bg-green-100 text-green-800 hover:bg-green-100">Public Booking Now Available</Badge>
            <div className="space-y-4">
              <h2 className="text-4xl font-bold text-gray-900 leading-tight">
                Request an appointment without calling the hospital first.
              </h2>
              <p className="text-lg text-gray-600 max-w-2xl">
                Fill in your details, preferred date, and reason for visit. Our staff will review the request and
                contact you to confirm the next step.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Card className="border-green-100 shadow-sm">
                <CardHeader className="pb-3">
                  <CardTitle className="flex items-center gap-2 text-lg">
                    <CalendarDays className="h-5 w-5 text-green-600" />
                    How it works
                  </CardTitle>
                </CardHeader>
                <CardContent className="text-sm text-gray-600 space-y-2">
                  <p>1. Submit your request with a preferred date.</p>
                  <p>2. Hospital staff review and assign it internally.</p>
                  <p>3. We contact you to confirm or reschedule.</p>
                </CardContent>
              </Card>

              <Card className="border-red-100 shadow-sm">
                <CardHeader className="pb-3">
                  <CardTitle className="flex items-center gap-2 text-lg">
                    <PhoneCall className="h-5 w-5 text-red-600" />
                    Emergency cases
                  </CardTitle>
                </CardHeader>
                <CardContent className="text-sm text-gray-600 space-y-3">
                  <p>Do not use this form for life-threatening emergencies.</p>
                  <Button asChild variant="outline" className="w-full">
                    <a href="tel:+234012345678">Call Emergency Line</a>
                  </Button>
                </CardContent>
              </Card>
            </div>
          </section>

          <Card className="shadow-lg border-0">
            <CardHeader>
              <CardTitle>Book Appointment</CardTitle>
              <CardDescription>All fields marked required must be completed before we can review your request.</CardDescription>
            </CardHeader>
            <CardContent>
              {isSubmitted ? (
                <div className="rounded-xl border border-green-200 bg-green-50 p-6 text-center space-y-4">
                  <CheckCircle2 className="h-12 w-12 text-green-600 mx-auto" />
                  <div>
                    <h3 className="text-xl font-semibold text-gray-900">Request received</h3>
                    <p className="text-sm text-gray-600 mt-2">
                      Your appointment request is now in our review queue. A staff member will contact you using the
                      phone number or email you provided.
                    </p>
                  </div>
                  <Button className="bg-green-600 hover:bg-green-700" onClick={() => setIsSubmitted(false)}>
                    Submit Another Request
                  </Button>
                </div>
              ) : (
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

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="phone">Phone Number *</Label>
                      <Input
                        id="phone"
                        value={formData.Phone_Num}
                        onChange={(e) => setFormData({ ...formData, Phone_Num: e.target.value })}
                        placeholder="+2348012345678 or 08012345678"
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="email">Email</Label>
                      <Input
                        id="email"
                        type="email"
                        value={formData.Email}
                        onChange={(e) => setFormData({ ...formData, Email: e.target.value })}
                        placeholder="name@example.com"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="age">Age</Label>
                      <Input
                        id="age"
                        type="number"
                        min="0"
                        value={formData.Age}
                        onChange={(e) => setFormData({ ...formData, Age: e.target.value })}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="gender">Gender</Label>
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
                      <Label htmlFor="preferredDate">Preferred Date *</Label>
                      <Input
                        id="preferredDate"
                        type="date"
                        value={formData.Preferred_Date}
                        onChange={(e) => setFormData({ ...formData, Preferred_Date: e.target.value })}
                        min={new Date().toISOString().split("T")[0]}
                        required
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="reason">Reason For Visit *</Label>
                    <Textarea
                      id="reason"
                      value={formData.Reason_For_Visit}
                      onChange={(e) => setFormData({ ...formData, Reason_For_Visit: e.target.value })}
                      placeholder="Briefly tell us what you need help with"
                      rows={4}
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="notes">Additional Notes</Label>
                    <Textarea
                      id="notes"
                      value={formData.Notes}
                      onChange={(e) => setFormData({ ...formData, Notes: e.target.value })}
                      placeholder="Anything else the hospital should know before contacting you"
                      rows={3}
                    />
                  </div>

                  <Button type="submit" disabled={isSubmitting} className="w-full bg-green-600 hover:bg-green-700">
                    {isSubmitting ? "Submitting Request..." : "Submit Appointment Request"}
                  </Button>
                </form>
              )}
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  )
}

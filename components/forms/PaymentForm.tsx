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

interface Payment {
  _id?: string
  Patient_ID: string
  TotalBill: number
  AdvancePayment: number
  FinalPayment: number
  PaymentMethod: string
  PaymentStatus: string
  CC_Num?: string
  CardHoldersName?: string
  Check_Num?: string
}

interface Patient {
  _id: string
  FirstName: string
  LastName: string
}

interface PaymentFormProps {
  payment?: Payment | null
  onClose: () => void
  onSuccess: () => void
}

export default function PaymentForm({ payment, onClose, onSuccess }: PaymentFormProps) {
  const [formData, setFormData] = useState<Payment>({
    Patient_ID: "",
    TotalBill: 0,
    AdvancePayment: 0,
    FinalPayment: 0,
    PaymentMethod: "",
    PaymentStatus: "Pending",
  })
  const [patients, setPatients] = useState<Patient[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const { toast } = useToast()

  useEffect(() => {
    fetchPatients()
    if (payment) {
      setFormData({
        ...payment,
        Patient_ID: typeof payment.Patient_ID === "object" ? payment.Patient_ID._id : payment.Patient_ID,
      })
    }
  }, [payment])

  useEffect(() => {
    // Calculate final payment automatically
    const finalPayment = formData.TotalBill - formData.AdvancePayment
    setFormData((prev) => ({ ...prev, FinalPayment: Math.max(0, finalPayment) }))
  }, [formData.TotalBill, formData.AdvancePayment])

  const fetchPatients = async () => {
    try {
      const response = await fetch("/api/patients")
      const data = await response.json()
      setPatients(data)
    } catch (error) {
      console.error("Error fetching patients:", error)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    try {
      const url = payment ? `/api/payments/${payment._id}` : "/api/payments"
      const method = payment ? "PUT" : "POST"

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
          description: payment ? "Payment updated successfully" : "Payment recorded successfully",
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
        description: "Failed to save payment",
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
              <CardTitle>{payment ? "Edit Payment" : "Record Payment"}</CardTitle>
              <CardDescription>{payment ? "Update payment information" : "Enter payment details"}</CardDescription>
            </div>
            <Button variant="ghost" size="icon" onClick={onClose}>
              <X className="h-4 w-4" />
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
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

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label htmlFor="totalBill">Total Bill (₦) *</Label>
                <Input
                  id="totalBill"
                  type="number"
                  min="0"
                  step="0.01"
                  value={formData.TotalBill}
                  onChange={(e) => setFormData({ ...formData, TotalBill: Number.parseFloat(e.target.value) || 0 })}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="advancePayment">Advance Payment (₦) *</Label>
                <Input
                  id="advancePayment"
                  type="number"
                  min="0"
                  step="0.01"
                  value={formData.AdvancePayment}
                  onChange={(e) => setFormData({ ...formData, AdvancePayment: Number.parseFloat(e.target.value) || 0 })}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="finalPayment">Final Payment (₦)</Label>
                <Input id="finalPayment" type="number" value={formData.FinalPayment} disabled className="bg-gray-100" />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="paymentMethod">Payment Method *</Label>
                <Select
                  value={formData.PaymentMethod}
                  onValueChange={(value) => setFormData({ ...formData, PaymentMethod: value })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select payment method" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Cash">Cash</SelectItem>
                    <SelectItem value="Credit_Card">Credit Card</SelectItem>
                    <SelectItem value="Check">Check</SelectItem>
                    <SelectItem value="Bank_Transfer">Bank Transfer</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="paymentStatus">Payment Status *</Label>
                <Select
                  value={formData.PaymentStatus}
                  onValueChange={(value) => setFormData({ ...formData, PaymentStatus: value })}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Pending">Pending</SelectItem>
                    <SelectItem value="Paid">Paid</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Credit Card Fields */}
            {formData.PaymentMethod === "Credit_Card" && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="ccNum">Credit Card Number *</Label>
                  <Input
                    id="ccNum"
                    value={formData.CC_Num || ""}
                    onChange={(e) => setFormData({ ...formData, CC_Num: e.target.value })}
                    placeholder="XXXX-XXXX-XXXX-XXXX"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="cardHolder">Card Holder Name *</Label>
                  <Input
                    id="cardHolder"
                    value={formData.CardHoldersName || ""}
                    onChange={(e) => setFormData({ ...formData, CardHoldersName: e.target.value })}
                    placeholder="Full name on card"
                    required
                  />
                </div>
              </div>
            )}

            {/* Check Fields */}
            {formData.PaymentMethod === "Check" && (
              <div className="space-y-2">
                <Label htmlFor="checkNum">Check Number *</Label>
                <Input
                  id="checkNum"
                  value={formData.Check_Num || ""}
                  onChange={(e) => setFormData({ ...formData, Check_Num: e.target.value })}
                  placeholder="Enter check number"
                  required
                />
              </div>
            )}

            <div className="flex justify-end space-x-2 pt-4">
              <Button type="button" variant="outline" onClick={onClose}>
                Cancel
              </Button>
              <Button type="submit" disabled={isLoading} className="bg-green-600 hover:bg-green-700">
                {isLoading ? "Saving..." : payment ? "Update Payment" : "Record Payment"}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}

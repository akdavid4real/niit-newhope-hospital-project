"use client"

import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Plus, Search, Edit, Download, CreditCard, AlertCircle } from "lucide-react"
import TableView from "@/components/TableView"
import PaymentForm from "@/components/forms/PaymentForm"
import { useToast } from "@/hooks/use-toast"

interface Payment {
  _id: string
  Patient_ID: {
    _id: string
    FirstName: string
    LastName: string
  }
  TotalBill: number
  AdvancePayment: number
  FinalPayment: number
  PaymentMethod: string
  PaymentStatus: string
  createdAt: string
}

export default function PaymentsPage() {
  const [payments, setPayments] = useState<Payment[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")
  const [showForm, setShowForm] = useState(false)
  const [editingPayment, setEditingPayment] = useState<Payment | null>(null)
  const { toast } = useToast()

  useEffect(() => {
    fetchPayments()
  }, [])

  const fetchPayments = async () => {
    try {
      const response = await fetch("/api/payments")
      const data = await response.json()
      setPayments(Array.isArray(data) ? data : [])
    } catch (error) {
      setPayments([])
      toast({
        title: "Error",
        description: "Failed to fetch payments",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handleExportReport = async () => {
    try {
      const response = await fetch("/api/export/payments")
      const blob = await response.blob()
      const url = window.URL.createObjectURL(blob)
      const a = document.createElement("a")
      a.href = url
      a.download = `payments-report-${new Date().toISOString().split("T")[0]}.txt`
      document.body.appendChild(a)
      a.click()
      window.URL.revokeObjectURL(url)
      document.body.removeChild(a)

      toast({
        title: "Success",
        description: "Payments report exported successfully",
      })
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to export report",
        variant: "destructive",
      })
    }
  }

  const filteredPayments = payments.filter(
    (payment) =>
      `${payment.Patient_ID?.FirstName} ${payment.Patient_ID?.LastName}`
        .toLowerCase()
        .includes(searchTerm.toLowerCase()) ||
      payment.PaymentMethod.toLowerCase().includes(searchTerm.toLowerCase()) ||
      payment.PaymentStatus.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  const totalRevenue = payments.reduce((sum, payment) => sum + payment.TotalBill, 0)
  const pendingPayments = payments.filter((p) => p.PaymentStatus === "Pending").length
  const totalAdvance = payments.reduce((sum, payment) => sum + payment.AdvancePayment, 0)

  const columns = [
    {
      key: "Patient_ID",
      label: "Patient",
      render: (patient: any) => (patient ? `${patient.FirstName} ${patient.LastName}` : "Unknown"),
    },
    {
      key: "TotalBill",
      label: "Total Bill",
      render: (value: number) => `₦${value.toLocaleString()}`,
    },
    {
      key: "AdvancePayment",
      label: "Advance",
      render: (value: number) => `₦${value.toLocaleString()}`,
    },
    {
      key: "FinalPayment",
      label: "Final Payment",
      render: (value: number) => `₦${value.toLocaleString()}`,
    },
    {
      key: "PaymentMethod",
      label: "Method",
      render: (value: string) => <Badge variant="outline">{value}</Badge>,
    },
    {
      key: "PaymentStatus",
      label: "Status",
      render: (value: string) => <Badge variant={value === "Paid" ? "default" : "destructive"}>{value}</Badge>,
    },
    {
      key: "createdAt",
      label: "Date",
      render: (date: string) => new Date(date).toLocaleDateString(),
    },
    {
      key: "actions",
      label: "Actions",
      render: (_: any, payment: Payment) => (
        <div className="flex space-x-2">
          <Button
            size="sm"
            variant="outline"
            onClick={() => {
              setEditingPayment(payment)
              setShowForm(true)
            }}
          >
            <Edit className="h-4 w-4" />
          </Button>
        </div>
      ),
    },
  ]

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Payment Management</h1>
          <p className="text-gray-600">Track patient payments and billing</p>
        </div>
        <div className="flex space-x-2">
          <Button variant="outline" onClick={handleExportReport}>
            <Download className="h-4 w-4 mr-2" />
            Export Report
          </Button>
          <Button
            onClick={() => {
              setEditingPayment(null)
              setShowForm(true)
            }}
            className="bg-green-600 hover:bg-green-700"
          >
            <Plus className="h-4 w-4 mr-2" />
            Add Payment
          </Button>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
            <CreditCard className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">₦{totalRevenue.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">All time revenue</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pending Payments</CardTitle>
            <AlertCircle className="h-4 w-4 text-red-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{pendingPayments}</div>
            <p className="text-xs text-muted-foreground">Require attention</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Advance</CardTitle>
            <CreditCard className="h-4 w-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">₦{totalAdvance.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">Advance payments</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Payments</CardTitle>
            <CreditCard className="h-4 w-4 text-purple-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{payments.length}</div>
            <p className="text-xs text-muted-foreground">Payment records</p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Payment Records</CardTitle>
          <CardDescription>View and manage all patient payments</CardDescription>
          <div className="flex items-center space-x-2">
            <Search className="h-4 w-4 text-gray-400" />
            <Input
              placeholder="Search by patient, method, or status..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="max-w-sm"
            />
          </div>
        </CardHeader>
        <CardContent>
          <TableView data={filteredPayments} columns={columns} isLoading={isLoading} />
        </CardContent>
      </Card>

      {showForm && (
        <PaymentForm
          payment={editingPayment}
          onClose={() => {
            setShowForm(false)
            setEditingPayment(null)
          }}
          onSuccess={() => {
            fetchPayments()
            setShowForm(false)
            setEditingPayment(null)
          }}
        />
      )}
    </div>
  )
}

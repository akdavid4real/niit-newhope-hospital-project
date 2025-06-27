import { NextResponse } from "next/server"
import dbConnect from "@/lib/mongodb"
import Payment from "@/models/Payment"

export async function GET() {
  try {
    await dbConnect()

    // Get patients with pending payments
    const pendingPayments = await Payment.find({ PaymentStatus: "Pending" }).populate("Patient_ID")
    const patients = pendingPayments.map((payment) => payment.Patient_ID).filter(Boolean)

    return NextResponse.json(patients)
  } catch (error) {
    return NextResponse.json({ message: "Error fetching patients with pending payments" }, { status: 500 })
  }
}

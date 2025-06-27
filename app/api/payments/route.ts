import { type NextRequest, NextResponse } from "next/server"
import dbConnect from "@/lib/mongodb"
import Payment from "@/models/Payment"

export async function GET() {
  try {
    await dbConnect()
    const payments = await Payment.find().populate("Patient_ID", "FirstName LastName").sort({ createdAt: -1 })
    return NextResponse.json(payments)
  } catch (error) {
    return NextResponse.json({ message: "Error fetching payments" }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    await dbConnect()
    const data = await request.json()
    const payment = new Payment(data)
    await payment.save()
    await payment.populate("Patient_ID", "FirstName LastName")
    return NextResponse.json(payment, { status: 201 })
  } catch (error: any) {
    return NextResponse.json({ message: error.message || "Error creating payment" }, { status: 400 })
  }
}

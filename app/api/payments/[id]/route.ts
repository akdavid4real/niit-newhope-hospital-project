import { type NextRequest, NextResponse } from "next/server"
import dbConnect from "@/lib/mongodb"
import Payment from "@/models/Payment"

export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    await dbConnect()
    const payment = await Payment.findById(params.id).populate("Patient_ID", "FirstName LastName")
    if (!payment) {
      return NextResponse.json({ message: "Payment not found" }, { status: 404 })
    }
    return NextResponse.json(payment)
  } catch (error) {
    return NextResponse.json({ message: "Error fetching payment" }, { status: 500 })
  }
}

export async function PUT(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    await dbConnect()
    const data = await request.json()
    const payment = await Payment.findByIdAndUpdate(params.id, data, { new: true, runValidators: true }).populate(
      "Patient_ID",
      "FirstName LastName",
    )
    if (!payment) {
      return NextResponse.json({ message: "Payment not found" }, { status: 404 })
    }
    return NextResponse.json(payment)
  } catch (error: any) {
    return NextResponse.json({ message: error.message || "Error updating payment" }, { status: 400 })
  }
}

import { NextResponse } from "next/server"
import dbConnect from "@/lib/mongodb"
import Payment from "@/models/Payment"

export async function GET() {
  try {
    await dbConnect()
    const pendingPayments = await Payment.find({ PaymentStatus: "Pending" }).populate(
      "Patient_ID",
      "FirstName LastName",
    )
    return NextResponse.json(pendingPayments)
  } catch (error) {
    return NextResponse.json({ message: "Error fetching pending payments" }, { status: 500 })
  }
}

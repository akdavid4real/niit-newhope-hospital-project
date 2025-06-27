import { type NextRequest, NextResponse } from "next/server"
import dbConnect from "@/lib/mongodb"
import Payment from "@/models/Payment"

export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    await dbConnect()
    const payments = await Payment.find({ Patient_ID: params.id }).populate("Patient_ID", "FirstName LastName")
    return NextResponse.json(payments)
  } catch (error) {
    return NextResponse.json({ message: "Error fetching patient payments" }, { status: 500 })
  }
}

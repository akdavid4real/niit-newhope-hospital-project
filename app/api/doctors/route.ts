import { type NextRequest, NextResponse } from "next/server"
import dbConnect from "@/lib/mongodb"
import Doctor from "@/models/Doctor"

export async function GET() {
  try {
    await dbConnect()
    const doctors = await Doctor.find().populate("Ward_ID", "WardName").sort({ createdAt: -1 })
    return NextResponse.json(doctors)
  } catch (error) {
    return NextResponse.json({ message: "Error fetching doctors" }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    await dbConnect()
    const data = await request.json()
    const doctor = new Doctor(data)
    await doctor.save()
    await doctor.populate("Ward_ID", "WardName")
    return NextResponse.json(doctor, { status: 201 })
  } catch (error: any) {
    return NextResponse.json({ message: error.message || "Error creating doctor" }, { status: 400 })
  }
}

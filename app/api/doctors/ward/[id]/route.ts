import { type NextRequest, NextResponse } from "next/server"
import dbConnect from "@/lib/mongodb"
import Doctor from "@/models/Doctor"

export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    await dbConnect()
    const doctors = await Doctor.find({ Ward_ID: params.id }).populate("Ward_ID", "WardName")
    return NextResponse.json(doctors)
  } catch (error) {
    return NextResponse.json({ message: "Error fetching doctors by ward" }, { status: 500 })
  }
}

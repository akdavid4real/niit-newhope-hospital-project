import { NextResponse } from "next/server"
import dbConnect from "@/lib/mongodb"
import Ward from "@/models/Ward"
import Doctor from "@/models/Doctor"

export async function GET() {
  try {
    await dbConnect()

    const wards = await Ward.find().sort({ createdAt: -1 })

    // Get doctor count for each ward
    const wardsWithDoctorCount = await Promise.all(
      wards.map(async (ward) => {
        const doctorCount = await Doctor.countDocuments({ Ward_ID: ward._id })
        return {
          ...ward.toObject(),
          doctorCount,
        }
      }),
    )

    return NextResponse.json(wardsWithDoctorCount)
  } catch (error) {
    console.error("GET /api/wards/availability failed:", error)
    return NextResponse.json({ message: "Error fetching ward availability" }, { status: 500 })
  }
}

import { type NextRequest, NextResponse } from "next/server"
import dbConnect from "@/lib/mongodb"
import Doctor from "@/models/Doctor"

export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    await dbConnect()
    const doctor = await Doctor.findById(params.id).populate("Ward_ID", "WardName")
    if (!doctor) {
      return NextResponse.json({ message: "Doctor not found" }, { status: 404 })
    }
    return NextResponse.json(doctor)
  } catch (error) {
    return NextResponse.json({ message: "Error fetching doctor" }, { status: 500 })
  }
}

export async function PUT(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    await dbConnect()
    const data = await request.json()
    const doctor = await Doctor.findByIdAndUpdate(params.id, data, { new: true, runValidators: true }).populate(
      "Ward_ID",
      "WardName",
    )
    if (!doctor) {
      return NextResponse.json({ message: "Doctor not found" }, { status: 404 })
    }
    return NextResponse.json(doctor)
  } catch (error: any) {
    return NextResponse.json({ message: error.message || "Error updating doctor" }, { status: 400 })
  }
}

export async function DELETE(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    await dbConnect()
    const doctor = await Doctor.findByIdAndDelete(params.id)
    if (!doctor) {
      return NextResponse.json({ message: "Doctor not found" }, { status: 404 })
    }
    return NextResponse.json({ message: "Doctor deleted successfully" })
  } catch (error) {
    return NextResponse.json({ message: "Error deleting doctor" }, { status: 500 })
  }
}

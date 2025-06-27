import { type NextRequest, NextResponse } from "next/server"
import dbConnect from "@/lib/mongodb"
import MedicalHistory from "@/models/MedicalHistory"

export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    await dbConnect()
    const history = await MedicalHistory.findById(params.id)
      .populate("Patient_ID", "FirstName LastName")
      .populate("Doctor_ID", "FirstName LastName")
      .populate("OriginalWard", "WardName")
      .populate("DischargeWard", "WardName")
    if (!history) {
      return NextResponse.json({ message: "Medical history not found" }, { status: 404 })
    }
    return NextResponse.json(history)
  } catch (error) {
    return NextResponse.json({ message: "Error fetching medical history" }, { status: 500 })
  }
}

export async function PUT(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    await dbConnect()
    const data = await request.json()
    const history = await MedicalHistory.findByIdAndUpdate(params.id, data, { new: true, runValidators: true })
      .populate("Patient_ID", "FirstName LastName")
      .populate("Doctor_ID", "FirstName LastName")
      .populate("OriginalWard", "WardName")
      .populate("DischargeWard", "WardName")
    if (!history) {
      return NextResponse.json({ message: "Medical history not found" }, { status: 404 })
    }
    return NextResponse.json(history)
  } catch (error: any) {
    return NextResponse.json({ message: error.message || "Error updating medical history" }, { status: 400 })
  }
}

export async function DELETE(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    await dbConnect()
    const history = await MedicalHistory.findByIdAndDelete(params.id)
    if (!history) {
      return NextResponse.json({ message: "Medical history not found" }, { status: 404 })
    }
    return NextResponse.json({ message: "Medical history deleted successfully" })
  } catch (error) {
    return NextResponse.json({ message: "Error deleting medical history" }, { status: 500 })
  }
}

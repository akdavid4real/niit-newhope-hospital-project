import { type NextRequest, NextResponse } from "next/server"
import dbConnect from "@/lib/mongodb"
import MedicalHistory from "@/models/MedicalHistory"

export const dynamic = "force-dynamic"
export const runtime = "nodejs"

export async function GET(request: NextRequest, context: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await context.params
    await dbConnect()
    const history = await MedicalHistory.findById(id)
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

export async function PUT(request: NextRequest, context: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await context.params
    await dbConnect()
    const data = await request.json()
    const history = await MedicalHistory.findByIdAndUpdate(id, data, { returnDocument: "after", runValidators: true })
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

export async function DELETE(request: NextRequest, context: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await context.params
    await dbConnect()
    const history = await MedicalHistory.findByIdAndDelete(id)
    if (!history) {
      return NextResponse.json({ message: "Medical history not found" }, { status: 404 })
    }
    return NextResponse.json({ message: "Medical history deleted successfully" })
  } catch (error) {
    return NextResponse.json({ message: "Error deleting medical history" }, { status: 500 })
  }
}

import { type NextRequest, NextResponse } from "next/server"
import dbConnect from "@/lib/mongodb"
import MedicalHistory from "@/models/MedicalHistory"

export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    await dbConnect()
    const history = await MedicalHistory.find({ Patient_ID: params.id })
      .populate("Patient_ID", "FirstName LastName")
      .populate("Doctor_ID", "FirstName LastName")
      .populate("OriginalWard", "WardName")
      .populate("DischargeWard", "WardName")
      .sort({ createdAt: -1 })
    return NextResponse.json(history)
  } catch (error) {
    return NextResponse.json({ message: "Error fetching patient medical history" }, { status: 500 })
  }
}

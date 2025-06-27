import { type NextRequest, NextResponse } from "next/server"
import dbConnect from "@/lib/mongodb"
import MedicalHistory from "@/models/MedicalHistory"

export async function GET() {
  try {
    await dbConnect()
    const history = await MedicalHistory.find()
      .populate("Patient_ID", "FirstName LastName")
      .populate("Doctor_ID", "FirstName LastName")
      .populate("OriginalWard", "WardName")
      .populate("DischargeWard", "WardName")
      .sort({ createdAt: -1 })
    return NextResponse.json(history)
  } catch (error) {
    return NextResponse.json({ message: "Error fetching medical history" }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    await dbConnect()
    const data = await request.json()
    const history = new MedicalHistory(data)
    await history.save()
    await history.populate([
      { path: "Patient_ID", select: "FirstName LastName" },
      { path: "Doctor_ID", select: "FirstName LastName" },
      { path: "OriginalWard", select: "WardName" },
      { path: "DischargeWard", select: "WardName" },
    ])
    return NextResponse.json(history, { status: 201 })
  } catch (error: any) {
    return NextResponse.json({ message: error.message || "Error creating medical history" }, { status: 400 })
  }
}

import { type NextRequest, NextResponse } from "next/server"
import dbConnect from "@/lib/mongodb"
import Patient from "@/models/Patient"

export async function GET() {
  try {
    await dbConnect()
    const patients = await Patient.find().sort({ createdAt: -1 })
    return NextResponse.json(patients)
  } catch (error) {
    return NextResponse.json({ message: "Error fetching patients" }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    await dbConnect()
    const data = await request.json()
    const patient = new Patient(data)
    await patient.save()
    return NextResponse.json(patient, { status: 201 })
  } catch (error: any) {
    return NextResponse.json({ message: error.message || "Error creating patient" }, { status: 400 })
  }
}

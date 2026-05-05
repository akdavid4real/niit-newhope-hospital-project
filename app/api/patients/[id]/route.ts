import { type NextRequest, NextResponse } from "next/server"
import dbConnect from "@/lib/mongodb"
import Patient from "@/models/Patient"

export const dynamic = "force-dynamic"
export const runtime = "nodejs"

export async function GET(request: NextRequest, context: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await context.params
    await dbConnect()
    const patient = await Patient.findById(id)
    if (!patient) {
      return NextResponse.json({ message: "Patient not found" }, { status: 404 })
    }
    return NextResponse.json(patient)
  } catch (error) {
    return NextResponse.json({ message: "Error fetching patient" }, { status: 500 })
  }
}

export async function PUT(request: NextRequest, context: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await context.params
    await dbConnect()
    const data = await request.json()
    const patient = await Patient.findById(id)
    if (!patient) {
      return NextResponse.json({ message: "Patient not found" }, { status: 404 })
    }

    patient.set(data)
    await patient.save()

    return NextResponse.json(patient)
  } catch (error: any) {
    return NextResponse.json({ message: error.message || "Error updating patient" }, { status: 400 })
  }
}

export async function DELETE(request: NextRequest, context: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await context.params
    await dbConnect()
    const patient = await Patient.findByIdAndDelete(id)
    if (!patient) {
      return NextResponse.json({ message: "Patient not found" }, { status: 404 })
    }
    return NextResponse.json({ message: "Patient deleted successfully" })
  } catch (error) {
    return NextResponse.json({ message: "Error deleting patient" }, { status: 500 })
  }
}

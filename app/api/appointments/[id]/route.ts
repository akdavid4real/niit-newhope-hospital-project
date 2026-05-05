import { type NextRequest, NextResponse } from "next/server"
import dbConnect from "@/lib/mongodb"
import Appointment from "@/models/Appointment"

export const dynamic = "force-dynamic"
export const runtime = "nodejs"

export async function GET(request: NextRequest, context: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await context.params
    await dbConnect()
    const appointment = await Appointment.findById(id)
      .populate("Assigned_DoctorID", "FirstName LastName")
      .populate("Assigned_Ward_ID", "WardName")

    if (!appointment) {
      return NextResponse.json({ message: "Appointment not found" }, { status: 404 })
    }

    return NextResponse.json(appointment)
  } catch (error) {
    return NextResponse.json({ message: "Error fetching appointment" }, { status: 500 })
  }
}

export async function PUT(request: NextRequest, context: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await context.params
    await dbConnect()
    const data = await request.json()
    const appointment = await Appointment.findById(id)

    if (!appointment) {
      return NextResponse.json({ message: "Appointment not found" }, { status: 404 })
    }

    appointment.set({
      ...data,
      Assigned_DoctorID: data.Assigned_DoctorID || null,
      Assigned_Ward_ID: data.Assigned_Ward_ID || null,
    })
    await appointment.save()
    await appointment.populate("Assigned_DoctorID", "FirstName LastName")
    await appointment.populate("Assigned_Ward_ID", "WardName")

    return NextResponse.json(appointment)
  } catch (error: any) {
    return NextResponse.json({ message: error.message || "Error updating appointment" }, { status: 400 })
  }
}

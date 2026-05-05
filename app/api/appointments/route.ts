import { type NextRequest, NextResponse } from "next/server"
import dbConnect from "@/lib/mongodb"
import Appointment from "@/models/Appointment"

export const dynamic = "force-dynamic"
export const runtime = "nodejs"

export async function GET() {
  try {
    await dbConnect()
    const appointments = await Appointment.find()
      .populate("Assigned_DoctorID", "FirstName LastName")
      .populate("Assigned_Ward_ID", "WardName")
      .sort({ createdAt: -1 })

    return NextResponse.json(appointments)
  } catch (error) {
    console.error("GET /api/appointments failed:", error)
    return NextResponse.json({ message: "Error fetching appointments" }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    await dbConnect()
    const data = await request.json()
    const appointment = new Appointment({
      ...data,
      Status: "Pending",
      Assigned_DoctorID: data.Assigned_DoctorID || null,
      Assigned_Ward_ID: data.Assigned_Ward_ID || null,
    })

    await appointment.save()
    await appointment.populate("Assigned_DoctorID", "FirstName LastName")
    await appointment.populate("Assigned_Ward_ID", "WardName")

    return NextResponse.json(appointment, { status: 201 })
  } catch (error: any) {
    console.error("POST /api/appointments failed:", error)
    return NextResponse.json({ message: error.message || "Error creating appointment" }, { status: 400 })
  }
}

import { type NextRequest, NextResponse } from "next/server"
import dbConnect from "@/lib/mongodb"
import Ward from "@/models/Ward"

export async function GET() {
  try {
    await dbConnect()
    const wards = await Ward.find().sort({ createdAt: -1 })
    return NextResponse.json(wards)
  } catch (error) {
    return NextResponse.json({ message: "Error fetching wards" }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    await dbConnect()
    const data = await request.json()
    const ward = new Ward(data)
    await ward.save()
    return NextResponse.json(ward, { status: 201 })
  } catch (error: any) {
    return NextResponse.json({ message: error.message || "Error creating ward" }, { status: 400 })
  }
}

import { type NextRequest, NextResponse } from "next/server"
import dbConnect from "@/lib/mongodb"
import Ward from "@/models/Ward"

export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    await dbConnect()
    const ward = await Ward.findById(params.id)
    if (!ward) {
      return NextResponse.json({ message: "Ward not found" }, { status: 404 })
    }
    return NextResponse.json(ward)
  } catch (error) {
    return NextResponse.json({ message: "Error fetching ward" }, { status: 500 })
  }
}

export async function PUT(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    await dbConnect()
    const data = await request.json()
    const ward = await Ward.findByIdAndUpdate(params.id, data, { new: true, runValidators: true })
    if (!ward) {
      return NextResponse.json({ message: "Ward not found" }, { status: 404 })
    }
    return NextResponse.json(ward)
  } catch (error: any) {
    return NextResponse.json({ message: error.message || "Error updating ward" }, { status: 400 })
  }
}

export async function DELETE(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    await dbConnect()
    const ward = await Ward.findByIdAndDelete(params.id)
    if (!ward) {
      return NextResponse.json({ message: "Ward not found" }, { status: 404 })
    }
    return NextResponse.json({ message: "Ward deleted successfully" })
  } catch (error) {
    return NextResponse.json({ message: "Error deleting ward" }, { status: 500 })
  }
}

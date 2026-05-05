import { type NextRequest, NextResponse } from "next/server"
import dbConnect from "@/lib/mongodb"
import Ward from "@/models/Ward"

export const dynamic = "force-dynamic"
export const runtime = "nodejs"

export async function GET(request: NextRequest, context: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await context.params
    await dbConnect()
    const ward = await Ward.findById(id)
    if (!ward) {
      return NextResponse.json({ message: "Ward not found" }, { status: 404 })
    }
    return NextResponse.json(ward)
  } catch (error) {
    return NextResponse.json({ message: "Error fetching ward" }, { status: 500 })
  }
}

export async function PUT(request: NextRequest, context: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await context.params
    await dbConnect()
    const data = await request.json()
    const ward = await Ward.findByIdAndUpdate(id, data, { returnDocument: "after", runValidators: true })
    if (!ward) {
      return NextResponse.json({ message: "Ward not found" }, { status: 404 })
    }
    return NextResponse.json(ward)
  } catch (error: any) {
    return NextResponse.json({ message: error.message || "Error updating ward" }, { status: 400 })
  }
}

export async function DELETE(request: NextRequest, context: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await context.params
    await dbConnect()
    const ward = await Ward.findByIdAndDelete(id)
    if (!ward) {
      return NextResponse.json({ message: "Ward not found" }, { status: 404 })
    }
    return NextResponse.json({ message: "Ward deleted successfully" })
  } catch (error) {
    return NextResponse.json({ message: "Error deleting ward" }, { status: 500 })
  }
}

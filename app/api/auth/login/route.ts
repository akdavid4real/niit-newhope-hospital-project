import { type NextRequest, NextResponse } from "next/server"
import { generateToken } from "@/middleware/auth"

export async function POST(request: NextRequest) {
  try {
    const { email, password } = await request.json()

    // Demo authentication - replace with real authentication
    if (email === "admin@newhopehospital.ng" && password === "admin123") {
      const token = generateToken({ email, role: "admin" })
      return NextResponse.json({
        success: true,
        token,
        user: { email, role: "admin" },
      })
    }

    return NextResponse.json({ success: false, message: "Invalid credentials" }, { status: 401 })
  } catch (error) {
    return NextResponse.json({ success: false, message: "Server error" }, { status: 500 })
  }
}

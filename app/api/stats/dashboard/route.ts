import { NextResponse } from "next/server"
import dbConnect from "@/lib/mongodb"
import Doctor from "@/models/Doctor"
import Patient from "@/models/Patient"
import Ward from "@/models/Ward"
import Payment from "@/models/Payment"

export async function GET() {
  try {
    await dbConnect()

    // Get all counts
    const [totalDoctors, totalPatients, totalWards, wards, pendingPayments, payments, recentAdmissions] =
      await Promise.all([
        Doctor.countDocuments(),
        Patient.countDocuments({ Status: "Admitted" }),
        Ward.countDocuments(),
        Ward.find(),
        Payment.countDocuments({ PaymentStatus: "Pending" }),
        Payment.find(),
        Patient.countDocuments({
          Admit_Date: {
            $gte: new Date(Date.now() - 24 * 60 * 60 * 1000), // Last 24 hours
          },
        }),
      ])

    // Calculate bed statistics
    const totalBeds = wards.reduce((sum, ward) => sum + ward.TotalBeds, 0)
    const availableBeds = wards.reduce((sum, ward) => sum + ward.AvailableBeds, 0)

    // Calculate total revenue
    const totalRevenue = payments.reduce((sum, payment) => sum + payment.TotalBill, 0)

    const stats = {
      totalDoctors,
      totalPatients,
      totalWards,
      totalBeds,
      availableBeds,
      pendingPayments,
      totalRevenue,
      recentAdmissions,
    }

    return NextResponse.json(stats)
  } catch (error) {
    return NextResponse.json({ message: "Error fetching dashboard stats" }, { status: 500 })
  }
}

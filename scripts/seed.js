const mongoose = require("mongoose")

const wardSeedData = require("./wardSeedData")
const doctorSeedData = require("./doctorSeedData")
const patientSeedData = require("./patientSeedData")
const paymentSeedData = require("./paymentSeedData")

const MONGODB_URI = process.env.MONGODB_URI || "mongodb://localhost:27017/newhope-hospital"

const wardSchema = new mongoose.Schema(
  {
    WardName: { type: String, required: true },
    TotalBeds: { type: Number, required: true },
    AvailableBeds: { type: Number, required: true },
    WardType: { type: String, required: true },
  },
  { timestamps: true },
)

const doctorSchema = new mongoose.Schema(
  {
    FirstName: { type: String, required: true },
    LastName: { type: String, required: true },
    Phone_Num: { type: String, required: true },
    Employment_Type: { type: String, enum: ["Resident", "Visiting"], required: true },
    Ward_ID: { type: mongoose.Schema.Types.ObjectId, ref: "Ward", required: true },
  },
  { timestamps: true },
)

const patientSchema = new mongoose.Schema(
  {
    FirstName: { type: String, required: true },
    LastName: { type: String, required: true },
    Age: { type: Number, required: true },
    Gender: { type: String, enum: ["Male", "Female", "Other"], required: true },
    Phone_Num: { type: String, required: true },
    Address: { type: String, required: true },
    Blood_Grp: { type: String, enum: ["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"], required: true },
    Admit_Date: { type: Date, required: true },
    Discharge_Date: { type: Date },
    Status: { type: String, enum: ["Admitted", "Discharged"], default: "Admitted" },
    Treatment_Type: { type: String, required: true },
    DoctorID: { type: mongoose.Schema.Types.ObjectId, ref: "Doctor", required: true },
    Ward_ID: { type: mongoose.Schema.Types.ObjectId, ref: "Ward", required: true },
  },
  { timestamps: true },
)

const historySchema = new mongoose.Schema(
  {
    Patient_ID: { type: mongoose.Schema.Types.ObjectId, ref: "Patient", required: true },
    Doctor_ID: { type: mongoose.Schema.Types.ObjectId, ref: "Doctor", required: true },
    Disease: { type: String, required: true },
    Treatment: { type: String, required: true },
    OriginalWard: { type: mongoose.Schema.Types.ObjectId, ref: "Ward", required: true },
    DischargeWard: { type: mongoose.Schema.Types.ObjectId, ref: "Ward" },
  },
  { timestamps: true },
)

const paymentSchema = new mongoose.Schema(
  {
    Patient_ID: { type: mongoose.Schema.Types.ObjectId, ref: "Patient", required: true },
    TotalBill: { type: Number, required: true },
    AdvancePayment: { type: Number, required: true },
    FinalPayment: { type: Number, required: true },
    PaymentMethod: { type: String, enum: ["Cash", "Credit_Card", "Check", "Bank_Transfer"], required: true },
    PaymentStatus: { type: String, enum: ["Paid", "Pending"], default: "Pending" },
    CC_Num: String,
    CardHoldersName: String,
    Check_Num: String,
  },
  { timestamps: true },
)

const Ward = mongoose.model("Ward", wardSchema)
const Doctor = mongoose.model("Doctor", doctorSchema)
const Patient = mongoose.model("Patient", patientSchema)
const MedicalHistory = mongoose.model("MedicalHistory", historySchema)
const Payment = mongoose.model("Payment", paymentSchema)

function parseAdmitDate(value) {
  return new Date(value)
}

async function seedDatabase() {
  try {
    await mongoose.connect(MONGODB_URI)
    console.log("Connected to MongoDB")

    await Promise.all([Ward.deleteMany({}), Doctor.deleteMany({}), Patient.deleteMany({}), MedicalHistory.deleteMany({}), Payment.deleteMany({})])
    console.log("Cleared existing data")

    const wards = await Ward.insertMany(wardSeedData)
    console.log("Seeded wards")

    const doctorsWithRefs = doctorSeedData.map((doctor, index) => ({
      ...doctor,
      Ward_ID: wards[index % wards.length]._id,
    }))
    const doctors = await Doctor.insertMany(doctorsWithRefs)
    console.log("Seeded doctors")

    const patientsWithRefs = patientSeedData.map((patient, index) => {
      const doctor = doctors[index % doctors.length]
      const ward = wards[index % wards.length]
      return {
        ...patient,
        Admit_Date: parseAdmitDate(patient.Admit_Date),
        DoctorID: doctor._id,
        Ward_ID: ward._id,
        Discharge_Date: index % 4 === 0 ? new Date(new Date(patient.Admit_Date).getTime() + 5 * 24 * 60 * 60 * 1000) : undefined,
        Status: index % 4 === 0 ? "Discharged" : patient.Status,
      }
    })
    const patients = await Patient.insertMany(patientsWithRefs)
    console.log("Seeded patients")

    const historyTemplates = [
      "Hypertension",
      "Malaria",
      "Appendicitis",
      "Diabetes Type 2",
      "Pneumonia",
      "Gastroenteritis",
      "Asthma",
      "Typhoid Fever",
    ]

    const histories = await MedicalHistory.insertMany(
      patients.slice(0, 48).map((patient, index) => {
        const doctor = doctors[index % doctors.length]
        const ward = wards[index % wards.length]
        const dischargeWard = wards[(index + 1) % wards.length]

        return {
          Patient_ID: patient._id,
          Doctor_ID: doctor._id,
          Disease: historyTemplates[index % historyTemplates.length],
          Treatment: `Treatment plan ${index + 1}`,
          OriginalWard: ward._id,
          DischargeWard: index % 3 === 0 ? dischargeWard._id : undefined,
        }
      }),
    )
    console.log("Seeded medical history")

    const paymentsWithRefs = paymentSeedData.map((payment, index) => {
      const patient = patients[index % patients.length]
      const totalBill = payment.TotalBill
      const advancePayment = payment.AdvancePayment

      return {
        ...payment,
        Patient_ID: patient._id,
        FinalPayment: totalBill - advancePayment,
      }
    })
    const payments = await Payment.insertMany(paymentsWithRefs)
    console.log("Seeded payments")

    console.log("Database seeded successfully!")
    console.log(
      `Seeded: ${wards.length} wards, ${doctors.length} doctors, ${patients.length} patients, ${histories.length} history records, ${payments.length} payments`,
    )
  } catch (error) {
    console.error("Error seeding database:", error)
  } finally {
    await mongoose.disconnect()
    console.log("Disconnected from MongoDB")
  }
}

seedDatabase()

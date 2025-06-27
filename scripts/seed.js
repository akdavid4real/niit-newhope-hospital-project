const mongoose = require("mongoose")

// MongoDB connection
const MONGODB_URI = process.env.MONGODB_URI || "mongodb://localhost:27017/newhope-hospital"

// Models (simplified for seeding)
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

async function seedDatabase() {
  try {
    await mongoose.connect(MONGODB_URI)
    console.log("Connected to MongoDB")

    // Clear existing data
    await Promise.all([
      Ward.deleteMany({}),
      Doctor.deleteMany({}),
      Patient.deleteMany({}),
      MedicalHistory.deleteMany({}),
      Payment.deleteMany({}),
    ])
    console.log("Cleared existing data")

    // Seed Wards
    const wards = await Ward.insertMany([
      { WardName: "ICU", TotalBeds: 20, AvailableBeds: 5, WardType: "Intensive Care" },
      { WardName: "General_Ward", TotalBeds: 50, AvailableBeds: 15, WardType: "General Medicine" },
      { WardName: "Emergency", TotalBeds: 15, AvailableBeds: 8, WardType: "Emergency Care" },
      { WardName: "OPD", TotalBeds: 10, AvailableBeds: 10, WardType: "Outpatient Department" },
    ])
    console.log("Seeded wards")

    // Seed Doctors
    const doctors = await Doctor.insertMany([
      {
        FirstName: "Adebayo",
        LastName: "Ogundimu",
        Phone_Num: "+2348012345678",
        Employment_Type: "Resident",
        Ward_ID: wards[0]._id,
      },
      {
        FirstName: "Fatima",
        LastName: "Abdullahi",
        Phone_Num: "+2348023456789",
        Employment_Type: "Resident",
        Ward_ID: wards[1]._id,
      },
      {
        FirstName: "Chinedu",
        LastName: "Okwu",
        Phone_Num: "+2348034567890",
        Employment_Type: "Visiting",
        Ward_ID: wards[2]._id,
      },
      {
        FirstName: "Aisha",
        LastName: "Bello",
        Phone_Num: "+2348045678901",
        Employment_Type: "Resident",
        Ward_ID: wards[0]._id,
      },
      {
        FirstName: "Emeka",
        LastName: "Nwosu",
        Phone_Num: "+2348056789012",
        Employment_Type: "Visiting",
        Ward_ID: wards[3]._id,
      },
    ])
    console.log("Seeded doctors")

    // Seed Patients
    const patients = await Patient.insertMany([
      {
        FirstName: "Olumide",
        LastName: "Adeyemi",
        Age: 45,
        Gender: "Male",
        Phone_Num: "+2348067890123",
        Address: "123 Victoria Island, Lagos",
        Blood_Grp: "O+",
        Admit_Date: new Date("2024-01-15"),
        Status: "Admitted",
      },
      {
        FirstName: "Kemi",
        LastName: "Okafor",
        Age: 32,
        Gender: "Female",
        Phone_Num: "+2348078901234",
        Address: "456 Ikeja, Lagos",
        Blood_Grp: "A+",
        Admit_Date: new Date("2024-01-18"),
        Status: "Admitted",
      },
      {
        FirstName: "Ibrahim",
        LastName: "Musa",
        Age: 28,
        Gender: "Male",
        Phone_Num: "+2348089012345",
        Address: "789 Abuja FCT",
        Blood_Grp: "B+",
        Admit_Date: new Date("2024-01-20"),
        Status: "Discharged",
        Discharge_Date: new Date("2024-01-25"),
      },
      {
        FirstName: "Ngozi",
        LastName: "Eze",
        Age: 55,
        Gender: "Female",
        Phone_Num: "+2348090123456",
        Address: "321 Port Harcourt, Rivers",
        Blood_Grp: "AB+",
        Admit_Date: new Date("2024-01-22"),
        Status: "Admitted",
      },
      {
        FirstName: "Yusuf",
        LastName: "Garba",
        Age: 38,
        Gender: "Male",
        Phone_Num: "+2348001234567",
        Address: "654 Kano State",
        Blood_Grp: "O-",
        Admit_Date: new Date("2024-01-25"),
        Status: "Admitted",
      },
      {
        FirstName: "Blessing",
        LastName: "Okonkwo",
        Age: 29,
        Gender: "Female",
        Phone_Num: "+2348012345679",
        Address: "987 Enugu State",
        Blood_Grp: "A-",
        Admit_Date: new Date("2024-01-28"),
        Status: "Admitted",
      },
      {
        FirstName: "Ahmed",
        LastName: "Aliyu",
        Age: 42,
        Gender: "Male",
        Phone_Num: "+2348023456780",
        Address: "147 Kaduna State",
        Blood_Grp: "B-",
        Admit_Date: new Date("2024-01-30"),
        Status: "Discharged",
        Discharge_Date: new Date("2024-02-05"),
      },
      {
        FirstName: "Chioma",
        LastName: "Nnamdi",
        Age: 26,
        Gender: "Female",
        Phone_Num: "+2348034567891",
        Address: "258 Owerri, Imo",
        Blood_Grp: "AB-",
        Admit_Date: new Date("2024-02-01"),
        Status: "Admitted",
      },
      {
        FirstName: "Suleiman",
        LastName: "Usman",
        Age: 51,
        Gender: "Male",
        Phone_Num: "+2348045678902",
        Address: "369 Maiduguri, Borno",
        Blood_Grp: "O+",
        Admit_Date: new Date("2024-02-03"),
        Status: "Admitted",
      },
      {
        FirstName: "Grace",
        LastName: "Akpan",
        Age: 34,
        Gender: "Female",
        Phone_Num: "+2348056789013",
        Address: "741 Uyo, Akwa Ibom",
        Blood_Grp: "A+",
        Admit_Date: new Date("2024-02-05"),
        Status: "Admitted",
      },
    ])
    console.log("Seeded patients")

    // Seed Medical History
    const histories = await MedicalHistory.insertMany([
      {
        Patient_ID: patients[0]._id,
        Doctor_ID: doctors[0]._id,
        Disease: "Hypertension",
        Treatment: "ACE inhibitors, lifestyle changes",
        OriginalWard: wards[0]._id,
      },
      {
        Patient_ID: patients[1]._id,
        Doctor_ID: doctors[1]._id,
        Disease: "Malaria",
        Treatment: "Artemisinin-based combination therapy",
        OriginalWard: wards[1]._id,
      },
      {
        Patient_ID: patients[2]._id,
        Doctor_ID: doctors[2]._id,
        Disease: "Appendicitis",
        Treatment: "Appendectomy",
        OriginalWard: wards[2]._id,
        DischargeWard: wards[1]._id,
      },
      {
        Patient_ID: patients[3]._id,
        Doctor_ID: doctors[0]._id,
        Disease: "Diabetes Type 2",
        Treatment: "Metformin, insulin therapy",
        OriginalWard: wards[0]._id,
      },
      {
        Patient_ID: patients[4]._id,
        Doctor_ID: doctors[1]._id,
        Disease: "Pneumonia",
        Treatment: "Antibiotics, oxygen therapy",
        OriginalWard: wards[1]._id,
      },
      {
        Patient_ID: patients[5]._id,
        Doctor_ID: doctors[3]._id,
        Disease: "Gastroenteritis",
        Treatment: "Fluid replacement, antibiotics",
        OriginalWard: wards[1]._id,
      },
    ])
    console.log("Seeded medical history")

    // Seed Payments
    const payments = await Payment.insertMany([
      {
        Patient_ID: patients[0]._id,
        TotalBill: 150000,
        AdvancePayment: 50000,
        FinalPayment: 100000,
        PaymentMethod: "Cash",
        PaymentStatus: "Paid",
      },
      {
        Patient_ID: patients[1]._id,
        TotalBill: 75000,
        AdvancePayment: 25000,
        FinalPayment: 50000,
        PaymentMethod: "Bank_Transfer",
        PaymentStatus: "Pending",
      },
      {
        Patient_ID: patients[2]._id,
        TotalBill: 300000,
        AdvancePayment: 100000,
        FinalPayment: 200000,
        PaymentMethod: "Credit_Card",
        PaymentStatus: "Paid",
        CC_Num: "4532-1234-5678-9012",
        CardHoldersName: "Ibrahim Musa",
      },
      {
        Patient_ID: patients[3]._id,
        TotalBill: 200000,
        AdvancePayment: 80000,
        FinalPayment: 120000,
        PaymentMethod: "Check",
        PaymentStatus: "Pending",
        Check_Num: "CHK001234",
      },
      {
        Patient_ID: patients[4]._id,
        TotalBill: 120000,
        AdvancePayment: 40000,
        FinalPayment: 80000,
        PaymentMethod: "Cash",
        PaymentStatus: "Paid",
      },
      {
        Patient_ID: patients[5]._id,
        TotalBill: 90000,
        AdvancePayment: 30000,
        FinalPayment: 60000,
        PaymentMethod: "Bank_Transfer",
        PaymentStatus: "Pending",
      },
    ])
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

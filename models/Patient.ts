import mongoose from "mongoose"

const startOfDay = (value: Date) => new Date(value.getFullYear(), value.getMonth(), value.getDate())

const PatientSchema = new mongoose.Schema(
  {
    FirstName: {
      type: String,
      required: [true, "First name is required"],
      trim: true,
    },
    LastName: {
      type: String,
      required: [true, "Last name is required"],
      trim: true,
    },
    Age: {
      type: Number,
      required: [true, "Age is required"],
      min: [0, "Age must be 0 or greater"],
    },
    Height: {
      type: Number,
      min: [0, "Height must be 0 or greater"],
    },
    Weight: {
      type: Number,
      min: [0, "Weight must be 0 or greater"],
    },
    Gender: {
      type: String,
      required: [true, "Gender is required"],
      enum: ["Male", "Female", "Other"],
    },
    Phone_Num: {
      type: String,
      required: [true, "Phone number is required"],
      validate: {
        validator: (v: string) => /^\+234[0-9]{10}$/.test(v) || /^0[0-9]{10}$/.test(v),
        message: "Please enter a valid Nigerian phone number",
      },
    },
    Address: {
      type: String,
      required: [true, "Address is required"],
      trim: true,
    },
    Blood_Grp: {
      type: String,
      required: [true, "Blood group is required"],
      enum: {
        values: ["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"],
        message: "Blood group must be A, B, AB, or O with + or -",
      },
    },
    Admit_Date: {
      type: Date,
      required: [true, "Admit date is required"],
      validate: {
        validator: function (this: any, v: Date) {
          if (!v) return false
          if (!this.isNew) return true
          return startOfDay(v) >= startOfDay(new Date())
        },
        message: "Admit date must be today or later for new admissions",
      },
    },
    Discharge_Date: {
      type: Date,
      validate: {
        validator: function (this: any, v: Date) {
          if (!v) return true
          if (!this.isNew && !this.isModified("Discharge_Date")) return true
          if (!this.Admit_Date) return false
          return startOfDay(v) >= startOfDay(this.Admit_Date)
        },
        message: "Discharge date must be after admit date",
      },
    },
    Status: {
      type: String,
      required: [true, "Status is required"],
      enum: ["Admitted", "Discharged"],
      default: "Admitted",
    },
    Treatment_Type: {
      type: String,
      required: [true, "Treatment type is required"],
      trim: true,
    },
    DoctorID: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Doctor",
      required: [true, "DoctorID is required"],
    },
    Ward_ID: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Ward",
      required: [true, "Ward_ID is required"],
    },
  },
  {
    timestamps: true,
  },
)

// Compound index for better query performance
PatientSchema.index({ Admit_Date: 1, Status: 1 })

// Add virtual for PatientID
PatientSchema.virtual("PatientID").get(function () {
  return this._id.toHexString()
})
PatientSchema.set("toJSON", { virtuals: true })

export default mongoose.models.Patient || mongoose.model("Patient", PatientSchema)

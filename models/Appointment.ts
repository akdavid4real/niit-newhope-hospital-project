import mongoose from "mongoose"

const startOfDay = (value: Date) => new Date(value.getFullYear(), value.getMonth(), value.getDate())

const AppointmentSchema = new mongoose.Schema(
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
    Phone_Num: {
      type: String,
      required: [true, "Phone number is required"],
      validate: {
        validator: (v: string) => /^\+234[0-9]{10}$/.test(v) || /^0[0-9]{10}$/.test(v),
        message: "Please enter a valid Nigerian phone number",
      },
    },
    Email: {
      type: String,
      trim: true,
      lowercase: true,
      validate: {
        validator: (v: string) => !v || /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v),
        message: "Please enter a valid email address",
      },
    },
    Age: {
      type: Number,
      min: [0, "Age must be 0 or greater"],
    },
    Gender: {
      type: String,
      enum: ["Male", "Female", "Other"],
    },
    Preferred_Date: {
      type: Date,
      required: [true, "Preferred date is required"],
      validate: {
        validator: (v: Date) => !!v && startOfDay(v) >= startOfDay(new Date()),
        message: "Preferred date must be today or later",
      },
    },
    Reason_For_Visit: {
      type: String,
      required: [true, "Reason for visit is required"],
      trim: true,
    },
    Notes: {
      type: String,
      trim: true,
    },
    Status: {
      type: String,
      required: [true, "Status is required"],
      enum: ["Pending", "Confirmed", "Cancelled", "Completed"],
      default: "Pending",
    },
    Assigned_DoctorID: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Doctor",
      default: null,
    },
    Assigned_Ward_ID: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Ward",
      default: null,
    },
  },
  {
    timestamps: true,
  },
)

AppointmentSchema.index({ Status: 1, Preferred_Date: 1 })

export default mongoose.models.Appointment || mongoose.model("Appointment", AppointmentSchema)

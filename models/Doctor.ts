import mongoose from "mongoose"

const DoctorSchema = new mongoose.Schema(
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
    Employment_Type: {
      type: String,
      required: [true, "Employment type is required"],
      enum: {
        values: ["Resident", "Visiting"],
        message: "Employment type must be either Resident or Visiting",
      },
    },
    Ward_ID: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Ward",
      required: [true, "Ward assignment is required"],
    },
  },
  {
    timestamps: true,
  },
)

// Compound index for better query performance
DoctorSchema.index({ Ward_ID: 1, Employment_Type: 1 })

export default mongoose.models.Doctor || mongoose.model("Doctor", DoctorSchema)

import mongoose from "mongoose"

const MedicalHistorySchema = new mongoose.Schema(
  {
    Patient_ID: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Patient",
      required: [true, "Patient ID is required"],
    },
    Doctor_ID: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Doctor",
      required: [true, "Doctor ID is required"],
    },
    Disease: {
      type: String,
      required: [true, "Disease/condition is required"],
      trim: true,
      validate: {
        validator: (v: string) => v.length > 0,
        message: "Disease cannot be empty",
      },
    },
    Treatment: {
      type: String,
      required: [true, "Treatment is required"],
      trim: true,
    },
    OriginalWard: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Ward",
      required: [true, "Original ward is required"],
    },
    DischargeWard: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Ward",
    },
  },
  {
    timestamps: true,
  },
)

export default mongoose.models.MedicalHistory || mongoose.model("MedicalHistory", MedicalHistorySchema)

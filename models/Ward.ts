import mongoose from "mongoose"

const WardSchema = new mongoose.Schema(
  {
    WardName: {
      type: String,
      required: [true, "Ward name is required"],
      enum: {
        values: ["OPD", "ICU", "CCU", "Spl_Ward", "General_Ward", "Emergency"],
        message: "Ward name must be one of: OPD, ICU, CCU, Spl_Ward, General_Ward, Emergency",
      },
    },
    TotalBeds: {
      type: Number,
      required: [true, "Total beds is required"],
      min: [1, "Total beds must be at least 1"],
    },
    AvailableBeds: {
      type: Number,
      required: [true, "Available beds is required"],
      min: [0, "Available beds cannot be negative"],
      validate: {
        validator: function (this: any, value: number) {
          return value <= this.TotalBeds
        },
        message: "Available beds cannot exceed total beds",
      },
    },
    WardType: {
      type: String,
      required: [true, "Ward type is required"],
      trim: true,
    },
  },
  {
    timestamps: true,
  },
)

export default mongoose.models.Ward || mongoose.model("Ward", WardSchema)

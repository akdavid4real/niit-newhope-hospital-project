import mongoose from "mongoose"

const PaymentSchema = new mongoose.Schema(
  {
    Patient_ID: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Patient",
      required: [true, "Patient ID is required"],
    },
    TotalBill: {
      type: Number,
      required: [true, "Total bill is required"],
      min: [0, "Total bill must be positive"],
    },
    AdvancePayment: {
      type: Number,
      required: [true, "Advance payment is required"],
      min: [0, "Advance payment must be positive"],
    },
    FinalPayment: {
      type: Number,
      required: [true, "Final payment is required"],
      min: [0, "Final payment must be positive"],
    },
    PaymentMethod: {
      type: String,
      required: [true, "Payment method is required"],
      enum: ["Cash", "Credit_Card", "Check", "Bank_Transfer"],
    },
    PaymentStatus: {
      type: String,
      required: [true, "Payment status is required"],
      enum: ["Paid", "Pending"],
      default: "Pending",
    },
    CC_Num: {
      type: String,
      validate: {
        validator: function (this: any, v: string) {
          return this.PaymentMethod !== "Credit_Card" || (v && v.length > 0)
        },
        message: "Credit card number is required for credit card payments",
      },
    },
    CardHoldersName: {
      type: String,
      validate: {
        validator: function (this: any, v: string) {
          return this.PaymentMethod !== "Credit_Card" || (v && v.length > 0)
        },
        message: "Card holder name is required for credit card payments",
      },
    },
    Check_Num: {
      type: String,
      validate: {
        validator: function (this: any, v: string) {
          return this.PaymentMethod !== "Check" || (v && v.length > 0)
        },
        message: "Check number is required for check payments",
      },
    },
  },
  {
    timestamps: true,
  },
)

// Pre-save middleware to calculate final payment
PaymentSchema.pre("save", function (next) {
  this.FinalPayment = this.TotalBill - this.AdvancePayment
  next()
})

// Compound indexes for better query performance
PaymentSchema.index({ Patient_ID: 1, PaymentStatus: 1 })
PaymentSchema.index({ createdAt: 1, AdvancePayment: 1 })

export default mongoose.models.Payment || mongoose.model("Payment", PaymentSchema)

import mongoose from "mongoose";

const projectSchema = new mongoose.Schema(
  {
    projectName: { type: String, required: true },
    ministry: { type: String, required: true },
    sector: {
      type: String,
      enum: [
        "Transport & Logistics",
        "Power & Energy",
        "Water & Irrigation",
        "Urban Infrastructure",
        "Telecom",
        "Petroleum & Gas",
        "Other",
      ],
      default: "Other",
    },
    state: { type: String },
    implementingAgency: { type: String },

    sanctionedCost: { type: Number, required: true }, // in crores
    revisedCost: { type: Number, required: true }, // in crores
    expenditureSoFar: { type: Number, default: 0 }, // in crores

    startDate: { type: Date, required: true },
    originalCompletionDate: { type: Date, required: true },
    revisedCompletionDate: { type: Date },

    physicalProgress: { type: Number, default: 0 }, // percentage
    financialProgress: { type: Number, default: 0 }, // percentage

    status: {
      type: String,
      enum: ["On Track", "Delayed", "Cost Overrun", "Critical", "Completed"],
      default: "On Track",
    },

    riskScore: { type: Number, default: 0 }, // 0-100, calculated field

    latitude: { type: Number },
    longitude: { type: Number },

    lastUpdated: { type: Date, default: Date.now },
  },
  { timestamps: true }
);

// Virtual: cost overrun %
projectSchema.virtual("costOverrunPercent").get(function () {
  if (!this.sanctionedCost) return 0;
  return (
    ((this.revisedCost - this.sanctionedCost) / this.sanctionedCost) * 100
  );
});

// Virtual: delay in days
projectSchema.virtual("delayDays").get(function () {
  if (!this.revisedCompletionDate) return 0;
  const diff =
    new Date(this.revisedCompletionDate) - new Date(this.originalCompletionDate);
  return Math.round(diff / (1000 * 60 * 60 * 24));
});

projectSchema.set("toJSON", { virtuals: true });
projectSchema.set("toObject", { virtuals: true });

export default mongoose.model("Project", projectSchema);

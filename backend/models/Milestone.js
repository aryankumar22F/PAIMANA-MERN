import mongoose from "mongoose";

const milestoneSchema = new mongoose.Schema(
  {
    project: { type: mongoose.Schema.Types.ObjectId, ref: "Project", required: true },
    title: { type: String, required: true },
    dueDate: { type: Date, required: true },
    completedDate: { type: Date },
    status: {
      type: String,
      enum: ["Pending", "Completed", "Overdue"],
      default: "Pending",
    },
    remarks: { type: String },
  },
  { timestamps: true }
);

export default mongoose.model("Milestone", milestoneSchema);

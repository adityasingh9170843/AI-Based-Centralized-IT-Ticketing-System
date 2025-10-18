import mongoose from "mongoose";

const ticketSchema = mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    department: {
      type: String,
    },
    priority: {
      type: String,
      default: "Medium",
    },
    suggestedResponse: {
      type: String,
    },
    assignedEngineer: {
      type: String,
      ref:"Engineer",
      default: "Unassigned",
    },
    status: {
      type: String,
      default: "Pending",
    },
  },
  {
    timestamps: true,
  }
);

export default mongoose.model("Ticket", ticketSchema);

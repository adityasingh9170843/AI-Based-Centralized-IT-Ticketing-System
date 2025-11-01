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
    category: {
      type: String,
    },
    department: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Department",
    },
    priority: {
      type: String,
      enum: ["Low", "Medium", "High"],
      default: "Medium",
    },
    assignedEngineer: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Engineer",
    },
    status: {
      type: String,
      enum: ["Open", "In Progress", "Resolved","Closed"],
      default: "Open",
    },
    resolution:{
        type: String
    },
    comments:[{
      author:{type: mongoose.Schema.Types.ObjectId, ref: "Engineer"},
      message: {type: String},
      createdAt: {type: Date, default: Date.now},
    }],
    closedBy:{
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      default: null
    },
    closedAt: {
      type: Date,
      default: null
    },
    createdAt: {
      type: Date,
      default: Date.now,
    },
  },
  {
    timestamps: true,
  }
);

const Ticket = mongoose.model("Ticket", ticketSchema);
export default Ticket;

import mongoose from "mongoose";

const engineerSchema = mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
    },
    department: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Department",
    },
    expertise: [
      {
        type: String,
      },
    ],
    role: {
      type: String,
      default: "engineer",
    },
    tickets: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Ticket",
      },
    ],
  },
  {
    timestamps: true,
  }
);

const Engineer = mongoose.model("Engineer", engineerSchema);
export default Engineer;

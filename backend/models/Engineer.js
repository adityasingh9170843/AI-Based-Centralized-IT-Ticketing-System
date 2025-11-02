import mongoose from "mongoose";

const EngineerSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    department: { type: String },
    expertise: { type: String },
    role: { type: String, default: "engineer" },
  },
  { timestamps: true }
);

const Engineer = mongoose.model("Engineer", EngineerSchema);
export default Engineer;

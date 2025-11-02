import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import Engineer from "../models/Engineer.js";

const signEngineerToken = (engineer) => {
  return jwt.sign(
    { id: engineer._id, role: engineer.role },
    process.env.JWT_SECRET,
    { expiresIn: "30d" }
  );
};

const cookieOptions = {
  httpOnly: true,
  secure: true, // set to true for sameSite None; consider toggling by NODE_ENV if needed
  sameSite: "None",
};

export const registerEngineer = async (req, res) => {
  try {
    const { name, email, password, department, expertise } = req.body;
    if (!name || !email || !password) {
      return res.status(400).json({ error: "Name, email, and password are required" });
    }

    const existing = await Engineer.findOne({ email });
    if (existing) {
      return res.status(400).json({ error: "Engineer already exists" });
    }

    const salt = await bcrypt.genSalt(10);
    const hash = await bcrypt.hash(password, salt);

    const engineer = await Engineer.create({
      name,
      email,
      password: hash,
      department,
      expertise,
      role: "engineer",
    });

    const token = signEngineerToken(engineer);
    res.cookie("engineer_token", token, cookieOptions);

    const { password: _, ...safe } = engineer.toObject();
    return res.status(201).json({ engineer: safe, token });
  } catch (err) {
    console.error("registerEngineer error", err);
    return res.status(500).json({ error: "Failed to register engineer" });
  }
};

export const loginEngineer = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({ error: "Email and password are required" });
    }

    const engineer = await Engineer.findOne({ email });
    if (!engineer) {
      return res.status(400).json({ error: "Invalid credentials" });
    }

    const match = await bcrypt.compare(password, engineer.password);
    if (!match) {
      return res.status(400).json({ error: "Invalid credentials" });
    }

    const token = signEngineerToken(engineer);
    res.cookie("engineer_token", token, cookieOptions);

    const { password: _, ...safe } = engineer.toObject();
    return res.status(200).json({ engineer: safe, token });
  } catch (err) {
    console.error("loginEngineer error", err);
    return res.status(500).json({ error: "Failed to login engineer" });
  }
};

export const logoutEngineer = async (_req, res) => {
  try {
    res.clearCookie("engineer_token");
    return res.status(200).json({ message: "Logged out" });
  } catch (err) {
    return res.status(500).json({ error: "Failed to logout" });
  }
};

export const meEngineer = async (req, res) => {
  try {
    const engineer = await Engineer.findById(req.user?.id).select("-password");
    if (!engineer) return res.status(404).json({ error: "Engineer not found" });
    return res.status(200).json(engineer);
  } catch (err) {
    return res.status(500).json({ error: "Failed to load profile" });
  }
};

import User from "../models/userModel.js";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";

const generateToken = (user) => {
  return jwt.sign({ email: user.email, id: user._id }, process.env.JWT_SECRET, {
    expiresIn: "30d",
  });
};

export const register = async (req, res) => {
  try {
    const { name, email, password, role } = req.body;

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ error: "User already exists" });
    }

    const salt = await bcrypt.genSalt(10);
    const hash = await bcrypt.hash(password, salt);

    const user = await User.create({
      name,
      email,
      password: hash,
      role,
    });

    const token = generateToken(user);
    res.cookie("token", token, {
      httpOnly: true,
      secure: true,
      sameSite: "None",
    });
    res.status(201).json({ user, token });
  } catch (error) {
    res.status(500).json({ error: "Error registering user" });
  }
};

export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await UserModel.findOne({ email });
    if (!user) {
      res.status(400);
      throw new Error("User does not exist");
    }

    bcrypt.compare(password, user.password, (err, result) => {
      if (err) {
        res.send("password not matched");
      } else if (result) {
        let token = generateToken(user);
        res.cookie("token", token, {
          httpOnly: true,
          secure: true,
          sameSite: "None",
        });
        res.status(200).json({
          user,
          token,
        });
      }
    });
  } catch (error) {
    res.status(400);
    throw new Error(error.message);
  }
};


export const logout = (req, res) => {
  res.clearCookie("token");
  res.status(200).json({ message: "Logged out successfully" });
};

import jwt from "jsonwebtoken";
import User from "../models/userModel.js";
import Engineer from "../models/engineerModel.js";

export const verifyToken = async(req,res,next) =>{
    const token = req.cookies.token;
    if(!token){
        return res.status(401).json({error:"Unauthorized"});
    }
    try{
    let decoded = jwt.verify(token,process.env.JWT_SECRET);
    let user = await User.findById(decoded.id).select("-password");
        req.LoggedInUser = user;
        next();
    }
    catch(error){
        return res.status(401).json({error:"Unauthorized"});
    }
}


export const authorizeRoles = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role))
      return res.status(403).json({ message: "Access denied" });
    next();
  };
};

export const protectEngineer = async (req, res, next) => {
  try {
    const token = req.cookies.engineer_token;
    if (!token) return res.status(401).json({ error: "Unauthorized" });

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const engineer = await Engineer.findById(decoded.id).select("-password");
    if (!engineer) return res.status(401).json({ error: "Unauthorized" });

    req.user = { id: engineer._id.toString(), role: engineer.role };
    req.engineer = engineer;
    next();
  } catch (err) {
    return res.status(401).json({ error: "Unauthorized" });
  }
};
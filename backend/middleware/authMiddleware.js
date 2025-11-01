import jwt from "jsonwebtoken";
import User from "../models/userModel.js";

export const verifyToken = async(req,res,next) =>{
    const token = req.cookies.token;
    if(!token){
        return res.status(401).json({error:"Unauthorized"});
    }
    try{
        let decoded = jwt.verify(token,process.env.JWT_SECRET);
        let user = await User.findById(decoded.user.id).select("-password");
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
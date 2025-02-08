import { User } from "../models/user.model.js";
import { ApiError } from "../utils/ApiError.js";
import { asyncHandeller } from "../utils/asyncHandeller.js";
import jwt from "jsonwebtoken"

export const verifyToken = asyncHandeller(async(req, res, next)=> {
   try {
    const token =  req.headers?.authorization.replace("Bearer ", "");

    if(!token) return ApiError(500, "Unauthorized access");

    const decodeToken = jwt.verify(token,  process.env.ACCESS_TOKEN_SECRET)
    // console.log(decodeToken);
    
    
     const user = await User.findById(decodeToken._id).select("-password -refreshToken")
    
    console.log("user"+ user);
    
    if(!user) {
        return ApiError(500, "User not found");
    }
    req.user = user;
    next();
   } catch (error) {
    throw new ApiError(400, "Unauthorized access")
   }
 })
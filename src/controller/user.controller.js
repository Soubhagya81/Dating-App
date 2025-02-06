import  {asyncHandeller}  from "../utils/asyncHandeller.js";
import {ApiError} from "../utils/ApiError.js"
import { User} from "../models/user.model.js"
import { ApiResponse } from "../utils/ApiResponse.js";

const registerUser = asyncHandeller(async(req, res)=> {
    const {username ,email, password, fullname : {firstname, lastname}} = req.body;
   
    if([username ,email, password, firstname, lastname].some((field)=> field?.trim() == '')){
        throw new ApiError(400, "All fields are required")
    }

    // Check if user already exists
    const existedUser = await User.findOne({
        $or: [{ username }, { email }]
    })

    if(existedUser){
        throw new ApiError(409, "User with email or username already exists")
    }

    //create user
    const user = await User.create(
        {
            username,
            email,
            password,
            firstname,
            lastname,
        }
    )

    console.log(user)

    const createdUser = await User.findById(user._id).select("-password -refreshToken");

    if (!createdUser) throw new ApiError(500, "Something went wrong while registering user");

    return res.status(201).json(
        new ApiResponse(201, createdUser, "User registered successfully")
    )
    
})


export  {registerUser}
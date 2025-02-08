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

    const createdUser = await User.findById(user._id).select("-password -refreshToken");

    if (!createdUser) throw new ApiError(500, "Something went wrong while registering user");

    return res.status(201).json(
        new ApiResponse(201, createdUser, "User registered successfully")
    )
    
})


const loginUser = asyncHandeller( async(req, res)=> {

    const {username, password} = req.body;

    const user = await User.findOne({
        username : username
    })

    if (!user) throw new ApiError(500, "User not Exists");

    const isPasswordCorrect = await user.isPasswordCorrect(password)

    if (!isPasswordCorrect) throw new ApiError(401, "Invalid Credentials");

    console.log(user);
    
    const accessToken = user.generateAccessToken();
    const refreshToken = user.generateRefreshToken();

    const loggedInUser = await User.findById(user._id).select("-password -refreshToken")

    console.log(loggedInUser);
    
   return res.status(200)
             .cookie(accessToken)
             .cookie(refreshToken)
             .json( new ApiResponse(200, {
                user : loggedInUser, accessToken, refreshToken
             }))
    
    
})

const logoutUser = asyncHandeller(async(req, res) => {
    
     await User.findByIdAndUpdate(
        req.user._id,
        {
            $unset : {
                refreshToken : 1
            }

        },
        {
            new : true
        }
    )

    return res.status(200)
              .clearCookie("accessToken")
              .clearCookie("refreshToken")
              .json(
        new ApiResponse(200, {}, "User logged out successfully")
 
    )
})


  


export  {registerUser,
         loginUser,
         logoutUser}
import { ApiError } from "../utils/ApiError.js";
import { asynHandler } from "../utils/asyncHandler.js";
import { User } from '../models/user.model.js'
import { uploadOnCloudinary } from "../utils/cloudinary.js";
import { ApiResponse } from "../utils/ApiResponse.js";

// const registerUser = asynHandler( async(req, res)=>{
//     // get user details from frontend
//     // validation - not empty
//     // check if user already exist
//     // check for images, check for avatar
//     // upload them to cloudinary
//     // create user object - create entry in db
//     // remove password and refreshtoken field from response
//     // check for user creation
//     // return response
    
// })  

const registerUser = async (req, res) => {
    try {
        
    
    const {email, fullname, username, password} = req.body

    if(!email || !fullname || !username || !password){
        throw new ApiError(409, "All fields are required ")
    }

    const userExist = await User.findOne({
        $or:[{email}, {username}]
    })

    if(userExist) throw new ApiError(309, "User with this username or email already exist")
    
    const avatarLocalPath = req.files?.avatar?.[0]?.path;
    const coverImgLocalPath = req.files?.coverImage?.[0]?.path;
    
    const avatar = await uploadOnCloudinary(avatarLocalPath)
    const coverImg = coverImgLocalPath? await uploadOnCloudinary(coverImgLocalPath) : null
    
    if(!avatar){
        throw new ApiError(500, "Failed to upload on cloudinary")
    }

    const user = await User.create({
        email,
        fullname,
        username,
        password,
        avatar: avatar.url,
        coverImg: coverImg?.url || ""
    })

    const createdUser = await User.findById(user._id).select("-password") 

    return res.status(200).json(
        new ApiResponse(200, createdUser, "User created successfully")
    )

    } catch (error) {
        next(error)
    }
}

const loginUser = async(req, res) => {
    const {email, password} = req.body

    if(!email || !password) return res.status(404).json({message:"All fields are required"})
    
    return res.status(200)
            .json({email, password})
}

export {registerUser, loginUser}
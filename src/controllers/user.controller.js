import { ApiError } from "../utils/ApiError.js";
import { User } from '../models/user.model.js'
import { uploadOnCloudinary } from "../utils/cloudinary.js";
import { ApiResponse } from "../utils/ApiResponse.js"

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

const generateAccessAndRefreshToken = async (userId) =>{
    try {
        const user = await User.findById(userId)
        const accessToken = user.generateAccessToken()
        const refreshToken = user.generateRefreshToken()

        user.refreshToken = refreshToken;
        await user.save({validateBeforeSave:false}) 

        return {accessToken, refreshToken}

    } catch (error) {
        throw new ApiError(500, "Something went wrong while generating refresh and access token")
    }
}

const registerUser = async (req, res, next) => {
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

const loginUser = async (req, res, next) => {
    try {
        const { email, username, password } = req.body || {}

        if (!(email || username) || !password) {
            throw new ApiError(
                400,
                "Username/email and password are required!"
            );
        }
        const user = await User.findOne({
            $or: [{ email }, { username }]
        });

        if (!user) {
            throw new ApiError(400, "User does not exist!");
        }

        const isPasswordCorrect =
            await user.isPasswordCorrect(password);

        if (!isPasswordCorrect) {
            throw new ApiError(400, "Invalid credentials!");
        }

        const { accessToken, refreshToken } =
            await generateAccessAndRefreshToken(user._id);

        const loggedInUser = await User
            .findById(user._id)
            .select("-password -refreshToken");

        const options = {
            httpOnly: true,
            secure: true
        };

        return res
            .status(200)
            .cookie("accessToken", accessToken, options)
            .cookie("refreshToken", refreshToken, options)
            .json(
                new ApiResponse(
                    200,
                    {
                        user: loggedInUser,
                        accessToken,
                        refreshToken
                    },
                    "User logged in successfully"
                )
            );

    } catch (error) {
        throw error;
    }
};

const logoutUser = async (req, res) => {
        await User.findByIdAndUpdate(
            req.user._id,
            {
                $set:{ refreshToken: undefined }
            },
            {
                new:true
            }
        )

        const options = {
            httpOnly: true,
            secure: true
        }

        return res
        .status(200)
        .clearCookie("accessToken", options)
        .clearCookie("refreshToken", options)
        .json(new ApiResponse(200, {}, "User logged out"))

}

export {registerUser, loginUser, logoutUser}
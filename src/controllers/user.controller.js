import { asynHandler } from "../utils/asyncHandler.js";

const registerUser = asynHandler( async(req, res)=>{
    // get user details from frontend
    // validation - not empty
    // check if user already exist
    // check for images, check for avatar
    // upload them to cloudinary
    // create user object - create entry in db
    // remove password and refreshtoken field from response
    // check for user creation
    // return response
    
    const {fullname, email, username, password} = req.body
    console.log("Fullname: ",fullname," Email:", email, "Password: ", password);
})  

export {registerUser}
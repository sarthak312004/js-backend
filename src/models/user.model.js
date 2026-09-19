import 'dotenv/config'
import mongoose,{Schema, model} from 'mongoose'
import jwt from 'jsonwebtoken'
import bcrypt from 'bcrypt'

const userSchema = new Schema(
    {
        username:{
            type:String,
            required:true,
            unique:true,
            lowercase:true,
            trim:true,
            index:true
        },
        email:{
            type:String,
            required:true,
            unique:true,
            lowercase:true,
            trim:true
        },
        fullname:{
            type:String,
            required:true,
            trim:true,
            index: true
        },
        avatar:{
            type:String,
            required: true,
        },
        coverImg:{
            type:String,
        },
        watchHistory:[
            {
                type:Schema.Types.ObjectId,
                ref:"Video"
            }
        ],
        password:{
            type: String,
            required: [true, "Password is required"]
        },
        refreshToken:{
            type:String
        }

    },{timestamps:true}
)
// AUTOMATIC: Runs right before .save() to hash new/changed passwords
userSchema.pre("save", async function () {
    if(!this.isModified("password")) return // Skip if password hasn't changed

    this.password = await bcrypt.hash(this.password, 10) // Hash password with 10 salt rounds
})

// MANUAL: Called manually after finding user (e.g., await user.isPasswordCorrect(inputPassword))
userSchema.methods.isPasswordCorrect = async function (password){
    return await bcrypt.compare(password, this.password) // Compares plain text with hashed DB password; returns boolean
}

userSchema.methods.generateAccessToken = function(){
   return jwt.sign(
        {
            _id:this._id,
            email:this.email,
            username:this.username,
            fullname:this.fullname
        },
        process.env.ACCESS_TOKEN_SECRETE,
        {
            expiresIn: process.env.ACCESS_TOKEN_EXPIRY
        }
    )
}

userSchema.methods.generateRefreshToken = function(){
    return jwt.sign(
        {
            _id:this._id,
        },
        process.env.REFRESH_TOKEN_SECRETE,
        {
            expiresIn: process.env.REFRESH_TOKEN_EXPIRY
        }
    )
}
export const User = model('User', userSchema)
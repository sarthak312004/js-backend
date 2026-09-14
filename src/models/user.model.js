import mongoose,{Schema, model, trusted} from 'mongoose'

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
        refershToken:{
            type:String
        }

    },{timestamps:true}
)
export const User = model('User', userSchema)
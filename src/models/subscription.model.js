import {Schema ,model} from 'mongoose'

const subscriptionSchema = new Schema (
    {

    },{timestamps:true}
)


export const Subscription = model("Subscription", subscriptionSchema)

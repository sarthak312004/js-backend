import 'dotenv/config'
import mongoose from 'mongoose'
import express from 'express'
import connectDB from './db/index.js'

connectDB()

// ;(async()=>{
//     try {
//        const connectionInstance = await mongoose.connect(process.env.MONGO_URI)
//        console.log(connectionInstance);
//        app.listen(process.env.PORT, ()=>{
//         console.log(`Listing to ${process.env.PORT}`);
//        })
//     } catch (error) {
//         console.log("ERROR",error);
//     }
// })()
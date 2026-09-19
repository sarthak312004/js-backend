import express from 'express'
import cors from 'cors'
import cookieParser from 'cookie-parser'

const app = express()

// Controls which frontend can talk to backend
app.use(cors({
    origin: process.env.CORS_ORIGIN,
    credentials: true
}))

app.use(express.json({limit:"16kb"})) //This allows Express to understand JSON data sent in the request body.
app.use(express.urlencoded({extended: true, limit:"16kb"})) //parse URL-encoded form data.
app.use(express.static("public")) //The files inside the public folder can be accessed directly.
app.use(cookieParser()) // This middleware reads cookies sent by the browser and makes them easily accessible through: req.cookies

//routes import
import userRouter from './routes/user.routes.js'

//routes declaration
app.use("/api/v1/users", userRouter)

export {app}
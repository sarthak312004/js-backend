import {Router} from 'express'
import { loginUser, registerUser } from '../controllers/user.controller.js'
import { asynHandler } from '../utils/asyncHandler.js'
import upload from '../middlewares/multer.middleware.js'

const router = Router()

router.post("/register",
    upload.fields([
        {
            name:"avatar",
            maxCount: 1
        },
        {
            name:"coverImage",
            maxCount: 1
        }
    ]), 
    asynHandler(registerUser))

router.post("/login", asynHandler(loginUser))

export default router
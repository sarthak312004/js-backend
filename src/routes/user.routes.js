import {Router} from 'express'
import { loginUser, logoutUser, registerUser } from '../controllers/user.controller.js'
import { asynHandler } from '../utils/asyncHandler.js'
import upload from '../middlewares/multer.middleware.js'
import verifyJwt from '../middlewares/auth.middleware.js'

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

//secured routes
router.post('/logout', verifyJwt , asynHandler(logoutUser))

export default router
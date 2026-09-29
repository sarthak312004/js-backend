import {Router} from 'express'
import { 
    changeCurrentPassword, 
    getCurrentUser, 
    getCurrentUserProfile, 
    getWatchHistory, 
    loginUser, 
    logoutUser, 
    refreshAccessToken, 
    registerUser, 
    updateAccountDetails, 
    updateUserAvatar, 
    updateUserCoverImage } from '../controllers/user.controller.js'

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

router.post('/refresh-token', asynHandler(refreshAccessToken))

router.post('/change-password', verifyJwt, asynHandler(changeCurrentPassword))

router.get('/current-user', verifyJwt, asynHandler(getCurrentUser))

router.patch('/update-account', verifyJwt, asynHandler(updateAccountDetails))

router.patch('/avatar', verifyJwt, upload.single("avatar"), asynHandler(updateUserAvatar))

router.patch('/coverImage', verifyJwt, upload.single("coverImage"), asynHandler(updateUserCoverImage))

router.get('/c/:username', verifyJwt, asynHandler(getCurrentUserProfile))

router.get('/history', verifyJwt, asynHandler(getWatchHistory))

export default router
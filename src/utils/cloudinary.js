import 'dotenv/config'
import { v2 as cloudinary } from 'cloudinary';
import fs from "fs" // fs-file system

// Authenticate Cloudinary using environment credentials
cloudinary.config({ 
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME, 
    api_key: process.env.CLOUDINARY_API_KEY, 
    api_secret: process.env.CLOUDINARY_API_SECRETE
});

// Helper function: Uploads a local file to Cloudinary and cleans up local storage on failure
const uploadOnCloudinary = async (localFilePath) => {
    try {
        if (!localFilePath) return null
        
        // Step 1: Upload local file to Cloudinary cloud storage
        const response = await cloudinary.uploader.upload(localFilePath, {
            resource_type: "auto" // Automatically detects file type (image, video, etc.)
        })
        
        // Step 2: Delete local file after successful upload to free server space
        fs.unlinkSync(localFilePath)
        return response
    } catch (error) {
        // Cleanup: Remove local temp file if Cloudinary upload fails
        if (localFilePath && fs.existsSync(localFilePath)) {
            fs.unlinkSync(localFilePath)
        }
        console.error("Cloudinary upload failed:", error)
        return null;
    }
}

export { uploadOnCloudinary }
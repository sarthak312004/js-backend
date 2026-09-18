import multer from 'multer'

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, './public/temp') // Local folder path to temporarily store uploaded files
    },
    filename: function (req, file, cb) {
        cb(null, file.originalname) // Keeps original file name
    }
})

export const upload = multer({ storage })
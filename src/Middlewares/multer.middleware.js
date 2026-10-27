import multer from "multer"
import fs from "fs";
import crypto from "crypto";
import { allowedExtensions } from "../Common/constants.js";
import { BadRequestException } from "../Common/Utils/Errors/exception.error.js";


export const multerUpload = ({ desiredPath }) => {
    // Validate if the directory exists
    const fullDestinationPath = `uploads/${desiredPath}`
    if (!fs.existsSync(fullDestinationPath)) {
        fs.mkdirSync(fullDestinationPath, { recursive: true });
    }
    // Store the file
    const storage = multer.diskStorage({
        destination: function (req, file, cb) { cb(null, fullDestinationPath) },
        filename: function (req, file, cb) {
            const suffix = crypto.randomBytes(5) + Date.now();
            cb(null, `${suffix}-${file.originalname}`);
        }
    });

    const fileFilter = (req, file, cb) => {
        const [fileType, inputFileExtension] = file.mimetype.split('/'); // image/png -> image or png,
        const fileExtensions = allowedExtensions[fileType] // ['png', 'jpeg']
        if (fileExtensions.includes(inputFileExtension)) {
            cb(null, true);
        } else {
            cb(new BadRequestException({ message: 'Invalid file type' }), false);
        }

        return multer({ fileFilter, storage });
    }

    return multer({ storage });
}
import { fileTypeFromFile } from 'file-type';
import fs from 'fs/promises';

export const validateFile = (allowedExtensions) => {
    return async (req, res, next) => {
        let files = [];
        // Single file
        if (req.file) {
            files = [req.file];
        }
        // Multiple files (.array)
        else if (Array.isArray(req.files)) {
            files = req.files;
        }
        // Multiple fields (.fields)
        else if (req.files) {
            for (const field of Object.values(req.files)) {
                files.push(...field);
            }
        }
        if (files.length === 0) {
            return res.status(400).json({
                message: 'No files uploaded'
            });
        }
        // Delete uploaded files
        const deleteFiles = async () => {
            for (const file of files) {
                try {
                    await fs.unlink(file.path);
                } catch (error) {
                    console.log(error);
                }
            }
        };
        try {
            for (const file of files) {
                const fileType = await fileTypeFromFile(file.path);
                if (!fileType || !allowedExtensions.includes(fileType.ext)) {
                    await deleteFiles();
                    return res.status(400).json({
                        message: 'Invalid file type'
                    });
                }
                file.detectedType = fileType;
            }
            return next();
        } catch (error) {
            await deleteFiles();
            return next(error);
        }
    };
};

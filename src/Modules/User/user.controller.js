import { Router } from 'express';
import { deleteUserProfileService, getAllUsersService, getUserProfileService, updateUserProfileService, uploadProfilePictureService } from './user.service.js';
import { authenticate } from '../../Middlewares/authentication.middleware.js';
import { authorize } from '../../Middlewares/authorization.middleware.js';
import { allowedExtensions, roleEnum } from '../../Common/constants.js';
import { multerUpload } from '../../Middlewares/multer.middleware.js';
import { BadRequestException } from '../../Common/Utils/Errors/exception.error.js';
import { validateFile } from '../../Middlewares/validateFile.middleware.js';

const userController = Router();

// GET user profile by id
userController.get('/profile', authenticate, authorize([roleEnum.USER]), async (req, res) => {
    try {
        const user = await getUserProfileService(req.authUser);
        res.status(200).json({
            message: 'User profile retrieved successfully',
            data: user
        });
    } catch (error) {
        res.status(404).json({ message: error.message });
    }
});

// GET all users
userController.get('/', authenticate, authorize([roleEnum.ADMIN]), async (req, res) => {
    try {
        const users = await getAllUsersService();
        res.status(200).json({ message: 'All users retrieved successfully', data: users });
    } catch (error) {
        res.status(404).json({ message: error.message });
    }
});

// Update user profile by id
userController.patch('/update', authenticate, authorize([roleEnum.USER, roleEnum.ADMIN]), async (req, res) => {
    try {
        const updatedUser = await updateUserProfileService(req.authUser._id, req.body);
        res.status(200).json({ message: 'User profile updated successfully', data: updatedUser });
    } catch (error) {
        res.status(404).json({ message: error.message });
    }
});

// Delete user profile by id
userController.delete('/delete', authenticate, authorize([roleEnum.ADMIN]), async (req, res) => {
    try {
        const deletedUser = await deleteUserProfileService(req.authUser._id);
        res.status(200).json({ message: 'User profile deleted successfully', data: deletedUser });
    } catch (error) {
        res.status(404).json({ message: error.message });
    }
});

// Upload Profile Picture
userController.patch('/profile-picture', authenticate, multerUpload({ desiredPath: 'profile' }).single('profile'), validateFile(allowedExtensions.image), async (req, res) => {
    try {
        const file = req.file;
        if (!file) throw new BadRequestException({ message: 'File is missing' });
        const { authUser } = req;
        const result = await uploadProfilePictureService(file, authUser);
        res.status(200).json({ message: 'File uploaded successfully', data: result });
    } catch (error) {
        res.status(404).json({ message: error.message, data: error });
    }
});

export default userController;
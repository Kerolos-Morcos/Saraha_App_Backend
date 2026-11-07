import { Router } from 'express';
import { multerUpload } from '../../Middlewares/multer.middleware.js';
import { BadRequestException } from '../../Common/Utils/Errors/exception.error.js';
import { getAllMessagesService, getMessagesByReceiverIdService, sendMessageService } from './message.service.js';
import { authenticate } from '../../Middlewares/authentication.middleware.js';

const messageController = Router();

// health check route
messageController.get('/health', (req, res) => {
    res.status(200).json({ message: 'Message service is healthy' });
});

// Send Message Route
messageController.post('/send', multerUpload({ desiredPath: 'messages' }).single('file'), async (req, res) => {
    const { content, receiverId } = req.body;
    const file = req.file;
    if (!content && !file) throw new BadRequestException({ message: 'Message content or file is required' });
    const result = await sendMessageService({ content, file, receiverId });
    res.status(201).json({ message: 'Message sent successfully', data: result });
});

// Get All Messages Route
messageController.get('/all-messages', async (req, res) => {
    const result = await getAllMessagesService();
    if (!result) throw new BadRequestException({ message: 'Messages not found' });
    res.status(200).json({ message: 'Messages retrieved successfully', data: result });
});

// Get Messages by Receiver ID Route
messageController.get('/my-messages', authenticate, async (req, res) => {
    const result = await getMessagesByReceiverIdService(req.authUser._id);
    res.status(200).json({ message: 'User Messages retrieved successfully', data: result });
});

export default messageController;
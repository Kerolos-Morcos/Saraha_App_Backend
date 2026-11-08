import { Router } from 'express';
import { authenticate } from '../../Middlewares/authentication.middleware.js';
import { requestSenderIdentityService } from './identityRequest.service.js';

const identityRequestController = Router();

identityRequestController.post('/request/:messageId', authenticate, async (req, res) => {
    const { messageId } = req.params;
    const requesterId = req.authUser._id;
    const result = await requestSenderIdentityService(messageId, requesterId);
    res.status(201).json({ message: 'Identity request created successfully', data: result });
});

export default identityRequestController;
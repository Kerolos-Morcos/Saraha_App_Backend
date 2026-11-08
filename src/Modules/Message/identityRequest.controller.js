import { Router } from 'express';
import { authenticate } from '../../Middlewares/authentication.middleware.js';
import { requestSenderIdentityService, getIdentityRequestsService, respondToIdentityRequestService, getMySentIdentityRequestsService } from './identityRequest.service.js';

const identityRequestController = Router();

// Request Sender Identity Route
identityRequestController.post('/request/:messageId', authenticate, async (req, res) => {
    const { messageId } = req.params;
    const requesterId = req.authUser._id;
    const result = await requestSenderIdentityService(messageId, requesterId);
    res.status(201).json({ message: 'Identity request created successfully', data: result });
});

// Get Identity Requests by Sender ID Route
identityRequestController.get('/my-requests', authenticate, async (req, res) => {
    const result = await getIdentityRequestsService(req.authUser._id);
    res.status(200).json({ message: 'Identity requests retrieved successfully', data: result });
});

// Respond to Identity Request Route
identityRequestController.patch('/respond/:requestId', authenticate, async (req, res) => {
    const { requestId } = req.params;
    const { status } = req.body;
    const result = await respondToIdentityRequestService(requestId, req.authUser._id, status);
    res.status(200).json({ message: 'Identity request updated successfully', data: result });
});


// Get identity requests submitted by the logged-in receiver
identityRequestController.get('/my-sent-requests', authenticate, async (req, res) => {
    const result = await getMySentIdentityRequestsService(req.authUser._id);
    res.status(200).json({ message: 'My sent identity requests retrieved successfully', data: result });
});


export default identityRequestController;
import { Router } from 'express';
import { authenticate } from '../../Middlewares/authentication.middleware.js';
import { sendConversationMessageService, getConversationMessagesService } from './conversation.service.js';

const conversationController = Router();

// Send Message
conversationController.post('/:conversationId/messages', authenticate, async (req, res) => {
    const { conversationId } = req.params;
    const { content } = req.body;
    const result = await sendConversationMessageService(conversationId, req.authUser._id, content);
    res.status(201).json({ message: 'Conversation message sent successfully', data: result });
});

// Get Messages
conversationController.get('/:conversationId/messages', authenticate, async (req, res) => {
    const { conversationId } = req.params;
    const result = await getConversationMessagesService(conversationId, req.authUser._id);
    res.status(200).json({ message: 'Conversation messages retrieved successfully', data: result });
});

export default conversationController;
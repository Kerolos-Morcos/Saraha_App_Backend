import { Router } from 'express';

const messageController = Router();

// health check route
messageController.get('/health', (req, res) => {
    res.status(200).json({ message: 'Message service is healthy' });
});

export default messageController;
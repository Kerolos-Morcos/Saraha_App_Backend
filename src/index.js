import express from 'express';
import authController from './Modules/Auth/auth.controller.js';
import userController from './Modules/User/user.controller.js';
import messageController from './Modules/Message/message.controller.js';
import { dbConnection } from './DB/db.connection.js';

const app = express();
const port = 5011;
app.use(express.json());

// DB Connection
dbConnection();

// Routes
app.use('/api/auth', authController);
app.use('/api/users', userController);
app.use('/api/messages', messageController);

// Not Found Middleware
app.use((req, res) => {
    res.status(404).json({ message: 'Route not found' });
});

// Error Handling Middleware
app.use((error, req, res, next) => {
    return res.status(error.cause?.status || 500).json({
        message: error.message
    });
});

// Starting the server
app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});
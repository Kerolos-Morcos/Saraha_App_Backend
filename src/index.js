import envConfig from "./Config/env.config.js";
import express from 'express';
import authController from './Modules/Auth/auth.controller.js';
import userController from './Modules/User/user.controller.js';
import messageController from './Modules/Message/message.controller.js';
import { dbConnection } from './DB/db.connection.js';
import { globalErrorHandler } from "./Middlewares/global-error-handler.middleware.js";
import cors from 'cors';
import { redisConnection } from "./Common/Clients/redis.client.js";
import { emailTransporter } from "./Common/Clients/email.client.js";
import { sendEmailService } from "./Common/Services/email.service.js";
import { verifying } from "./Common/Utils/Security/hash.security.js";

const app = express();
const port = envConfig.server.PORT || 5011;
const whitelist = envConfig.server.CORS_WHITELIST.split(",").map(origin => origin.trim());
app.use(cors({ origin: whitelist }), express.json());

// DB Connection - Redis Connection
dbConnection();
redisConnection();

// Routes
app.use('/api/auth', authController);
app.use('/api/users', userController);
app.use('/api/messages', messageController);
app.use('/uploads', express.static('uploads')); // For Static Files & Images

// Not Found Middleware
app.use((req, res) => {
    res.status(404).json({ message: 'Route not found' });
});

// Error Handling Middleware
app.use(globalErrorHandler);

// Starting the server
app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});

// Email
try {
    await emailTransporter.verify();
    console.log("Server is ready to take our messages");
    // await sendEmailService({
    //     to: email.EMAIL_USERNAME,
    //     subject: "Test Email",
    //     message: "<h1>Test Email</h1>",
    // })
} catch (err) {
    console.error("Verification failed:", err);
}

import { BadRequestException } from "../../Common/Utils/Errors/exception.error.js";
import MessageRepository from "../../DB/Repositories/message.repository.js";
import UserRepository from "../../DB/Repositories/user.repository.js";

const messageRepo = new MessageRepository();
const userRepo = new UserRepository();
// Send Message Service
export const sendMessageService = async ({ content, file, receiverId, senderId }) => {
    // Check if receiver exists
    const user = await userRepo.findDocumentById(receiverId);
    if (!user) throw new BadRequestException({ message: 'Receiver not found' });
    const message = await messageRepo.createDocument({ content, file: file?.path, receiverId, senderId });
    const result = message.toObject();
    delete result.senderId;

    return message;
};

// Get All Messages Service
export const getAllMessagesService = async () => {
    const messages = await messageRepo.findAllMessagesDocuments({}, null, { populate: [{ path: 'receiverId', select: 'firstName lastName' }] });
    return messages;
};

// Get Messages by Receiver ID Service
export const getMessagesByReceiverIdService = async (receiverId) => {
    const messages = await messageRepo.findMessagesByReceiverId({ receiverId }, { senderId: 0 }).populate('receiverId', 'firstName lastName');
    return messages;
};
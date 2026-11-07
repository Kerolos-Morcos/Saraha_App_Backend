import { BadRequestException } from "../../Common/Utils/Errors/exception.error.js";
import MessageRepository from "../../DB/Repositories/message.repository.js";
import UserRepository from "../../DB/Repositories/user.repository.js";

const messageRepo = new MessageRepository();
const userRepo = new UserRepository();
// Send Message Service
export const sendMessageService = async ({ content, file, receiverId }) => {
    // Check if receiver exists
    const user = await userRepo.findDocumentById(receiverId);
    if (!user) throw new BadRequestException('Receiver not found');
    const message = await messageRepo.createDocument({ content, file: file?.path, receiverId });
    return message;
};

// Get All Messages Service
export const getAllMessagesService = async () => {
    const messages = await messageRepo.findAllMessagesDocuments({}, null, { populate: [{ path: 'receiverId', select: 'firstName lastName' }] });
    return messages;
};

// Get Messages by Receiver ID Service
export const getMessagesByReceiverIdService = async (receiverId) => {
    const messages = await messageRepo.findMessagesByReceiverId({ receiverId }).populate('receiverId', 'firstName lastName');
    return messages;
};
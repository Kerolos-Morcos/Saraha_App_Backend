import { BadRequestException } from "../../Common/Utils/Errors/exception.error.js";
import IdentityRequestRepository from "../../DB/Repositories/identityRequest.repository.js";
import MessageRepository from "../../DB/Repositories/message.repository.js";


const messageRepo = new MessageRepository();
const identityRequestRepo = new IdentityRequestRepository();

export const requestSenderIdentityService = async (messageId, requesterId) => {
    const message = await messageRepo.findDocumentById(messageId);
    if (!message) throw new BadRequestException('Message not found');
    if (!message.receiverId.equals(requesterId)) throw new BadRequestException({ message: 'You are not authorized to request this sender identity' });
    const identityRequest = await identityRequestRepo.createDocument({ messageId, requesterId, senderId: message.senderId });
    const result = identityRequest.toObject();
    delete result.senderId;

    return result;
};
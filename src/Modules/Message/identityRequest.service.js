
import { BadRequestException } from "../../Common/Utils/Errors/exception.error.js";
import IdentityRequestRepository from "../../DB/Repositories/identityRequest.repository.js";
import MessageRepository from "../../DB/Repositories/message.repository.js";
import ConversationRepository from "../../DB/Repositories/conversation.repository.js";

const messageRepo = new MessageRepository();
const identityRequestRepo = new IdentityRequestRepository();
const conversationRepo = new ConversationRepository();

// Request Sender Identity Service
export const requestSenderIdentityService = async (messageId, requesterId) => {
    const message = await messageRepo.findDocumentById(messageId);
    if (!message) throw new BadRequestException({ message: 'Message not found' });
    if (!message.receiverId.equals(requesterId)) throw new BadRequestException({ message: 'You are not authorized to request this sender identity' });
    if (!message.senderId) throw new BadRequestException({ message: 'Sender information is unavailable for this message' });

    const identityRequest = await identityRequestRepo.createDocument({ messageId, requesterId, senderId: message.senderId });

    const result = identityRequest.toObject();
    delete result.senderId;

    return result;
};

// Get Identity Requests by Sender ID Service
export const getIdentityRequestsService = async (senderId) => {
    return await identityRequestRepo.findRequestsBySenderId(senderId);
};

// Respond to Identity Request Service
export const respondToIdentityRequestService = async (requestId, senderId, status) => {
    if (!['accepted', 'rejected'].includes(status)) throw new BadRequestException({ message: 'Invalid status' });

    const identityRequest = await identityRequestRepo.findDocumentById(requestId);

    if (!identityRequest) throw new BadRequestException({ message: 'Identity request not found' });
    if (!identityRequest.senderId.equals(senderId)) throw new BadRequestException({ message: 'You are not authorized to respond to this request' });
    if (identityRequest.status !== 'pending') throw new BadRequestException({ message: 'Request has already been processed' });

    let conversationId = null;
    if (status === 'accepted') {
        let conversation = await conversationRepo.findByMessageId(
            identityRequest.messageId
        );
        if (!conversation) {
            conversation = await conversationRepo.createDocument({
                messageId: identityRequest.messageId,
                participants: [
                    identityRequest.senderId,
                    identityRequest.requesterId
                ]
            });
        }
        conversationId = conversation._id;
    }

    identityRequest.status = status;
    await identityRequest.save();

    return {
        _id: identityRequest._id,
        messageId: identityRequest.messageId,
        requesterId: identityRequest.requesterId,
        status: identityRequest.status,
        conversationId
    };
};


// Get identity requests created by the receiver
export const getMySentIdentityRequestsService = async (requesterId) => {
    const requests = await identityRequestRepo.findRequestsByRequesterId(requesterId);

    const results = await Promise.all(
        requests.map(async (request) => {
            const result = {
                _id: request._id,
                messageId: request.messageId,
                status: request.status
            };

            // Reveal sender identity only after acceptance
            if (request.status === 'accepted') {
                const populatedRequest = await request.populate(
                    'senderId',
                    'firstName lastName'
                );
                const conversation = await conversationRepo.findByMessageId(
                    request.messageId
                );
                result.sender = populatedRequest.senderId
                    ? {
                        _id: populatedRequest.senderId._id,
                        firstName: populatedRequest.senderId.firstName,
                        lastName: populatedRequest.senderId.lastName
                    }
                    : null;
                result.conversationId = conversation?._id ?? null;
            }

            return result;
        })
    );

    return results;
};

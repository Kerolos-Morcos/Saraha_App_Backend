import { BadRequestException } from "../../Common/Utils/Errors/exception.error.js";
import ConversationRepository from "../../DB/Repositories/conversation.repository.js";
import ConversationMessageRepository from "../../DB/Repositories/conversationMessage.repository.js";

const conversationRepo = new ConversationRepository();
const conversationMessageRepo = new ConversationMessageRepository();

// Send Conversation Message
export const sendConversationMessageService = async (conversationId, senderId, content) => {
    const conversation = await conversationRepo.findDocumentById(conversationId);
    if (!conversation) throw new BadRequestException({ message: 'Conversation not found' });

    // Only participants can send messages
    const isParticipant = conversation.participants.some(participant => participant.equals(senderId));
    if (!isParticipant) throw new BadRequestException({ message: 'You are not authorized to send messages in this conversation' });
    if (!content || !content.trim()) throw new BadRequestException({ message: 'Message content is required' });

    return await conversationMessageRepo.createDocument({ conversationId, senderId, content });
};

// Get Conversation Messages
export const getConversationMessagesService = async (conversationId, userId) => {
    const conversation = await conversationRepo.findDocumentById(conversationId);
    if (!conversation) throw new BadRequestException({ message: 'Conversation not found' });

    // Only participants can view messages
    const isParticipant = conversation.participants.some(participant => participant.equals(userId));

    if (!isParticipant) throw new BadRequestException({ message: 'You are not authorized to view this conversation' });

    return await conversationMessageRepo.findMessagesByConversationId(conversationId);
};
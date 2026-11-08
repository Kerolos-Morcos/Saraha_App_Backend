import ConversationMessage from "../Models/conversationMessage.model.js";
import BaseRepository from "./base.repository.js";

export default class ConversationMessageRepository extends BaseRepository {
    constructor() {
        super(ConversationMessage);
    }

    findMessagesByConversationId(conversationId) {
        return this.model.find({ conversationId }).sort({ createdAt: 1 });
    }
}
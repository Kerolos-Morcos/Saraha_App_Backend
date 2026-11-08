import Conversation from "../Models/conversation.model.js";
import BaseRepository from "./base.repository.js";

export default class ConversationRepository extends BaseRepository {
    constructor() {
        super(Conversation);
    }

    findByMessageId(messageId) {
        return this.model.findOne({ messageId });
    }
}
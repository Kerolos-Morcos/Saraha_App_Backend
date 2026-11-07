import Message from "../Models/message.model.js";
import BaseRepository from "./base.repository.js";

export default class MessageRepository extends BaseRepository {
    constructor() {
        super(Message);
    }

    // Functions
    findAllMessagesDocuments(filters = {}, projection = null, options = {}) {
        if (options.populate) {
            return this.model.find(filters, projection, options).populate(options.populate);
        }
        return this.findAllDocuments(filters);
    }

    findMessagesByReceiverId(filters = {}, projection = null, options = {}) {
        if (options.populate) {
            return this.model.find(filters, projection, options).populate(options.populate);
        }
        return this.model.find(filters, projection, options)
    }
}
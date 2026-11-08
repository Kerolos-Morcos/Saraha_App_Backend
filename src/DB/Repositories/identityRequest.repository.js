
import IdentityRequest from "../Models/identityRequest.model.js";
import BaseRepository from "./base.repository.js";

export default class IdentityRequestRepository extends BaseRepository {
    constructor() {
        super(IdentityRequest);
    }

    // Functions
    findRequestsBySenderId(senderId) {
        return this.model.find({ senderId }).populate('messageId', 'content').populate('requesterId', 'firstName lastName');
    }

    findRequestsByRequesterId(requesterId) {
        return this.model.find({ requesterId }).sort({ _id: -1 });
    }

}
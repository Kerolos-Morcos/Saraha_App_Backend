import User from "../Models/user.model.js";
import BaseRepository from "./base.repository.js";

export default class UserRepository extends BaseRepository {
    constructor() {
        super(User);
    }

    // Functions
    findUserByEmail(email) {
        return this.findOneDocument({ email: { $regex: email, $options: 'i' } });
    }

    findAllUserDocuments(filters = {}) {
        // return this.findAllDocuments(filters);
        return this.findAllDocuments(filters).select('firstName lastName').sort({ firstName: -1 }).limit(2).skip(1);
    }
}
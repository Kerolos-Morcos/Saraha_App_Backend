
import IdentityRequest from "../Models/identityRequest.model.js";
import BaseRepository from "./base.repository.js";

export default class IdentityRequestRepository extends BaseRepository {
    constructor() {
        super(IdentityRequest);
    }
}
export default class BaseRepository {
    model;
    constructor(model) {
        this.model = model;
    }

    // Functions
    createDocument(data) {
        return this.model.create(data);
    }

    findAllDocuments(filters = {}) {
        return this.model.find(filters)
    }

    findDocumentById(_id) {
        return this.model.findById(_id)
    }

    findOneDocument(filters = {}) {
        return this.model.findOne(filters)
    }

    findByIdAndUpdateDocument(_id, updates, options) {
        return this.model.findByIdAndUpdate(_id, updates, options);
    }

    findAndUpdateDocument(filters, updates, options) {
        return this.model.findOneAndUpdate(filters, updates, options)
    }

    findAndDeleteDocument(filters) {
        return this.model.findOneAndDelete(filters)
    }

    findByIdAndDeleteDocument(_id) {
        return this.model.findByIdAndDelete(_id)
    }
}
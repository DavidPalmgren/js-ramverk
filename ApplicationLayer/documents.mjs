import docs from "../Infrastructure/docs.mjs";


//This object has no purpose YET. But will in the future.
const documents = {
    getAllDocuments: async function() {
        return await docs.getAll();
    },

    getDocumentById: async function(id) {
        return await docs.getOne(id);
    },

    addNewDocument: async function(body) {
        return (await docs.addOne(body)).lastID;
    },

    updateDocument: async function(id, title, content) {
        return await docs.updateOne(id, title, content);
    }
};

export default documents;
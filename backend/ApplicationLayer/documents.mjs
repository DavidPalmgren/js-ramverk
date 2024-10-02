import docs from "../Infrastructure/docs.mjs";
import objectHelper from "./objectHelper.mjs";
const documents = {
    getAllDocuments: async function() {
        return await docs.getAll();
    },

    getDocumentById: async function(id) {
        return await docs.getOne(id);
    },

    addNewDocument: async function(title, content) {
        return (await docs.addOne(title, content));
    },

    updateDocument: async function(id, title, content) {
        const documentObject = {
            title: title,
            content: content
        }
        //Removing undefined values
        objectHelper.removeUndefined(documentObject);
        return await docs.updateOne(id,documentObject);
    }
};

export default documents;

import DocModule from "./docModule.mjs";
import MongoDocumentHelper from "./mongoDocumentHelper.mjs";
const docs = {
    getAll: async function getAll() {
        return await DocModule.find();
    },

    getOne: async function getOne(id) {
        try {
            return await DocModule.findById(id);
        } catch (error){
            console.log(error.message)
        }
    },

    addOne: async function addOne(title, content) {
        const document = new DocModule({ title, content });
        await document.save();

        return document;
    },

    updateOne: async function updateOne(id, object) {
        const doc = await DocModule.findById(id);
        //The object parameter can potentially have 2 keys. We dont know the key(s) that exist in the object.
        //therefore we need to update the mongo-document accordingly, only updating the key(s) that is provided in the object
        MongoDocumentHelper.updateIdentifiedFields(doc, object);
        await doc.save();
        return doc;
    }
};

export default docs;
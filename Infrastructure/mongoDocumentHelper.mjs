export default {
    /**
     * Updates fields in `mongoDoc` with values from `objectInput`.
     * Throws an error if attempting to update a field that does not exist in `mongoDoc`.
     *
     * @param {Object} mongoDoc - The document to update.
     * @param {Object} objectInput - The object containing new values for the document.
     */
    updateIdentifiedFields: (mongoDoc, objectInput) => {
        Object.keys(objectInput).forEach( key => {
            //With the setup in the application and controller layer this will never be true, but it can be good to keep.
            if(!(key in mongoDoc)) {
                throw new Error("Trying to update non existing key");
            }
            mongoDoc[key] = objectInput[key];
        });
    }
}
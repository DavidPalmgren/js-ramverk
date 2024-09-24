
export default {
    /**
     * Removes properties with `undefined` values from the object.
     *
     * @param {Object} object - The object to clean.
     */
    removeUndefined: (object) => {
        Object.keys(object).forEach(key => {
            if (object[key] === undefined) {
                delete object[key];
            }
        });
    }
}
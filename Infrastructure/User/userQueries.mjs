import userModule from "./userModule.mjs";

export default {

    findUser: async (email) => {
        return await userModule.findOne({ 'title.email': email });
    },

    createUser: async(email, password) => {
        const newDocument = new userModule({
            email: email,
            password: password
        });
        await newDocument.save();
    }
}
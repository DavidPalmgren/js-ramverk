import userQueries from "../../Infrastructure/userQueries.mjs";
import bcrypt from 'bcrypt';
const signUp =  {
    signUp: async (email, password) => {
        const user = await userQueries.findUser(email)
        if (user) throw new Error('User with this email already exists');
        await userQueries.createUser(email, await bcrypt.hash(password, 10));
    }
}

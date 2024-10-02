import mongoose from 'mongoose';
const uri = `mongodb+srv://${process.env.ATLAS_USERNAME}:${process.env.ATLAS_PASSWORD}@cluster0.wunb9.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`;
const clientOptions = { serverApi: { version: '1', strict: true, deprecationErrors: true } };

const openConnection = async () => {
    await mongoose.connect(uri, clientOptions);
};

const closeConnection = async () => {
    await mongoose.disconnect();
}


export { openConnection, closeConnection };

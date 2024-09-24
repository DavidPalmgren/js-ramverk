import mongoose from 'mongoose';

const documentSchema = new mongoose.Schema({
    title: String,
    content: String
});

const MongoDocument = mongoose.model('Document', documentSchema);


export default MongoDocument;
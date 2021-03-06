import mongoose from "mongoose";

const DATA_BASE_URL = 'mongodb://127.0.0.1/photo_tape_test_01'

const InitiateMongoServer = async () => {
    await mongoose.connect(DATA_BASE_URL, {useNewUrlParser: true, useUnifiedTopology: true});
};

export default InitiateMongoServer;

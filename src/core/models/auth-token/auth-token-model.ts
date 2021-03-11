import mongoose from 'mongoose';

const Schema = mongoose.Schema;

const AuthTokenSchema = new Schema({
    user_token: {
        type: 'String',
        required: true,
        unique: true
    },
    user_id: {
        type: 'String',
        required: true,
        unique: true
    },
    expiration_date: {
        type: 'Number',
        required: true
    }
})


export default mongoose.model('AuthToken',AuthTokenSchema);

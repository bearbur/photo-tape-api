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
        unique: false
    },
    expiration_date: {
        type: 'Number',
        required: true
    },
    inactive: {
        type: 'Boolean',
        required: true,
        default: false
    }
})


export default mongoose.model('AuthToken',AuthTokenSchema);

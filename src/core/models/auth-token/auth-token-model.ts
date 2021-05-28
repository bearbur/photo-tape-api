import mongoose, { Document, Schema } from 'mongoose';

export interface AuthTokenDoc extends Document {
    user_token: string;
    expiration_date: number;
    inactive: boolean;
}

const AuthTokenSchema = new Schema({
    user_token: {
        type: 'String',
        required: true,
    },
    expiration_date: {
        type: 'Number',
        required: true,
    },
    inactive: {
        type: 'Boolean',
        required: true,
        default: false,
    },
});

export default mongoose.model('AuthToken', AuthTokenSchema);

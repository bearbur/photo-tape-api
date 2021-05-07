import mongoose from 'mongoose';
import { generateUUID } from '../../utils/id-utils';

const Schema = mongoose.Schema;

const AuthTokenSchema = new Schema({
    id: {
        type: 'String',
        required: true,
        unique: true,
        default: generateUUID(),
    },
    user_token: {
        type: 'String',
        required: true,
        unique: true,
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

import mongoose from 'mongoose';
import { GUEST, userPermissions } from '../../constants/user-permission-levels';

import { generateCurrentDateAtMs } from '../../utils/date-utils';
import { generateUUID } from '../../utils/id-utils';

const Schema = mongoose.Schema;

const UserSchema = new Schema({
    username: {
        type: 'String',
        required: true,
        unique: true,
    },
    password: {
        type: 'String',
        required: true,
    },
    id: {
        type: 'String',
        required: true,
        unique: true,
        default: generateUUID(),
    },
    permission: {
        type: 'Number',
        required: true,
        default: userPermissions[GUEST].level,
    },
    creation_date: {
        type: 'Number',
        required: true,
        default: generateCurrentDateAtMs(),
    },
    is_active: {
        type: 'Boolean',
        required: true,
        default: true,
    },
});

export default mongoose.model('User', UserSchema);

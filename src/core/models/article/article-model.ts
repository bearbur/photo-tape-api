import mongoose from 'mongoose';
import { GUEST, userPermissions } from '../../constants/user-permission-levels';

import { generateCurrentDateAtMs } from '../../utils/date-utils';
import { generateUUID } from '../../utils/id-utils';

const Schema = mongoose.Schema;

const ArticleSchema = new Schema({
    author_id: {
        type: 'String',
        required: true,
        unique: true,
    },
    id: {
        type: 'String',
        required: true,
        unique: true,
        default: generateUUID(),
    },
    creation_date: {
        type: 'Number',
        required: true,
        default: generateCurrentDateAtMs(),
    },
    is_archived: {
        type: 'Boolean',
        required: true,
        default: false,
    },
    is_deleted: {
        type: 'Boolean',
        required: true,
        default: false,
    },
    title: {
        type: 'String',
        required: true,
        unique: true,
    },
    content: {
        type: 'String',
        required: true,
    },
    isPrivate: {
        type: 'Boolean',
        required: true,
        default: false,
    },
});

export default mongoose.model('Article', ArticleSchema);

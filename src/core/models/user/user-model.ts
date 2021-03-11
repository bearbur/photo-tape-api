import mongoose from 'mongoose';
import {GUEST, userPermissions} from "../../constants/user-permission-levels";
import {loggerCreator} from "../../services/logger/logger";

const Schema = mongoose.Schema;

const UserSchema = new Schema({
    username: {
        type: 'String',
        required: true,
        unique: true
    },
    password: {
        type: 'String',
        required: true
    },
    id: {
        type: 'String',
        required: true,
        unique: true
    },
    permission: {
        type: 'Number',
        required: true,
        default: userPermissions[GUEST].level
    }
})

UserSchema.pre('save',  (next)=>{
    const user = this;

    /* tslint:disable */
    loggerCreator.info(`Pre save hook for username `)
    /* tslint:enable */
    next()
})

export default mongoose.model('User',UserSchema);

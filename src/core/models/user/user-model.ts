import mongoose from 'mongoose';
import {GUEST, userPermissions} from "../../constants/user-permission-levels";
import {loggerCreator} from "../../services/logger/logger";
import bcrypt from 'bcrypt';
import {SALT_FACTOR_USER_MODEL} from "../../constants/salt";

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
    },
    creation_date: {
        type: 'Number',
        required: true
    }
})

UserSchema.pre('save',  (next)=> {
    const user : {
        password: string;
        isModified: (password: string)=>boolean} = this;

    loggerCreator.info(`Pre save hook for username `)

    /* Generate a password hash when the password changes (or a new password) */
    if (!user.isModified('password')) {
        return next();
    }
    /* Generate a salt */
    bcrypt.genSalt(SALT_FACTOR_USER_MODEL).then(salt => {
        /* Generate a hash */
        bcrypt.hash(user.password, salt).then(hash=>{
            user.password = hash;
            next();
        }).catch((err:Error)=>{
            loggerCreator.error(`Bcrypt error hash. `);
            next(err)
        })
    }).catch((err:Error) => {
        loggerCreator.error(`Bcrypt error salt. `);
        next(err)
    })
});

export default mongoose.model('User',UserSchema);

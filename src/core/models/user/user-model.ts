import mongoose from 'mongoose';

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
})

UserSchema.pre('save',  (next)=>{
    const user = this;
    /* tslint:disable */
    console.log(user);
    /* tslint:enable */
    next()
})

export default mongoose.model('User',UserSchema);

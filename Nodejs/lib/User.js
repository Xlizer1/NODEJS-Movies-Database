import pkg from 'mongoose';
import { hashPassword } from './helper.js';
import shortId from 'shortid';

const { Schema, model } = pkg;

const UserSchema = new Schema({
    name: String,
    email: { type: String, unique: true },
    password: String,
    birthdate: String,
    salt: String
});

UserSchema.pre('save', function (next) {
    if (!this.salt) {
        this.salt = shortId.generate();
    }

    if (this.password) {
        this.password = hashPassword(this.password);
    }

    next();
});

const UserModel = new model('user', UserSchema);

export default UserModel;
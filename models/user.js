const { Schema, model } = require('mongoose');

const { handleSchemaValidationErrors } = require('../models/helpers/index');

const userSchema = new Schema({
    password: {
        type: String,
        minLength: [6, 'Password should be at least 6 characters long'],
        required: [true, 'Password is required'],
    },
    email: {
        type: String,
        required: [true, 'Email is required'],
        match: [/[a-z0-9]+@[a-z0-9]+/, 'user email is not valid'],
        unique: true,
    },
    subscription: {
        type: String,
        enum: ["starter", "pro", "business"],
        default: "starter"
    },
    token: {
        type: String,
        default: null,
    },
    avatarURL: {
        type: String,
        default: null,
    }
}, { versionKey: false, timestamps: true });

userSchema.post("save", handleSchemaValidationErrors);



const User = model('user', userSchema);

module.exports = {
    User,
}
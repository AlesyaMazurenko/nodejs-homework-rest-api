const { Schema, model } = require('mongoose');
const Joi = require('joi');

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
}, { versionKey: false, timestamps: true });

userSchema.post("save", handleSchemaValidationErrors);

const addUserSchema = Joi.object({
    password: Joi.string().min(6).required(),
    email: Joi.string().email({ minDomainSegments: 2, tlds: { allow: ['com', 'net'] } }).required(),
    subscription: Joi.string(),
})

const findUserSchema = Joi.object({
    password: Joi.string().min(6).required(),
    email: Joi.string().email({ minDomainSegments: 2, tlds: { allow: ['com', 'net'] } }).required(),
});

const schemas = {
    addUserSchema,
    findUserSchema
}


const User = model('user', userSchema);

module.exports = {
    User,
    schemas,
}
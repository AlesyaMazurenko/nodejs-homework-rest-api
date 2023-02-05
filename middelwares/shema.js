const Joi = require('joi');

const addUserSchema = Joi.object({
    password: Joi.string().min(6).required(),
    email: Joi.string().email({ minDomainSegments: 2, tlds: { allow: ['com', 'net'] } }).required(),
    subscription: Joi.string(),
})

const findUserSchema = Joi.object({
    password: Joi.string().min(6).required(),
    email: Joi.string().email({ minDomainSegments: 2, tlds: { allow: ['com', 'net'] } }).required(),
});


const addContactSchema = Joi.object({
    name: Joi.string().min(3).required(),
    email: Joi.string().email({ minDomainSegments: 2, tlds: { allow: ['com', 'net'] } }).required(),
    phone: Joi.string().pattern(/\(?([0-9]{3})\) \/?([0-9]{3})-?([0-9]{4})/,
      "For example (000) 000-0000").required(),
    favorite: Joi.bool(),
})


const updateFavoriteSchema = Joi.object({
    favorite: Joi.bool().required(),
})

const schemas = {
    addUserSchema,
    findUserSchema,
    addContactSchema,
    updateFavoriteSchema
}

module.exports = { schemas };

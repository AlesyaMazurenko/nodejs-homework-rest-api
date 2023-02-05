const { Schema, model } = require('mongoose');

const { handleSchemaValidationErrors } = require('../models/helpers/index');

const contactSchema = new Schema({
    name: {
        type: String,
        required: [true, 'Set name for contact'],
        unique: true,
    },
    email: {
        type: String,
    },
    phone: {
        type: String,
        pattern: [
      /\(?([0-9]{3})\) \/?([0-9]{3})-?([0-9]{4})/,
      "For example (000) 000-0000"],
        unique: true,
    },
    favorite: {
        type: Boolean,
        default: false,
    },
    owner: {
        type: Schema.Types.ObjectId,
        ref: 'user',
        required: true
    }
}, { versionKey: false, timestamps: true });

contactSchema.post("save", handleSchemaValidationErrors);
    
const Contact = model('contact', contactSchema);


module.exports = {
    Contact,
};
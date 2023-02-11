const handleSchemaValidationErrors = require("./handleSchemaValidationErrors");
const HttpError = require('./HttpError');
const sendEmail = require('./sendEmail');

function tryCatchWrapper(endpointFn) {
    return async (req, res, next) => {
        try {
            await endpointFn(req, res, next);
        } catch (error) {
            return next(error);
        }
    }
}

function validateBody(schema) {
    return (req, res, next) => {
        const { error } = schema.validate(req.body);
        if (error) {
            return next(new HttpError(400, error.message));
        }
        return next();
    }
}
module.exports = {
    tryCatchWrapper,
    handleSchemaValidationErrors,
    validateBody,
    sendEmail,
    HttpError,
};

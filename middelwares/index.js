const HttpError = require('../models/helpers/HttpError');

const isValidId = require('./isValidId');
const jwt = require('jsonwebtoken');
const { User } = require('../models/user'); 

function validateBody(schema) {
    
    return (req, res, next) => {
        const { error } = schema.validate(req.body);
        console.log("error Validate:", error);
        if(error) {
            return next(new HttpError(400, error.message));
        }
        return next();
    }; 
}

async function auth(req, res, next) {
    const authHeader = req.headers.authorization || "";
    const [type, token] = authHeader.split(" ");
    
    if (type !== 'Bearer') {
        return next(new HttpError(401, "token type is not valid"));
    }; 
    
    if (!token) {
        return next(new HttpError(401, "no token provided"));
    };

    try {
        const { id } = jwt.verify(token, process.env.JWT_SECRET); 
        const user = await User.findById(id);
        if (!user|| !user.token) return next(new HttpError(401, "Not authorized"));
        req.user = user;
 
    } catch (error) {
        console.log("error_name", error.name)
     
        if (error.name === "TokenExpiredError" ||
            error.name === "JsonWebTokenError") {
            // console.log('error offfff token');
            return next(new HttpError(401, "Not authorized"));
        }
        throw error;
    }
    next();
}

module.exports = {
    validateBody,
    isValidId,
    auth
}
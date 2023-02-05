const HttpError = require('../models/helpers/HttpError');
const { User } = require("../models/user");
const jwt = require("jsonwebtoken");
const bcrypt = require('bcrypt');


const JWT_SECRET = process.env.JWT_SECRET; 

async function register(req, res, next) {
    const { email, password, subscription } = req.body;

    const salt = await bcrypt.genSalt();
    const hashedPassword = await bcrypt.hash(password, salt);

    try {
        const savedUser = await User.create({
            email,
            password: hashedPassword,
            subscription
        });
        res.status(201).json({
            user: {
                email,
                subscription
            },
        });
    } catch (error) {
        if (error.message.includes('E11000 duplicate key error')) {
            return next(new HttpError(409, 'Email in use'))
        }
        console.log("error saved user", error.message, error.name);
        throw error; 
    }
};

async function login(req, res, next) {
    const { email, password } = req.body;

    const storedUser = await User.findOne({
        email,
    });

    if (!storedUser) {
        throw new HttpError(401, 'Ошибка от Joi или другой библиотеки  валидаци');
    }

    const isPasswordValid = await bcrypt.compare(password, storedUser.password);

    if (!isPasswordValid) {
        throw new HttpError(401, 'Email or password is wrong');
    }
    
    const payload = { id: storedUser._id };
    const token = jwt.sign(payload, process.env.JWT_SECRET, {expiresIn: "1h"});

    const updatedUser = await User.findByIdAndUpdate(storedUser._id,
        { token: token }, {new: true})
    res.status(200).json({
            token: updatedUser.token,
            user: {
                email: storedUser.email,
                subscription: storedUser.subscription,
            }        
    });
}

async function logout(req, res, next) {
    const { _id } = req.user;
    await User.findByIdAndUpdate(_id, { token: null });
    res.status(204).json();
}

module.exports = {
    register,
    login,
    logout,
}

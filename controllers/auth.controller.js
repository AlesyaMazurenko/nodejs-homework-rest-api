// const HttpError = require('../models/helpers/HttpError');
const jwt = require("jsonwebtoken");
const bcrypt = require('bcrypt');
const gravatar = require('gravatar');
const { nanoid } = require('nanoid');

const { User } = require("../models/user");
const { sendMail, HttpError } = require('../models/helpers/index');


const { JWT_SECRET } = process.env; 

async function register(req, res, next) {
    const { email, password, subscription } = req.body;

    const salt = await bcrypt.genSalt();
    const hashedPassword = await bcrypt.hash(password, salt);
    const avatarURL = gravatar.url(email);
    const verificationToken = nanoid();

    try {
        const savedUser = await User.create({
            email,
            password: hashedPassword,
            avatarURL,
            subscription,
            verificationToken,
        });
        const mail = {
            to: email,
            subject: 'Підтвердження реєстраціі на сайті',
            html: `<a href="http://localhost:3002/api/users/verify/${verificationToken}" target="_blanc">Натисніть для підтвердження</a>`,
        };
        await sendMail(mail);
        res.status(201).json({
            user: {
                email,
                avatarURL,
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
    
    if (!storedUser.verify) {
        return next(new HttpError(400, 'Email not verify'));
    }
    const payload = { id: storedUser._id };
    const token = jwt.sign(payload, JWT_SECRET, {expiresIn: "1h"});

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

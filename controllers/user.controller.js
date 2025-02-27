const { sendEmail, HttpError } = require('../models/helpers/index');
const { User } = require('../models/user');
const path = require('path');
const fs = require('fs/promises');
const Jimp = require("jimp");

async function current(req, res, next) {
    const { _id } = req.user;
    console.log("_id", _id)

    const user = await User.findById(_id);
  console.log("user", user)
    if (!user)
      return next(new HttpError(401, "Not authorized"));
    res.json({
        email: user.email,
        subscription: user.subscription,
    });
}

async function logout(req, res, next) {
    const { _id } = req.user;

    const user = await User.findById(_id);

    if (!user || !user.token)
        return next(new HttpError(401, "Not authorized"));
    
    await User.findByIdAndUpdate(_id, { $set: { token: null } });

    return res.status(204).json();  
}

async function updateSubscription(req, res, next) {
    return res.status(200).json({
        ok: true,
    });
}

const uploadAvatar = async (req, res, next) => {
    // req.file
    console.log('req.file', req.file);
    const { filename } = req.file;
    const tmpPath = path.resolve(__dirname, '../tmp', filename);
    const publicPath = path.resolve(__dirname, '../public/avatars', filename);
    const { _id } = req.user;

    (await Jimp.read(tmpPath)).resize(250, 250).write(tmpPath);

    try { 
        await fs.rename(tmpPath, publicPath);
    } catch (error) {
        await fs.unlink(tmpPath);
        throw error;
    }
    
    const imagePath = `/public/avatars/${filename}`;
    const userAvatar = await User.findByIdAndUpdate(_id,
        { avatarURL: publicPath, },
        { new: true }
    );

  return res.json({
      data: {
          avatarURL: imagePath,
    }
  });
}

const verifyEmail = async (req, res, next) => {
    const { verificationToken } = req.params;
    const user = await User.findOne({ verificationToken });
    if (!user) {
        return next(new HttpError(404, 'User not found'))
    }
    await User.findByIdAndUpdate(user._id, { verify: true, verificationToken: '' });
    return res.status(200).json({ message: 'Verification successful' });
};

const resendVerifyEmail = async (req, res, next) => {
    const { email } = req.body;
    const user = await User.findOne({ email });
    if (!user) {
        return next(new HttpError(400, 'Missing required field email'));
    };
    if (user.verify) {
        return next(new HttpError(400, 'Verification has already been passed'));
    };
    
    const mail = {
        to: email,
        subject: 'Підтвердження реєстраціі на сайті',
        html: `<a href="http://localhost:3002/api/users/verify/${user.verificationToken}" target="_blank">Натисніть для підтвердження</a>`,
    };
    await sendEmail(mail);
    res.json({
        message: 'Verification email sent'
    });
};


module.exports = {
    current,
    logout,
    updateSubscription,
    uploadAvatar,
    verifyEmail,
    resendVerifyEmail,
}
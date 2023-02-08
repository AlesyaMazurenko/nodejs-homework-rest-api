const HttpError = require('../models/helpers/HttpError');
const { User } = require('../models/user');
const path = require('path');
const fs = require('fs/promises');

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

    try { 
        await fs.rename(tmpPath, publicPath);
    } catch (error) {
        await fs.unlink(tmpPath);
        throw error;
    }

    const { _id } = req.user;
    
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

module.exports = {
    current,
    logout,
    updateSubscription,
    uploadAvatar,
}

// current, logout, updateSubscription
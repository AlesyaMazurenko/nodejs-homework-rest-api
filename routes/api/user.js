const express = require('express');
const userRouter = express.Router();
const {current, logout, updateSubscription, uploadAvatar, verifyEmail, resendVerifyEmail} = require("../../controllers/user.controller.js");
const { tryCatchWrapper, validateBody} = require("../../models/helpers/index.js")
const { auth, upload } = require("../../middelwares/index");
const { verifyEmailSchema } = require('../../middelwares/shema');

userRouter.get('/current',
    tryCatchWrapper(auth),
    tryCatchWrapper(current));

userRouter.post('/logout',
    tryCatchWrapper(auth),
    tryCatchWrapper(logout));

userRouter.patch('/',
    tryCatchWrapper(auth),
    tryCatchWrapper(updateSubscription));

userRouter.patch('/avatars',
    tryCatchWrapper(auth),
    upload.single('image'),
    tryCatchWrapper(uploadAvatar));

userRouter.get('/verify/:verificationToken',
    tryCatchWrapper(verifyEmail));

userRouter.post('/verify',
    validateBody(verifyEmailSchema),
    tryCatchWrapper(resendVerifyEmail),
);

module.exports = { userRouter };

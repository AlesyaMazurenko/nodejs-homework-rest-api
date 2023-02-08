const express = require('express');
const userRouter = express.Router();
const {current, logout, updateSubscription, uploadAvatar} = require("../../controllers/user.controller.js");
const { tryCatchWrapper} = require("../../models/helpers/index.js")
const { auth, upload } = require("../../middelwares/index")

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

module.exports = { userRouter };

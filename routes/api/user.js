const express = require('express');
const userRouter = express.Router();
const {current, logout, updateSubscription} = require("../../controllers/user.controller.js");
const { tryCatchWrapper} = require("../../models/helpers/index.js")
const { validateBody, isValidId, auth } = require("../../middelwares/index")
const { schemas } = require('../../models/user.js');


userRouter.get('/current',
    tryCatchWrapper(auth),
    tryCatchWrapper(current));


userRouter.post('/logout',
    // tryCatchWrapper(auth),
    tryCatchWrapper(auth),
    tryCatchWrapper(logout));

userRouter.patch('/',
    // validateBody(updateSubscriptionSchema),
    tryCatchWrapper(auth),
    tryCatchWrapper(updateSubscription))


module.exports = { userRouter };

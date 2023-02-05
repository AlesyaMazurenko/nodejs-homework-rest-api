const express = require('express');
const { tryCatchWrapper } = require("../../models/helpers/index.js");
const {register, login, logout} = require('../../controllers/auth.controller');
const { auth } = require('../../middelwares/index.js');
const { schemas } = require('../../models/user.js');
const { validateBody } = require('../../models/helpers/index');

const authRouter = express.Router();

authRouter.post('/signup', validateBody(schemas.addUserSchema), tryCatchWrapper(register));
authRouter.post('/login', validateBody(schemas.findUserSchema), tryCatchWrapper(login));
authRouter.get('/logout', auth, tryCatchWrapper(logout));

module.exports = {
    authRouter,
}
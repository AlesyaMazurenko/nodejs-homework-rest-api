const express = require('express');
const routerContacts = express.Router();
const ctrlTasks = require("../../controllers/contacts.controller.js");
const { tryCatchWrapper} = require("../../models/helpers/index.js")
const { validateBody, isValidId, auth } = require("../../middelwares/index")
const { schemas } = require("../../middelwares/shema");


routerContacts.get('/',
    auth,
    tryCatchWrapper(ctrlTasks.getContactsService));

routerContacts.get('/:id',
    auth,
    isValidId,
    tryCatchWrapper(ctrlTasks.getContactByIdService));

routerContacts.post('/',
    auth,
    validateBody(schemas.addContactSchema),
    tryCatchWrapper(ctrlTasks.creacteContactService));

routerContacts.delete('/:id',
    auth,
    isValidId,
    tryCatchWrapper(ctrlTasks.deleteContactService));
 
routerContacts.put('/:id',
    auth,
    isValidId,
    validateBody(schemas.addContactSchema),
    tryCatchWrapper(ctrlTasks.updateContactService));

routerContacts.patch('/:id/favorite',
    auth,
    isValidId,
    validateBody(schemas.updateFavoriteSchema),
    tryCatchWrapper(ctrlTasks.updateFavoriteService))


module.exports = { routerContacts };

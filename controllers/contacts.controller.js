const HttpError = require('../models/helpers/HttpError');
const { Contact } = require('../models/contact');

const creacteContactService = async (req, res) => {
  const {_id} = req.user;
  const result = await Contact.create({...req.body, owner: _id});
  res.status(201).json(result);
}

const getContactsService = async (req, res, next) => {
  const { _id } = req.user;
  const { page = 1, limit = 20 } = req.query;
  const skip = (page - 1) * limit;
  try {
    const result = await Contact.find({ owner: _id }, '-createdAt -updatedAt', {skip, limit: Number(limit)}
).populate('owner', '_id email');
    res.json({
      status: 'success',
      code: 200,
      data: {
        contacts: result,
      },
    });
  } catch (error) {
    return next(new HttpError(400, error.message));
  }
};

const getContactByIdService = async (req, res, next) => {
  const { _id } = req.user;
  const { id } = req.params;

  const result = await Contact.findById(id, {}, { owner: _id });
  
  if (!result) {
    return next(new HttpError(404, "Contact not found"));
  }
  
  return res.status(200).json(result);
}

const deleteContactService = async (req, res, next) => {
  const { id } = req.params;
  const contact = await Contact.findByIdAndRemove(id);
  if (!contact) {
   return next(new HttpError(404, "Not found"));
    }
   res.status(200).json({ message: "Contact deleted" });
}
 
const updateContactService = async(req, res, next) => {
  const { id } = req.params;
  const result = await Contact.findByIdAndUpdate(id, req.body, {new: true});
  if (!result) {
    return next(new HttpError(404, "Contact not found"));
  }
  res.status(200).json(result);
}

const updateFavoriteService = async (req, res, next) => {
  const { id } = req.params;
  const result = await Contact.findByIdAndUpdate(id, req.body, {new: true});
  if (!result) {
    return next(new HttpError(404, "Not found"));
  }
  res.status(200).json(result);
}




module.exports = {
  getContactsService,
  getContactByIdService,
  creacteContactService,
  deleteContactService,
  updateContactService,
  updateFavoriteService,
};

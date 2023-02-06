// qZRhej5142LnSy3i   // password MongoDb
const express = require('express');
const logger = require('morgan');
const cors = require('cors');

const { routerContacts } = require('./routes/api/contacts');
const { authRouter } = require('./routes/api/auth');
const { userRouter } = require('./routes/api/user');

const dotenv = require('dotenv');
dotenv.config(); // should be called before you use env variables(читає шляхи із файлів .env)

const app = express();
const formatsLogger = app.get('env') === 'development' ? 'dev' : 'short';

// middelvwares
app.use(logger(formatsLogger));
app.use(express.json()); // tell express to work with JSON
app.use(cors()); // разрешаем кроссдоменные запросы к нашему приложению через промежуточное ПО cors

// routes
app.use('/api/contacts', routerContacts);
app.use('/api/auth', authRouter);
app.use('/api/users', userRouter);

// 404
app.use((_, res, __) => {
  res.status(404).json({message: 'Use api on routes: /api/contacts'});
});

// error handling
app.use((error, _, res, __) => {

  console.log('Handling Error', error.message, error.name);
  // handle mongoose validation error
  if (error.name === 'ValidationError') {
    return res.status(400).json({
      message: 'Ошибка от Joi или другой библиотеки валидации'
    });
  }

// handle objectId validation error
  if (error.message.includes('ObjectID failed for value')) {
    return res.status(400).json({
      message: 'Id is invalid',
    });
  }
  
  //
  
  if (error.message.status) {
    return res.status(error.status).json({
      message: error.message,
    });
  } 
   
  return res
    .status(error.status || 500)
    .json({ message: error.message || "Internal server error" });
});

module.exports = app;
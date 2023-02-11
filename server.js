require('dotenv').config(); // має бути на самому верху щою відпрацювало

const mongoose = require('mongoose');
const app = require('./app');

// const { sendEmail } = require('./models/helpers/index');

mongoose.set('strictQuery', false);

// connection to Mongoose DB
const { DB_HOST, PORT = 3002 } = process.env;

mongoose.connect(DB_HOST)
  .then(() => app.listen(PORT, () => {
    console.log(`Database connection successful use API on PORT: ${PORT}`)
  }))
    .catch(error => {
      console.log(`Server not running. Error message: ${error.message}`);
      process.exit(1);
    })
  
// sendEmail();

  
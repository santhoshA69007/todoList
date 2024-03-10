const mongoose = require('mongoose');
require('dotenv').config();
const url = require('url');

const uri_pass = process.env.MONGODB_URI_PASS;
const uri =process.env.MONGODB_URI
console.log(uri_pass);
const uri_enc =uri.replace("<password>",encodeURIComponent(uri_pass))
console.log(uri_enc);

mongoose.connect(uri_enc, {
  useNewUrlParser: true,
  useUnifiedTopology: true,

});

const connection = mongoose.connection;

connection.once('open', () => {
  console.log('MongoDB Atlas connection established successfully');
}).on('error', (error) => {
  console.log('Error connecting to MongoDB Atlas:', error);
});

// backend/server.js
const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cors = require('cors');
const providerRoutes = require('./routes/providerRoutes');
const { handleError } = require('./utils/errorHandler');

const app = express();
const port = 5000;
require('dotenv').config()
app.use(bodyParser.json());
app.use(cors());
 mongoose.connect(`mongodb+srv://${process.env.DB_USERNAME}:${process.env.DB_PASSWORD}@dblucasleiro.1tbb4b0.mongodb.net/DbLucasLeiro?retryWrites=true&w=majority`)
// mongoose.connect('mongodb://localhost:27017/proveedores')
  .then(() => console.log('Mongoose is connected'))
  .catch(err => console.log(`Mongoose connection error: ${err}`));

mongoose.connection.on('disconnected', () => {
  console.log('Mongoose is disconnected');
});

app.use('/providers', providerRoutes);

// Error handling middleware
app.use((err, req, res, next) => {
    handleError(err, res);
});

app.listen(port, () => {
    console.log(`Servidor escuchando en el puerto ${port}`);
});

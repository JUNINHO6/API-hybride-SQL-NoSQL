const mongoose = require('mongoose');
require('dotenv').config();

const mongoURI = process.env.MONGO_URI || 'mongodb://localhost:27017/bookly_nosql';

const connectMongo = async () => {
  try {
    await mongoose.connect(mongoURI);
    console.log('Connexion MongoDB établie');
  } catch (error) {
    console.error('Erreur de connexion MongoDB:', error);
    process.exit(1);
  }
};

mongoose.connection.on('connected', () => {
  console.log('Mongoose connecté à MongoDB');
});

mongoose.connection.on('error', (err) => {
  console.error('Erreur Mongoose:', err);
});

mongoose.connection.on('disconnected', () => {
  console.log('Mongoose déconnecté');
});

module.exports = connectMongo;

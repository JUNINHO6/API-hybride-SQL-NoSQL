const express = require('express');
const cors = require('cors');
require('dotenv').config();

const { initTables } = require('./config/db.postgres');
const connectMongo = require('./config/db.mongo');
const userRoutes = require('./routes/userRoutes');
const bookRoutes = require('./routes/bookRoutes');
const profileRoutes = require('./routes/profileRoutes');
const { getUserFull } = require('./controllers/profileController');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use('/api/users', userRoutes);
app.use('/api/books', bookRoutes);
app.use('/api/profiles', profileRoutes);
app.get('/api/user-full/:id', getUserFull);

app.get('/', (req, res) => {
  res.json({
    message: 'Bienvenue sur l\'API hybride Bookly+',
    version: '1.0.0',
      endpoints: {
        users: '/api/users',
        books: '/api/books',
        profiles: '/api/profiles',
        userFull: '/api/user-full/:id'
      }
  });
});

app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: 'Route non trouvée'
  });
});

app.use((err, req, res, next) => {
  console.error('Erreur:', err);
  res.status(500).json({
    success: false,
    message: 'Erreur serveur',
    error: err.message
  });
});

const startServer = async () => {
  try {
    await initTables();
    await connectMongo();

    app.listen(PORT, () => {
      console.log(`Serveur démarré sur le port ${PORT}`);
      console.log(`API disponible sur http://localhost:${PORT}`);
      console.log(`Endpoints disponibles:`);
      console.log(`   - GET    /api/users`);
      console.log(`   - POST   /api/users`);
      console.log(`   - GET    /api/books`);
      console.log(`   - POST   /api/books`);
      console.log(`   - GET    /api/profiles/:userId`);
      console.log(`   - POST   /api/profiles`);
      console.log(`   - PUT    /api/profiles/:userId`);
      console.log(`   - GET    /api/user-full/:id`);
    });
  } catch (error) {
    console.error('Erreur lors du démarrage du serveur:', error);
    process.exit(1);
  }
};

startServer();

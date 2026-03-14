import express from 'express';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import pokemonsRouter from './routes/pokemons.js';
import authRouter from './routes/auth.js'; // Nos nouvelles routes d'auth

dotenv.config();

const app = express();

// Middleware pour lire le JSON dans le body des requêtes
app.use(express.json());

// Déclaration de nos routes
app.use('/api/pokemons', pokemonsRouter);
app.use('/api/auth', authRouter);

app.get('/', (req, res) => {
  res.send('Hello, World!');
});

// --- CONNEXION À MONGODB ---
mongoose.connect(process.env.MONGODB_URI)
  .then(() => console.log('✅ Connecté à MongoDB'))
  .catch((err) => console.error('❌ Erreur de connexion MongoDB :', err));

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`🚀 Server is running on http://localhost:${PORT}`);
});

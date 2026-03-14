// routes/auth.js
import express from 'express';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import User from '../models/User.js';

const router = express.Router();

// --- INSCRIPTION (REGISTER) ---
router.post('/register', async (req, res) => {
  try {
    const { email, password } = req.body;

    // 1. Vérifier si l'utilisateur existe déjà
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ error: "Cet email est déjà utilisé" });
    }

    // 2. Hasher le mot de passe
    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    // 3. Créer et sauvegarder l'utilisateur
    const newUser = new User({
      email: email,
      password: hashedPassword
    });
    await newUser.save();

    res.status(201).json({ message: "Utilisateur créé avec succès !" });
  } catch (error) {
    res.status(500).json({ error: "Erreur serveur lors de l'inscription", details: error.message });
  }
});

// --- CONNEXION (LOGIN) ---
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    // 1. Chercher l'utilisateur par son email
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({ error: "Email ou mot de passe incorrect" });
    }

    // 2. Comparer le mot de passe envoyé avec celui en base de données
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ error: "Email ou mot de passe incorrect" });
    }

    // 3. Générer le Token JWT
    // On met l'ID de l'utilisateur dans le token pour le reconnaître plus tard
    const token = jwt.sign(
      { userId: user._id },
      process.env.JWT_SECRET,
      { expiresIn: '24h' } // Le token expire dans 24h
    );

    res.status(200).json({ 
      message: "Connexion réussie",
      token: token 
    });
  } catch (error) {
    res.status(500).json({ error: "Erreur serveur lors de la connexion", details: error.message });
  }
});

export default router;

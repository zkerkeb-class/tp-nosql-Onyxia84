// middleware/auth.js
import jwt from 'jsonwebtoken';

const auth = (req, res, next) => {
  try {
    // 1. On récupère le header "Authorization"
    const authHeader = req.headers.authorization;
    
    // Si pas de header, on rejette
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ error: "Accès refusé. Token manquant ou mal formaté." });
    }

    // 2. On extrait le token (qui est sous la forme "Bearer eyJhbG...")
    const token = authHeader.split(' ')[1];

    // 3. On vérifie la validité du token avec notre clé secrète
    const decodedToken = jwt.verify(token, process.env.JWT_SECRET);

    // 4. Si tout est bon, on ajoute l'ID de l'utilisateur à la requête et on passe à la suite
    req.user = decodedToken;
    next(); // "C'est bon, tu peux entrer !"
  } catch (error) {
    // Si le token est expiré ou trafiqué
    res.status(401).json({ error: "Token invalide ou expiré." });
  }
};

export default auth;

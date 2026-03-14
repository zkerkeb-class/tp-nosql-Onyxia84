# 🐉 API Pokémon & MongoDB — TP NoSQL

Ce projet est une API RESTful complète construite avec Node.js, Express.js et MongoDB. 
Il permet de gérer les 151 Pokémon de la première génération avec un système d'authentification sécurisé.

## 🛠️ Technologies utilisées

- **Node.js & Express.js** : Pour le serveur et la création de l'API REST.
- **MongoDB & Mongoose** : Base de données NoSQL et ODM pour la modélisation des données.
- **Bcrypt** : Pour le hachage sécurisé des mots de passe.
- **JSON Web Token (JWT)** : Pour l'authentification et la protection des routes.
- **Dotenv** : Pour la gestion des variables d'environnement.
- **Nodemon** : Pour le rechargement automatique du serveur en développement.

## 🚀 Installation et démarrage

1. **Cloner le projet ou récupérer les fichiers**
2. **Installer les dépendances :**
   ```bash
   npm install

    Configurer les variables d'environnement : Créez un fichier .env à la racine du projet et ajoutez vos informations :

    PORT=3000
    MONGODB_URI=votre_chaine_de_connexion_mongodb
    JWT_SECRET=votre_cle_secrete_super_complexe

    Lancer le serveur en mode développement :

    npm run dev

📡 Routes de l'API
🔐 Authentification (/api/auth)

    POST /register : Créer un nouvel utilisateur (nécessite email et password).
    POST /login : Se connecter et récupérer un token JWT.

🐾 Pokémons (/api/pokemons)

Les routes marquées d'un 🔒 nécessitent de passer le Token JWT dans le header Authorization: Bearer <token>.

    GET / : Récupérer la liste des Pokémon (avec pagination).
    GET /:id : Récupérer les détails d'un Pokémon spécifique via son ID.
    POST / 🔒 : Ajouter un nouveau Pokémon.
    PUT /:id 🔒 : Modifier les informations d'un Pokémon.
    DELETE /:id 🔒 : Supprimer un Pokémon.

👤 Auteur

Caron Raphael Réalisé dans le cadre du TP NoSQL.

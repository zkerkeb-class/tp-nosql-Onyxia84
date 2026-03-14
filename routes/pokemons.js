// routes/pokemons.js
import auth from '../middleware/auth.js';
import express from 'express';
import pokemonsData from '../data/pokemonsList.js';
import Pokemon from '../models/Pokemon.js';

const router = express.Router();

// --- ROUTE POUR REMPLIR LA BDD (À faire une seule fois) ---
router.post('/seed', auth, async (req, res) => {
  try {
    await Pokemon.deleteMany({});
    await Pokemon.insertMany(pokemonsData);
    res.status(201).json({ message: "Base de données initialisée avec 151 Pokémon !" });
  } catch (error) {
    res.status(500).json({ error: "Erreur lors de l'initialisation", details: error.message });
  }
});

// --- LIRE TOUS LES POKÉMON (Avec Filtres, Tri et Pagination - PARTIE 4) ---
router.get('/', async (req, res) => {
  try {
    // 1. Récupération des paramètres de l'URL (avec des valeurs par défaut pour la pagination)
    const { type, name, sort, page = 1, limit = 50 } = req.query;

    // 2. Construction du filtre (Étapes 4.1 & 4.2)
    const filter = {};
    if (type) {
      filter.type = type;
    }
    if (name) {
      // Recherche insensible à la casse sur le nom en anglais
      filter['name.english'] = { $regex: name, $options: 'i' };
    }

    // 3. Calcul de la pagination (Étape 4.4)
    const pageNumber = parseInt(page, 10);
    const limitNumber = parseInt(limit, 10);
    const skip = (pageNumber - 1) * limitNumber;

    // 4. Construction de la requête MongoDB
    let query = Pokemon.find(filter);

    // Ajout du tri si demandé (Étape 4.3)
    if (sort) {
      query = query.sort(sort);
    }

    // Ajout de la pagination
    query = query.skip(skip).limit(limitNumber);

    // 5. Exécution des requêtes (les données + le nombre total pour la pagination)
    const pokemons = await query;
    const total = await Pokemon.countDocuments(filter);
    const totalPages = Math.ceil(total / limitNumber);

    // 6. Formatage de la réponse
    res.status(200).json({
      data: pokemons,
      page: pageNumber,
      limit: limitNumber,
      total: total,
      totalPages: totalPages
    });

  } catch (error) {
    res.status(500).json({ error: "Erreur serveur", details: error.message });
  }
});

// --- LIRE UN POKÉMON PAR SON ID ---
router.get('/:id', async (req, res) => {
  try {
    const id = parseInt(req.params.id, 10);
    const pokemon = await Pokemon.findOne({ id: id });

    if (!pokemon) {
      return res.status(404).json({ error: "Pokémon non trouvé" });
    }
    res.status(200).json(pokemon);
  } catch (error) {
    res.status(500).json({ error: "Erreur serveur" });
  }
});

// --- CRÉER UN NOUVEAU POKÉMON (POST) ---
router.post('/', auth, async (req, res) => {
  try {
    const newPokemon = new Pokemon(req.body);
    const savedPokemon = await newPokemon.save();
    res.status(201).json(savedPokemon);
  } catch (error) {
    res.status(400).json({ error: "Erreur lors de la création", details: error.message });
  }
});

// --- METTRE À JOUR UN POKÉMON (PUT) ---
router.put('/:id', auth, async (req, res) => {
  try {
    const id = parseInt(req.params.id, 10);
    const updatedPokemon = await Pokemon.findOneAndUpdate(
      { id: id }, 
      req.body, 
      { new: true, runValidators: true }
    );

    if (!updatedPokemon) {
      return res.status(404).json({ error: "Pokémon non trouvé" });
    }
    res.status(200).json(updatedPokemon);
  } catch (error) {
    res.status(400).json({ error: "Erreur lors de la mise à jour", details: error.message });
  }
});

// --- SUPPRIMER UN POKÉMON (DELETE) ---
router.delete('/:id', auth, async (req, res) => {
  try {
    const id = parseInt(req.params.id, 10);
    const deletedPokemon = await Pokemon.findOneAndDelete({ id: id });

    if (!deletedPokemon) {
      return res.status(404).json({ error: "Pokémon non trouvé" });
    }
    res.status(200).json({ message: `Le Pokémon ${deletedPokemon.name.french} a été supprimé.` });
  } catch (error) {
    res.status(500).json({ error: "Erreur serveur lors de la suppression" });
  }
});

export default router;

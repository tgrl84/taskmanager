const mongoose = require('mongoose');

const sousTacheSchema = new mongoose.Schema({
  titre: { type: String, required: true },
  statut: { type: String, enum: ['à faire', 'en cours', 'terminée', 'annulée'], default: 'à faire' },
  echeance: Date
});

const commentaireSchema = new mongoose.Schema({
  auteur: { type: String, required: true },
  date: { type: Date, default: Date.now },
  contenu: { type: String, required: true }
});

const historiqueSchema = new mongoose.Schema({
  champModifie: String,
  ancienneValeur: mongoose.Schema.Types.Mixed,
  nouvelleValeur: mongoose.Schema.Types.Mixed,
  date: { type: Date, default: Date.now }
});

const taskSchema = new mongoose.Schema({
  titre: { type: String, required: true },
  description: String,
  dateCreation: { type: Date, default: Date.now },
  echeance: Date,
  statut: { type: String, enum: ['à faire', 'en cours', 'terminée', 'annulée'], default: 'à faire' },
  priorite: { type: String, enum: ['basse', 'moyenne', 'haute', 'critique'], default: 'moyenne' },
  auteur: {
    nom: String,
    prenom: String,
    email: { type: String, required: true, match: /.+\@.+\..+/ }
  },
  categorie: String,
  etiquettes: [String],
  sousTaches: [sousTacheSchema],
  commentaires: [commentaireSchema],
  historiqueModifications: [historiqueSchema]
});

module.exports = mongoose.model('Task', taskSchema);
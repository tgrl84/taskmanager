const express = require('express');
const mongoose = require('mongoose');
const connectDB = require('./config/db');
const taskRoutes = require('./routes/tasks');
const errorHandler = require('./middlewares/errorHandler');

const app = express();

// Connexion à la base de données
connectDB();

// Middleware
app.use(express.json());

// Routes
app.use('/tasks', taskRoutes);

// Gestion des erreurs
app.use(errorHandler);

module.exports = app;
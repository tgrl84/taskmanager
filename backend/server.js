const express = require('express');
const connectDB = require('./config/db');
const taskRoutes = require('./routes/tasks');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 5000;

// Connexion à la base de données
connectDB();

// Middleware
app.use(express.json());
app.use(cors());

// Routes
app.use('/api/tasks', taskRoutes);

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
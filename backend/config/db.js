const mongoose = require('mongoose');

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/taskmanager', {
      useNewUrlParser: true,
      useUnifiedTopology: true
    });
    console.log('MongoDB connecté');
  } catch (err) {
    console.error('Erreur de connexion à MongoDB:', err.message);
    process.exit(1);
  }
};

module.exports = connectDB;
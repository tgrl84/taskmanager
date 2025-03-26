const Task = require('../models/Task');
const { applyFilters, applySort } = require('../utils/filters');

// Get all tasks with filtering and sorting
exports.getAllTasks = async (req, res, next) => {
  try {
    let query = Task.find();
    query = applyFilters(query, req.query);
    query = applySort(query, req.query);
    
    const tasks = await query.exec();
    res.json(tasks);
  } catch (err) {
    next(err);
  }
};

// Get single task
exports.getTask = async (req, res, next) => {
  try {
    const task = await Task.findById(req.params.id);
    if (!task) {
      return res.status(404).json({ message: 'Tâche non trouvée' });
    }
    res.json(task);
  } catch (err) {
    next(err);
  }
};

// Create task
exports.createTask = async (req, res, next) => {
  try {
    const newTask = new Task(req.body);
    const savedTask = await newTask.save();
    res.status(201).json(savedTask);
  } catch (err) {
    next(err);
  }
};

// Update task
exports.updateTask = async (req, res, next) => {
  try {
    const task = await Task.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );
    if (!task) {
      return res.status(404).json({ message: 'Tâche non trouvée' });
    }
    res.json(task);
  } catch (err) {
    next(err);
  }
};

// Delete task
exports.deleteTask = async (req, res, next) => {
  try {
    const task = await Task.findByIdAndDelete(req.params.id);
    if (!task) {
      return res.status(404).json({ message: 'Tâche non trouvée' });
    }
    res.json({ message: 'Tâche supprimée avec succès' });
  } catch (err) {
    next(err);
  }
};

// Ajouter un commentaire
exports.addComment = async (req, res, next) => {
  try {
    const task = await Task.findById(req.params.id);
    if (!task) {
      return res.status(404).json({ message: 'Tâche non trouvée' });
    }
    
    const newComment = {
      auteur: req.body.auteur,
      contenu: req.body.contenu
    };
    
    task.commentaires.push(newComment);
    const updatedTask = await task.save();
    
    res.status(201).json(updatedTask);
  } catch (err) {
    next(err);
  }
};

// Supprimer un commentaire
exports.deleteComment = async (req, res, next) => {
  try {
    const task = await Task.findById(req.params.id);
    if (!task) {
      return res.status(404).json({ message: 'Tâche non trouvée' });
    }
    
    task.commentaires = task.commentaires.filter(
      comment => comment._id.toString() !== req.params.commentId
    );
    
    const updatedTask = await task.save();
    res.json(updatedTask);
  } catch (err) {
    next(err);
  }
};
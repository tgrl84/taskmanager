document.addEventListener('DOMContentLoaded', function() {
    const apiUrl = 'http://localhost:5000/api/tasks';
    let currentTaskId = null;

    // Éléments du DOM
    const tasksContainer = document.getElementById('tasks-container');
    const taskForm = document.getElementById('task-form');
    const formTitle = document.getElementById('form-title');
    const cancelEditBtn = document.getElementById('cancel-edit');
    
    // Filtres
    const statusFilter = document.getElementById('status-filter');
    const priorityFilter = document.getElementById('priority-filter');
    const searchFilter = document.getElementById('search-filter');
    const applyFiltersBtn = document.getElementById('apply-filters');

    // Chargement initial des tâches
    loadTasks();

    // Gestion du formulaire
    taskForm.addEventListener('submit', function(e) {
        e.preventDefault();
        saveTask();
    });

    // Annuler l'édition
    cancelEditBtn.addEventListener('click', function() {
        resetForm();
    });

    // Appliquer les filtres
    applyFiltersBtn.addEventListener('click', function() {
        loadTasks();
    });

    // Fonction pour charger les tâches
    function loadTasks() {
        let url = apiUrl + '?';
        
        if (statusFilter.value) url += `statut=${statusFilter.value}&`;
        if (priorityFilter.value) url += `priorite=${priorityFilter.value}&`;
        if (searchFilter.value) url += `q=${searchFilter.value}&`;
        
        fetch(url)
            .then(response => response.json())
            .then(tasks => {
                displayTasks(tasks);
            })
            .catch(error => {
                console.error('Erreur:', error);
                alert('Erreur lors du chargement des tâches');
            });
    }

    // Afficher les tâches
    function displayTasks(tasks) {
        tasksContainer.innerHTML = '';
        
        if (tasks.length === 0) {
            tasksContainer.innerHTML = '<p>Aucune tâche trouvée</p>';
            return;
        }

        tasks.forEach(task => {
            const taskElement = document.createElement('div');
            taskElement.className = `task-card ${task.priorite === 'basse' ? 'low-priority' : ''} ${task.priorite === 'moyenne' ? 'medium-priority' : ''} ${task.priorite === 'haute' ? 'high-priority' : ''} ${task.priorite === 'critique' ? 'critical-priority' : ''}`;
            
            const dueDate = new Date(task.echeance).toLocaleDateString();
            const createdDate = new Date(task.dateCreation).toLocaleDateString();
            
            taskElement.innerHTML = `
                <div class="task-title">${task.titre}</div>
                <div class="task-meta">
                    <span>Statut: ${task.statut}</span>
                    <span>Priorité: ${task.priorite}</span>
                    <span>Échéance: ${dueDate || 'Non définie'}</span>
                </div>
                <div class="task-description">${task.description || ''}</div>
                <div class="task-actions">
                    <button class="edit-btn" data-id="${task._id}">Modifier</button>
                    <button class="delete-btn" data-id="${task._id}">Supprimer</button>
                </div>
            `;

            // Ajouter les sous-tâches avant les commentaires
            if (task.sousTaches && task.sousTaches.length > 0) {
                const subtasksSection = document.createElement('div');
                subtasksSection.className = 'subtasks-section';
                subtasksSection.innerHTML = '<h3>Sous-tâches</h3>';
               
                const subtasksList = document.createElement('div');
                subtasksList.className = 'subtasks-list';
                
                task.sousTaches.forEach(subtask => {
                    const subtaskItem = document.createElement('div');
                    subtaskItem.className = 'subtask-item';
                    subtaskItem.innerHTML = `
                        <div class="subtask-content">
                            <span class="subtask-title">${subtask.titre}</span>
                            ${subtask.echeance ? `<span class="subtask-due">(${new Date(subtask.echeance).toLocaleDateString()})</span>` : ''}
                        </div>
                        <div class="subtask-status">${subtask.statut}</div>
                    `;
                    subtasksList.appendChild(subtaskItem);
                });
                
                subtasksSection.appendChild(subtasksList);
                taskElement.appendChild(subtasksSection);
            }

            // Ajouter la section des commentaires après les sous-tâches
            taskElement.appendChild(displayComments(task));
            
            tasksContainer.appendChild(taskElement);
        });

        // Ajouter l'événement pour ajouter un commentaire
        document.querySelectorAll('.add-comment-btn').forEach(btn => {
            btn.addEventListener('click', function() {
                const taskId = this.getAttribute('data-id');
                const commentInput = this.previousElementSibling;
                const commentContent = commentInput.value.trim();
                
                if (commentContent) {
                    addComment(taskId, commentContent);
                    commentInput.value = ''; // Vider le champ après l'ajout
                }
            });
        });
    }

    // Enregistrer une tâche (création ou modification)
    function saveTask() {
        const subtasks = [];
        document.querySelectorAll('.subtask-input').forEach(subtask => {
            const title = subtask.querySelector('.subtask-title').value;
            const due = subtask.querySelector('.subtask-due').value;
            if (title) {
                subtasks.push({
                    titre: title,
                    echeance: due || null
                });
            }
        });

        const taskData = {
            titre: document.getElementById('task-title').value,
            description: document.getElementById('task-description').value,
            echeance: document.getElementById('task-due').value,
            statut: document.getElementById('task-status').value,
            priorite: document.getElementById('task-priority').value,
            sousTaches: subtasks,
            auteur: { nom: "Utilisateur", prenom: "Test", email: "test@example.com" }
        };

        const method = currentTaskId ? 'PUT' : 'POST';
        const url = currentTaskId ? `${apiUrl}/${currentTaskId}` : apiUrl;

        fetch(url, {
            method: method,
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(taskData)
        })
        .then(response => response.json())
        .then(() => {
            loadTasks();
            resetForm();
        })
        .catch(error => {
            console.error('Erreur:', error);
            alert('Erreur lors de la sauvegarde de la tâche');
        });
    }

    // Modifier une tâche existante
    function editTask(taskId) {
        fetch(`${apiUrl}/${taskId}`)
            .then(response => response.json())
            .then(task => {
                currentTaskId = task._id;
                formTitle.textContent = 'Modifier la tâche';
                cancelEditBtn.style.display = 'inline-block';
                
                document.getElementById('task-title').value = task.titre;
                document.getElementById('task-description').value = task.description || '';
                document.getElementById('task-due').value = task.echeance ? task.echeance.split('T')[0] : '';
                document.getElementById('task-status').value = task.statut;
                document.getElementById('task-priority').value = task.priorite;

                // Afficher les sous-tâches
                const subtasksContainer = document.getElementById('subtasks-container');
                subtasksContainer.innerHTML = '';
                if (task.sousTaches && task.sousTaches.length > 0) {
                    task.sousTaches.forEach(subtask => {
                        const subtaskInput = document.createElement('div');
                        subtaskInput.className = 'subtask-input';
                        subtaskInput.innerHTML = `
                            <input type="text" class="subtask-title" value="${subtask.titre}">
                            <input type="date" class="subtask-due" value="${subtask.echeance || ''}">
                            <button type="button" class="remove-subtask">×</button>
                        `;
                        subtasksContainer.appendChild(subtaskInput);
                    });
                }
            })
            .catch(error => {
                console.error('Erreur:', error);
                alert('Erreur lors du chargement de la tâche');
            });
    }

    // Supprimer une tâche
    function deleteTask(taskId) {
        if (!confirm('Voulez-vous vraiment supprimer cette tâche ?')) return;
        
        fetch(`${apiUrl}/${taskId}`, {
            method: 'DELETE'
        })
        .then(() => {
            loadTasks();
        })
        .catch(error => {
            console.error('Erreur:', error);
            alert('Erreur lors de la suppression de la tâche');
        });
    }

    // Réinitialiser le formulaire
    function resetForm() {
        currentTaskId = null;
        taskForm.reset();
        formTitle.textContent = 'Ajouter une tâche';
        cancelEditBtn.style.display = 'none';
    }

    // Ajouter cette fonction pour afficher les commentaires
    function displayComments(task) {
        const commentsContainer = document.createElement('div');
        commentsContainer.className = 'task-comments';
        
        // Affichage des commentaires existants
        if (task.commentaires && task.commentaires.length > 0) {
            const commentsList = document.createElement('div');
            commentsList.className = 'comments-list';
            
            task.commentaires.forEach(comment => {
                const commentElement = document.createElement('div');
                commentElement.className = 'comment';
                commentElement.innerHTML = `
                    <div class="comment-header">
                        <span class="comment-author">${comment.auteur}</span>
                        <span class="comment-date">${new Date(comment.date).toLocaleString()}</span>
                    </div>
                    <div class="comment-content">${comment.contenu}</div>
                `;
                commentsList.appendChild(commentElement);
            });
            
            commentsContainer.appendChild(commentsList);
        }

        // Zone d'ajout de commentaire (placée après la liste des commentaires)
        const commentForm = document.createElement('div');
        commentForm.className = 'comment-form';
        commentForm.innerHTML = `
            <textarea class="comment-input" placeholder="Ajouter un commentaire..."></textarea>
            <button class="add-comment-btn" data-id="${task._id}">Ajouter</button>
        `;
        commentsContainer.appendChild(commentForm);

        return commentsContainer;
    }

    // Fonction pour ajouter un commentaire
    function addComment(taskId, content) {
        const commentData = {
            auteur: "Utilisateur", // Vous pouvez remplacer par l'utilisateur connecté
            contenu: content
        };

        fetch(`${apiUrl}/${taskId}/comments`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(commentData)
        })
        .then(response => response.json())
        .then(() => {
            loadTasks();
        })
        .catch(error => {
            console.error('Erreur:', error);
            alert('Erreur lors de l\'ajout du commentaire');
        });
    }

    // Ajouter cette fonction pour gérer les sous-tâches
    function handleSubtasks() {
        const subtasksContainer = document.getElementById('subtasks-container');
        
        // Ajouter une sous-tâche
        document.getElementById('add-subtask').addEventListener('click', function() {
            const subtaskInput = document.createElement('div');
            subtaskInput.className = 'subtask-input';
            subtaskInput.innerHTML = `
                <input type="text" class="subtask-title" placeholder="Titre de la sous-tâche">
                <input type="date" class="subtask-due">
                <button type="button" class="remove-subtask">×</button>
            `;
            subtasksContainer.appendChild(subtaskInput);
        });

        // Supprimer une sous-tâche
        subtasksContainer.addEventListener('click', function(e) {
            if (e.target.classList.contains('remove-subtask')) {
                e.target.parentElement.remove();
            }
        });
    }

    // Appeler handleSubtasks au chargement du DOM
    handleSubtasks();
});
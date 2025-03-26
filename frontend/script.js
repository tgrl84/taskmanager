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
            
            tasksContainer.appendChild(taskElement);
        });

        // Ajout des événements aux boutons
        document.querySelectorAll('.edit-btn').forEach(btn => {
            btn.addEventListener('click', function() {
                editTask(this.getAttribute('data-id'));
            });
        });

        document.querySelectorAll('.delete-btn').forEach(btn => {
            btn.addEventListener('click', function() {
                deleteTask(this.getAttribute('data-id'));
            });
        });
    }

    // Enregistrer une tâche (création ou modification)
    function saveTask() {
        const taskData = {
            titre: document.getElementById('task-title').value,
            description: document.getElementById('task-description').value,
            echeance: document.getElementById('task-due').value,
            statut: document.getElementById('task-status').value,
            priorite: document.getElementById('task-priority').value,
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
});
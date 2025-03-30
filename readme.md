# Gestionnaire de Tâches

Une application web simple pour gérer vos tâches avec des fonctionnalités avancées comme les sous-tâches, les commentaires, et le filtrage.

## Fonctionnalités

- Création, modification et suppression de tâches
- Ajout de sous-tâches pour chaque tâche principale
- Système de commentaires pour chaque tâche
- Filtrage des tâches par statut, priorité et recherche textuelle
- Tri des tâches par date d'échéance, priorité ou date de création
- Interface utilisateur intuitive et responsive

## Prérequis

- Node.js (version 16 ou supérieure)
- MongoDB (version 5 ou supérieure)
- NPM ou Yarn

## Installation

1. Cloner le dépôt :

```bash
git clone https://github.com/votre-utilisateur/gestionnaire-taches.git
cd gestionnaire-taches
```

2. Installer les dépendances :

```bash
cd backend
npm install
```

3. Configurer MongoDB :

- Assurez-vous que MongoDB est installé et en cours d'exécution
- Créez une base de données nommée `taskmanager`

4. Démarrer le serveur :

```bash
npm start
```

5. Ouvrir l'application :

- Ouvrez le fichier `frontend/index.html` dans votre navigateur

## Utilisation

### Interface Utilisateur

L'interface est divisée en deux sections principales :

1. **Liste des tâches** (à gauche) :

   - Affiche toutes les tâches
   - Filtres disponibles en haut
   - Cliquez sur une tâche pour voir les détails

2. **Formulaire de tâche** (à droite) :
   - Ajouter ou modifier une tâche
   - Ajouter des sous-tâches
   - Définir l'échéance, la priorité et le statut

### Fonctionnalités Clés

1. **Ajouter une tâche** :

   - Remplissez le formulaire et cliquez sur "Enregistrer"
   - Vous pouvez ajouter des sous-tâches avec le bouton "Ajouter une sous-tâche"

2. **Modifier une tâche** :

   - Cliquez sur le bouton "Modifier" d'une tâche
   - Le formulaire se remplira avec les informations existantes
   - Apportez vos modifications et cliquez sur "Enregistrer"

3. **Supprimer une tâche** :

   - Cliquez sur le bouton "Supprimer" d'une tâche
   - Confirmez la suppression

4. **Filtrer les tâches** :

   - Utilisez les menus déroulants pour filtrer par statut ou priorité
   - Utilisez la barre de recherche pour trouver des tâches par mot-clé

5. **Ajouter des commentaires** :
   - Développez une tâche pour voir la section commentaires
   - Tapez votre commentaire et cliquez sur "Ajouter"

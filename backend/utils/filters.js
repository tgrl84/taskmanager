exports.applyFilters = (query, queryParams) => {
  // Filtrage par statut
  if (queryParams.statut) {
    query = query.where('statut').equals(queryParams.statut);
  }
  
  // Filtrage par priorité
  if (queryParams.priorite) {
    query = query.where('priorite').equals(queryParams.priorite);
  }
  
  // Filtrage par catégorie
  if (queryParams.categorie) {
    query = query.where('categorie').equals(queryParams.categorie);
  }
  
  // Filtrage par étiquette
  if (queryParams.etiquette) {
    query = query.where('etiquettes').in([queryParams.etiquette]);
  }
  
  // Filtrage par date (avant)
  if (queryParams.avant) {
    query = query.where('echeance').lte(new Date(queryParams.avant));
  }
  
  // Filtrage par date (après)
  if (queryParams.apres) {
    query = query.where('echeance').gte(new Date(queryParams.apres));
  }
  
  // Recherche texte libre
  if (queryParams.q) {
    const searchTerm = queryParams.q;
    query = query.or([
      { titre: new RegExp(searchTerm, 'i') },
      { description: new RegExp(searchTerm, 'i') }
    ]);
  }
  
  return query;
};

exports.applySort = (query, queryParams) => {
  if (queryParams.tri) {
    const sortOrder = queryParams.ordre === 'desc' ? -1 : 1;
    
    switch(queryParams.tri) {
      case 'echeance':
        query = query.sort({ echeance: sortOrder });
        break;
      case 'priorite':
        // Note: Vous pourriez vouloir mapper les priorités à des valeurs numériques pour un tri correct
        query = query.sort({ priorite: sortOrder });
        break;
      case 'dateCreation':
        query = query.sort({ dateCreation: sortOrder });
        break;
      default:
        query = query.sort({ dateCreation: -1 }); // Tri par défaut
    }
  }
  
  return query;
};
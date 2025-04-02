  
  // Au chargement
  map.on('load', function () {
    // Source des zones piétonnes
    map.addSource('zones_pietonnes_source', {
      type: 'geojson',
      data: 'https://donnees.montreal.ca/fr/dataset/1e153f9f-3930-4133-8d35-ade2e8f7e7e3/resource/dfe003f6-2dd1-4c50-af68-154a914421cc/download/projetpietonnisation2017.geojson' // GeoJSON des zones piétonnes
    });
  
    // Source des zones scolaires
    map.addSource('parcs_source', {
      type: 'geojson',
      data: 'https://donnees.montreal.ca/fr/dataset/2e9e4d2f-173a-4c3d-a5e3-565d79baa27d/resource/35796624-15df-4503-a569-797665f8768e/download/espace_vert.json' // GeoJSON des zones scolaires
    });
    // Couche des zones piétonnes
    map.addLayer({
      id: 'pietonnes',
      type: '______________', // Type de géométrie (ex: "circle")
      source: '______________',
      paint: {
        'circle-color': '______________', // Couleur des points
        'circle-radius': ____________ // Taille des points
      }
    });
  
    // Couche des parcs
    map.addLayer({
      id: 'parcs',
      type: '______________', // Type de géométrie (ex: "fill")
      source: '______________',
      paint: {
        'fill-color': '______________',
        'fill-opacity': ____________
      }
    });
  
    // Couche de surlignement dynamique
    map.addLayer({
      id: 'highlighted',
      type: '______________',
      source: '______________',
      paint: {
        'fill-color': '______________',
        'fill-opacity': ____________
      },
      filter: ['in', 'OBJECTID', ''] // Ne rien surligner au départ
    });
  });
  
  // Survol d'une zone piétonne
  map.on('mousemove', '______________', function (e) {
    const features = e.features;
  
    if (!features.length) return;
  
    const zonePietonne = features[0];
  
    const zonePietonneBuffer = turf.buffer(______________, ____________, {
      units: 'meters'
    }); // Crée un buffer autour de la zone
  
    const bbox = turf.bbox(______________); // Calcule l’enveloppe spatiale de la zone pietonne avec buffer de 500m
    const candidates = map.queryRenderedFeatures({
      bbox: bbox,
      layers: ['______________']
    });
  
    const intersecting = candidates.filter(z => {
      return turf.booleanIntersects(______________, z);
    });
  
    const ids = intersecting.map(f => f.properties.______________);
  
    map.setFilter('highlighted', ['in', 'OBJECTID', ...______________]);
  
    // Mise à jour de l'interface HTML
    const list = document.getElementById('list');
    list.innerHTML = '';
    intersecting.forEach(f => {
      const li = document.createElement('li');
      li.textContent = f.properties.Nom ? f.properties.Nom : f.properties.TYPO1; // nom de la propriété si la propriété Nom n'est pas dispo TYPO1
      list.appendChild(li);
    });
  });
  
  // Curseur personnalisé lors du survol d'un point rouge
  map.on('mouseenter', '______________', function () {
    map.getCanvas().style.cursor = 'crosshair';
  });
  map.on('mouseleave', '______________', function () {
    map.getCanvas().style.cursor = '';
  });
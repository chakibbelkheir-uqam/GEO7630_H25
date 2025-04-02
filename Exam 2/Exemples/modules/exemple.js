  
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
      type: 'fill',
      source: '__________________',
      paint: {
        'fill-color': '#009688',
        'fill-opacity': 0.5
      }
    });
  
    // Couche des zones scolaires
    map.addLayer({
      id: 'parcs',
      type: 'fill',
      source: '__________________',
      paint: {
        'fill-color': '#FF5722',
        'fill-opacity': 0.3
      }
    });
  
    // Couche de surlignement dynamique
    map.addLayer({
      id: 'highlighted',
      type: 'line',
      source: 'zones_scolaires',
      paint: {
        'line-color': '#000',
        'line-width': 3
      },
      filter: ['in', 'id', ''] // Filtre vide au départ
    });
  });
  
  // Interaction : survol des zones piétonnes pour détecter les zones scolaires intersectées
  map.on('mousemove', 'pietonnes', function (e) {
    const features = e.features;
  
    if (!features.length) return;
  
    const zonePietonne = features[0];
    const bbox = turf.bbox(zonePietonne);
    const candidates = map.queryRenderedFeatures({ bbox: bbox, layers: ['parcs'] });
  
    const intersecting = candidates.filter(z => {
      return turf.booleanIntersects(zonePietonne, ________________);
    });
  
    const ids = intersecting.map(f => f.properties.id);
    map.setFilter('highlighted', ['in', 'id', ________________]);
  
    // Mettre à jour l’interface DOM avec les noms des écoles
    const list = document.getElementById('list');
    list.innerHTML = '';
    intersecting.forEach(f => {
      const li = document.createElement('li');
      li.textContent = f.properties.__________________;
      list.appendChild(li);
    });
  });
  
  // Curseur personnalisé
  map.on('mouseenter', 'pietonnes', function () {
    map.getCanvas().style.cursor = 'crosshair';
  });
  map.on('mouseleave', 'pietonnes', function () {
    map.getCanvas().style.cursor = '';
  });
  
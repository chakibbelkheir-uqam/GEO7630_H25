// === app.js ===
import { initMap } from './map.js';
import { initSidebar } from './sidebar.js';
import { handleArrondissements } from './arrondissements.js';
import { setupGeoJsonButton } from './dataLoader.js';

initMap();
initSidebar();
handleArrondissements();
setupGeoJsonButton();
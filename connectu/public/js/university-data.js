// Ontario Universities Database with coordinates
export const UNIVERSITIES = {
  'university of toronto': { lat: 43.6629, lng: -79.3957, name: 'University of Toronto' },
  'uoft': { lat: 43.6629, lng: -79.3957, name: 'University of Toronto' },
  'university of waterloo': { lat: 43.4516, lng: -80.4925, name: 'University of Waterloo' },
  'waterloo': { lat: 43.4516, lng: -80.4925, name: 'University of Waterloo' },
  'mcmaster university': { lat: 43.2557, lng: -79.8711, name: 'McMaster University' },
  'mcmaster': { lat: 43.2557, lng: -79.8711, name: 'McMaster University' },
  'western university': { lat: 42.9849, lng: -81.2453, name: 'Western University' },
  'western': { lat: 42.9849, lng: -81.2453, name: 'Western University' },
  'uwo': { lat: 42.9849, lng: -81.2453, name: 'Western University' },
  'queen\'s university': { lat: 44.2253, lng: -76.4953, name: 'Queen\'s University' },
  'queens': { lat: 44.2253, lng: -76.4953, name: 'Queen\'s University' },
  'queensu': { lat: 44.2253, lng: -76.4953, name: 'Queen\'s University' },
  'university of ottawa': { lat: 45.4215, lng: -75.6972, name: 'University of Ottawa' },
  'ottawa': { lat: 45.4215, lng: -75.6972, name: 'University of Ottawa' },
  'uottawa': { lat: 45.4215, lng: -75.6972, name: 'University of Ottawa' },
  'york university': { lat: 43.7315, lng: -79.5037, name: 'York University' },
  'york': { lat: 43.7315, lng: -79.5037, name: 'York University' },
  'yorku': { lat: 43.7315, lng: -79.5037, name: 'York University' },
  'carleton university': { lat: 45.3875, lng: -75.6997, name: 'Carleton University' },
  'carleton': { lat: 45.3875, lng: -75.6997, name: 'Carleton University' },
  'university of guelph': { lat: 43.1949, lng: -80.2477, name: 'University of Guelph' },
  'guelph': { lat: 43.1949, lng: -80.2477, name: 'University of Guelph' },
  'toronto metropolitan university': { lat: 43.6629, lng: -79.3957, name: 'Toronto Metropolitan University' },
  'tmu': { lat: 43.6629, lng: -79.3957, name: 'Toronto Metropolitan University' },
  'ryerson': { lat: 43.6629, lng: -79.3957, name: 'Toronto Metropolitan University' },
  'brock university': { lat: 43.2086, lng: -79.7608, name: 'Brock University' },
  'brock': { lat: 43.2086, lng: -79.7608, name: 'Brock University' },
  'trent university': { lat: 44.3894, lng: -79.2505, name: 'Trent University' },
  'trent': { lat: 44.3894, lng: -79.2505, name: 'Trent University' },
  'lakehead university': { lat: 48.3809, lng: -89.2477, name: 'Lakehead University' },
  'lakehead': { lat: 48.3809, lng: -89.2477, name: 'Lakehead University' },
  'laurentian university': { lat: 46.5500, lng: -80.7933, name: 'Laurentian University' },
  'laurentian': { lat: 46.5500, lng: -80.7933, name: 'Laurentian University' },
  'nipissing university': { lat: 46.3091, lng: -79.4608, name: 'Nipissing University' },
  'nipissing': { lat: 46.3091, lng: -79.4608, name: 'Nipissing University' },
  'algoma university': { lat: 46.4917, lng: -84.3033, name: 'Algoma University' },
  'algoma': { lat: 46.4917, lng: -84.3033, name: 'Algoma University' },
  'ocad university': { lat: 43.6589, lng: -79.3957, name: 'OCAD University' },
  'ocad': { lat: 43.6589, lng: -79.3957, name: 'OCAD University' },
  'ontario tech university': { lat: 43.7945, lng: -79.0458, name: 'Ontario Tech University' },
  'ontario tech': { lat: 43.7945, lng: -79.0458, name: 'Ontario Tech University' },
  'uoit': { lat: 43.7945, lng: -79.0458, name: 'Ontario Tech University' },
  'king\'s university college': { lat: 42.9849, lng: -81.2453, name: 'King\'s University College' },
  'kings': { lat: 42.9849, lng: -81.2453, name: 'King\'s University College' },
  'royal military college of canada': { lat: 44.2253, lng: -76.4953, name: 'Royal Military College of Canada' },
  'rmc': { lat: 44.2253, lng: -76.4953, name: 'Royal Military College of Canada' },
};

/**
 * Get university coordinates by name
 * @param {string} universityName - Name of the university
 * @returns {object|null} - Returns { lat, lng, name } or null if not found
 */
export const getUniversityCoords = (universityName) => {
  if (!universityName) return null;
  const normalized = universityName.toLowerCase().trim();
  return UNIVERSITIES[normalized] || null;
};

/**
 * Get all available universities (unique list)
 * @returns {array} - Array of unique university objects
 */
export const getAllUniversities = () => {
  return Object.values(UNIVERSITIES).reduce((unique, uni) => {
    if (!unique.find(u => u.name === uni.name)) {
      unique.push(uni);
    }
    return unique;
  }, []);
};
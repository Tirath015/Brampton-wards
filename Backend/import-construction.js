const fs = require('fs');
const path = require('path');
const mongoose = require('mongoose');
const Construction = require('./models/Construction');
const Ward = require('./models/Ward');
require('dotenv').config();

// MongoDB connection
mongoose.connect(process.env.MONGODB_URI)
  .then(() => console.log('✅ Connected to MongoDB'))
  .catch(err => {
    console.error('❌ MongoDB connection error:', err.message);
    process.exit(1);
  });

// Map GeoJSON STATUS to schema enum
const statusMap = {
  'Planning': 'Planning',
  'In Progress': 'In Progress',
  'Completed': 'Completed',
  'On Hold': 'On Hold',
  'Archive': 'Completed' // Archive → Completed
};

// Point-in-polygon helper
function pointInPolygon(point, polygon) {
  const [x, y] = point;
  const coords = polygon[0];
  let inside = false;
  for (let i = 0, j = coords.length - 1; i < coords.length; j = i++) {
    const xi = coords[i][0], yi = coords[i][1];
    const xj = coords[j][0], yj = coords[j][1];
    const intersect = ((yi > y) !== (yj > y)) &&
      (x < (xj - xi) * (y - yi) / (yj - yi) + xi);
    if (intersect) inside = !inside;
  }
  return inside;
}

// Import function
async function importConstruction() {
  try {
    console.log('\n📥 Importing construction projects...\n');

    // Clear existing data
    await Construction.deleteMany({});
    console.log('✅ Cleared existing construction data');

    // Load wards
    const allWards = await Ward.find();
    console.log(`✅ Loaded ${allWards.length} wards`);

    // Read GeoJSON
    const filePath = path.join(__dirname, 'data', 'construction.json');
    const rawData = fs.readFileSync(filePath, 'utf8');
    const geoData = JSON.parse(rawData);

    if (!geoData.features || !Array.isArray(geoData.features)) {
      throw new Error('JSON must contain a "features" array');
    }

    console.log(`✅ Found ${geoData.features.length} construction projects\n`);

    let importedCount = 0;
    let skippedCount = 0;

    for (const feature of geoData.features) {
      const properties = feature.properties;
      const geometry = feature.geometry;

      if (!geometry || !geometry.coordinates || geometry.coordinates.length === 0) {
        console.warn(`⚠️ Skipping project with no coordinates: ${properties.TITLE}`);
        skippedCount++;
        continue;
      }

      // Pick first coordinate if LineString
      const coords = geometry.type === 'LineString'
        ? geometry.coordinates[0]
        : geometry.coordinates;

      // Assign ward
      let wardNumber = parseInt(properties.WARD) || null;
      if (!wardNumber && allWards.length > 0) {
        for (const ward of allWards) {
          if (ward.geometry && pointInPolygon(coords, ward.geometry.coordinates)) {
            wardNumber = ward.wardNumber;
            break;
          }
        }
      }
      if (!wardNumber) wardNumber = Math.floor(Math.random() * 10) + 1;

      // Build project
      const constructionProject = {
        projectName: properties.TITLE || 'Construction Project',
        projectType: properties.TYPE_OF_PROJECT || 'Construction',
        status: statusMap[properties.STATUS] || 'In Progress',
        description: properties.CONSTRUCT_NOTICE || '',
        contractor: properties.CONTRACTOR || '',
        wardNumber: wardNumber,
        location: {
          type: 'Point',      // force Point
          coordinates: coords // [lng, lat]
        },
        startDate: properties.CONSTRUCT_START ? new Date(properties.CONSTRUCT_START) : undefined,
        estimatedEndDate: properties.CONSTRUCT_END ? new Date(properties.CONSTRUCT_END) : undefined,
        address: properties.PROJECT_LOCATION || ''
      };

      await Construction.create(constructionProject);
      importedCount++;
      console.log(`✅ Imported: ${constructionProject.projectName} (Ward ${wardNumber})`);
    }

    console.log(`\n🎉 Import complete: ${importedCount} projects, skipped: ${skippedCount}`);
    mongoose.connection.close();

  } catch (err) {
    console.error('❌ Import failed:', err.message);
    mongoose.connection.close();
  }
}

// Run import
importConstruction();

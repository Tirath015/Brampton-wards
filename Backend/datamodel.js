const fs = require('fs');
const path = require('path');

console.log('🔍 Diagnosing JSON file...\n');

// Check current directory
console.log('📂 Current directory:', __dirname);
console.log('📂 Full path:', path.resolve(__dirname));

// Check if data folder exists
const dataFolder = path.join(__dirname, 'data');
console.log('\n📁 Checking data folder:', dataFolder);
console.log('   Exists?', fs.existsSync(dataFolder));

if (fs.existsSync(dataFolder)) {
  console.log('\n📄 Files in data folder:');
  const files = fs.readdirSync(dataFolder);
  files.forEach(file => {
    const filePath = path.join(dataFolder, file);
    const stats = fs.statSync(filePath);
    console.log(`   - ${file} (${stats.size} bytes)`);
  });
}

// Check for construction.json
const jsonPath = path.join(__dirname, 'data', 'construction.json');
console.log('\n📄 Checking construction.json:', jsonPath);
console.log('   Exists?', fs.existsSync(jsonPath));

if (fs.existsSync(jsonPath)) {
  try {
    const fileContent = fs.readFileSync(jsonPath, 'utf8');
    console.log('\n📊 File size:', fileContent.length, 'bytes');
    
    if (fileContent.length === 0) {
      console.log('❌ File is EMPTY!\n');
      console.log('💡 Please add your JSON data to: data/construction.json');
      process.exit(1);
    }

    console.log('\n📄 First 500 characters:');
    console.log('---');
    console.log(fileContent.substring(0, 500));
    console.log('---');

    // Try to parse
    console.log('\n🔄 Attempting to parse JSON...');
    const jsonData = JSON.parse(fileContent);
    
    console.log('✅ JSON is valid!');
    console.log('📊 Type:', Array.isArray(jsonData) ? 'Array' : typeof jsonData);
    
    if (Array.isArray(jsonData)) {
      console.log('📊 Length:', jsonData.length);
      
      if (jsonData.length > 0) {
        console.log('\n📋 First object keys:');
        console.log(Object.keys(jsonData[0]));
        
        console.log('\n📋 First complete object:');
        console.log(JSON.stringify(jsonData[0], null, 2));
      } else {
        console.log('⚠️  Array is empty!');
      }
    } else {
      console.log('\n📋 Object keys:');
      console.log(Object.keys(jsonData));
      
      console.log('\n📋 Full object:');
      console.log(JSON.stringify(jsonData, null, 2));
    }

  } catch (error) {
    console.log('❌ Error reading/parsing JSON:', error.message);
    
    const fileContent = fs.readFileSync(jsonPath, 'utf8');
    console.log('\n📄 File content:');
    console.log(fileContent);
  }
} else {
  console.log('\n❌ construction.json NOT FOUND!\n');
  console.log('💡 Expected location: data/construction.json');
  console.log('💡 Please create the file and add your JSON data');
  
  // Check if file is in Downloads
  const downloadsPath = path.join(process.env.USERPROFILE, 'Downloads');
  console.log('\n🔍 Checking Downloads folder:', downloadsPath);
  
  if (fs.existsSync(downloadsPath)) {
    const downloadFiles = fs.readdirSync(downloadsPath);
    const jsonFiles = downloadFiles.filter(f => f.toLowerCase().includes('construction') || f.endsWith('.json'));
    
    if (jsonFiles.length > 0) {
      console.log('📄 Found these files in Downloads:');
      jsonFiles.forEach(f => console.log(`   - ${f}`));
      console.log('\n💡 Please move one of these to: Backend/data/construction.json');
    }
  }
}

console.log('\n✅ Diagnosis complete!');
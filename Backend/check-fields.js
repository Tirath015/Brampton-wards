const axios = require('axios');
require('dotenv').config();

async function listModels() {
  const apiKey = process.env.GEMINI_API_KEY;
  
  console.log('🔍 Checking available Gemini models...\n');
  
  try {
    const response = await axios.get(
      `https://generativelanguage.googleapis.com/v1beta/models?key=${apiKey}`
    );
    
    console.log('✅ Found models:\n');
    
    const geminiModels = response.data.models.filter(m => m.name.includes('gemini'));
    
    if (geminiModels.length === 0) {
      console.log('❌ No Gemini models found! Your API key might not have access.\n');
      console.log('All available models:');
      response.data.models.forEach(model => {
        console.log(`- ${model.name}`);
      });
    } else {
      geminiModels.forEach(model => {
        console.log(`📌 ${model.name}`);
        console.log(`   Display Name: ${model.displayName}`);
        console.log(`   Description: ${model.description}`);
        console.log(`   Supported Methods: ${model.supportedGenerationMethods.join(', ')}`);
        console.log('');
      });
    }
  } catch (error) {
    console.error('❌ Error listing models:');
    console.error(error.response?.data || error.message);
  }
}

listModels();
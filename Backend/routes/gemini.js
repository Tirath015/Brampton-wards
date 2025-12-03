const express = require('express');
const router = express.Router();
const axios = require('axios');

// Analyze ward infrastructure using Gemini AI
router.post('/analyze-ward', async (req, res) => {
  try {
    const { wardNumber, facilityData } = req.body;
    
    console.log(`\n Analyzing Ward ${wardNumber}...`);
    console.log(`Facilities received: ${facilityData.length}`);

    // Count facility types
    const counts = {
      schools: 0,
      police: 0,
      fire: 0,
      healthcare: 0
    };

    facilityData.forEach(facility => {
      if (facility.type === 'school') counts.schools++;
      if (facility.type === 'police') counts.police++;
      if (facility.type === 'fire') counts.fire++;
      if (facility.type === 'healthcare') counts.healthcare++;
    });

    console.log('📋 Facility counts:', counts);

    // Create prompt for Gemini
    const prompt = `You are an urban planning expert analyzing infrastructure for Ward ${wardNumber} in Brampton, Ontario, Canada.

Ward ${wardNumber} Infrastructure:
- Schools: ${counts.schools}
- Police Stations: ${counts.police}
- Fire Stations: ${counts.fire}
- Healthcare Facilities: ${counts.healthcare}

Provide a brief professional analysis (3-4 sentences):
1. Overall infrastructure assessment
2. Which services are adequate and which need improvement
3. One specific actionable recommendation

Be concise and professional.`;

    console.log('📤 Sending to Gemini API...');

    // Call Gemini 2.5 Flash
    const geminiResponse = await axios.post(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${process.env.GEMINI_API_KEY}`,
      {
        contents: [{
          parts: [{ text: prompt }]
        }]
      },
      {
        headers: { 'Content-Type': 'application/json' }
      }
    );

    const analysis = geminiResponse.data.candidates[0].content.parts[0].text;

    console.log(' Analysis generated!');
    console.log('Response preview:', analysis.substring(0, 100) + '...\n');

    res.json({
      success: true,
      analysis: analysis,
      wardNumber: wardNumber,
      facilityCounts: counts
    });

  } catch (error) {
    console.error('Gemini Error:', error.response?.data || error.message);
    
    res.status(500).json({
      success: false,
      error: 'Failed to generate analysis',
      details: error.response?.data?.error?.message || error.message
    });
  }
});

module.exports = router;
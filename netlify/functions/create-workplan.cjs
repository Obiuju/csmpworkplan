const { connectToDatabase } = require('./db.cjs');

exports.handler = async (event, context) => {
  context.callbackWaitsForEmptyEventLoop = false;

  const headers = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Content-Type': 'application/json'
  };

  if (event.httpMethod !== 'POST') {
    return { statusCode: 405, headers, body: 'Method Not Allowed' };
  }

  try {
    const db = await connectToDatabase();
    const collection = db.collection('activities');
    
    const activityData = JSON.parse(event.body);
    const result = await collection.insertOne({
      ...activityData,
      createdAt: activityData.createdAt || new Date().toISOString(),
      updatedAt: new Date().toISOString()
    });
    
    return {
      statusCode: 201,
      headers,
      body: JSON.stringify({ 
        success: true, 
        id: result.insertedId,
        message: 'Activity created successfully'
      })
    };
  } catch (error) {
    console.error('Error:', error);
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({ error: error.message })
    };
  }
};

const { connectToDatabase } = require('./db.cjs');

exports.handler = async (event, context) => {
  context.callbackWaitsForEmptyEventLoop = false;

  const headers = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Content-Type': 'application/json'
  };

  try {
    const db = await connectToDatabase();
    const collection = db.collection('activities');
    
    const activities = await collection.find({}).sort({ createdAt: -1 }).toArray();
    
    return {
      statusCode: 200,
      headers,
      body: JSON.stringify(activities)
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

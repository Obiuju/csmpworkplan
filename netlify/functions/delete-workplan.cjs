const { connectToDatabase } = require('./db.cjs');
const { ObjectId } = require('mongodb');

exports.handler = async (event, context) => {
  context.callbackWaitsForEmptyEventLoop = false;

  const headers = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Content-Type': 'application/json'
  };

  if (event.httpMethod !== 'DELETE') {
    return { statusCode: 405, headers, body: 'Method Not Allowed' };
  }

  try {
    const db = await connectToDatabase();
    const collection = db.collection('activities');
    
    const { id } = JSON.parse(event.body);
    
    const result = await collection.deleteOne({ 
      _id: new ObjectId(id) 
    });
    
    return {
      statusCode: 200,
      headers,
      body: JSON.stringify({ 
        success: true, 
        deleted: result.deletedCount,
        message: 'Activity deleted successfully'
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

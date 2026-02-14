const { connectToDatabase } = require('./db');
const { ObjectId } = require('mongodb');

exports.handler = async (event, context) => {
  context.callbackWaitsForEmptyEventLoop = false;

  const headers = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Content-Type': 'application/json'
  };

  if (event.httpMethod !== 'PUT') {
    return { statusCode: 405, headers, body: 'Method Not Allowed' };
  }

  try {
    const db = await connectToDatabase();
    const collection = db.collection('activities');
    
    const { id, ...updateData } = JSON.parse(event.body);
    
    const result = await collection.updateOne(
      { _id: new ObjectId(id) },
      { 
        $set: { 
          ...updateData, 
          updatedAt: new Date().toISOString() 
        } 
      }
    );
    
    return {
      statusCode: 200,
      headers,
      body: JSON.stringify({ 
        success: true, 
        modified: result.modifiedCount,
        message: 'Activity updated successfully'
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

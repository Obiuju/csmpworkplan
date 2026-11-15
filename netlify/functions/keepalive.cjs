const { connectToDatabase } = require('./db.cjs');

exports.handler = async () => {
  try {
    const db = await connectToDatabase();
    await db.command({ ping: 1 });
    console.log('MongoDB keep-alive OK', new Date().toISOString());
    return { statusCode: 200, body: 'ok' };
  } catch (err) {
    console.error('MongoDB keep-alive FAILED:', err.message);
    return { statusCode: 500, body: err.message };
  }
};

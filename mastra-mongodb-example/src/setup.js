import { MongoClient } from 'mongodb';
import { config } from './config.js';

/**
 * Setup script to ensure MongoDB is properly configured
 */
async function setup() {
  console.log('🔧 MongoDB Setup Script');
  console.log('======================\n');
  
  const client = new MongoClient(config.mongodb.uri);
  
  try {
    // Connect to MongoDB
    console.log('📡 Connecting to MongoDB...');
    await client.connect();
    console.log('✅ Connected successfully\n');
    
    // Check if database exists
    const db = client.db(config.mongodb.dbName);
    console.log(`📊 Using database: ${config.mongodb.dbName}`);
    
    // List existing collections
    const collections = await db.listCollections().toArray();
    console.log(`\n📁 Existing collections: ${collections.length}`);
    collections.forEach(col => {
      console.log(`   - ${col.name}`);
    });
    
    // Check MongoDB version
    const adminDb = client.db('admin');
    const result = await adminDb.command({ buildInfo: 1 });
    console.log(`\n📌 MongoDB version: ${result.version}`);
    
    // Verify vector search support (MongoDB Atlas Search or similar)
    console.log('\n🔍 Vector Search Capability:');
    if (result.version >= '6.0.0') {
      console.log('   ✅ MongoDB 6.0+ detected - Vector search supported');
    } else {
      console.log('   ⚠️  MongoDB < 6.0 - Limited vector search support');
      console.log('   💡 Consider upgrading to MongoDB 6.0+ or using MongoDB Atlas');
    }
    
    console.log('\n✅ Setup verification complete!');
    
  } catch (error) {
    console.error('❌ Setup error:', error.message);
    console.log('\n💡 Troubleshooting tips:');
    console.log('   1. Ensure MongoDB is running');
    console.log('   2. Check your connection string in .env');
    console.log('   3. Verify network connectivity');
    console.log('   4. Run: docker-compose up -d (if using Docker)');
  } finally {
    await client.close();
  }
}

// Run setup
setup().catch(console.error);
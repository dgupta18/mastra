// MongoDB initialization script
// This script runs when the MongoDB container is first created

// Switch to the mastra_example database
db = db.getSiblingDB('mastra_example');

// Create a user for the application
db.createUser({
  user: 'mastra_user',
  pwd: 'mastra_password',
  roles: [
    {
      role: 'readWrite',
      db: 'mastra_example'
    }
  ]
});

// Create collections with indexes
db.createCollection('vectors');
db.createCollection('threads');
db.createCollection('messages');
db.createCollection('app_data');

// Create indexes for better performance
db.threads.createIndex({ resourceId: 1 });
db.threads.createIndex({ createdAt: -1 });

db.messages.createIndex({ threadId: 1 });
db.messages.createIndex({ createdAt: -1 });

db.app_data.createIndex({ type: 1 });
db.app_data.createIndex({ 'data.userId': 1 });

print('✅ MongoDB initialized successfully');
print('📊 Database: mastra_example');
print('👤 User: mastra_user created');
print('📁 Collections created: vectors, threads, messages, app_data');
print('🔍 Indexes created for optimal performance');
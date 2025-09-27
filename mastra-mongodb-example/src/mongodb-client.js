import { MongoDBVector, MongoDBStore } from '@mastra/mongodb';
import { config } from './config.js';

let vectorStore = null;
let appStore = null;

/**
 * Initialize MongoDB Vector Store
 */
export async function initializeVectorStore() {
  if (vectorStore) return vectorStore;

  vectorStore = new MongoDBVector({
    uri: config.mongodb.uri,
    dbName: config.mongodb.dbName,
  });

  try {
    // Connect to MongoDB
    await vectorStore.connect();
    console.log('✅ Connected to MongoDB Vector Store');

    // Create vector index if it doesn't exist
    try {
      await vectorStore.createIndex({
        indexName: config.vector.indexName,
        dimension: config.vector.dimension,
        metric: 'cosine', // Options: 'cosine', 'euclidean', 'dotproduct'
      });
      console.log(`✅ Vector index '${config.vector.indexName}' created or already exists`);
    } catch (error) {
      if (error.message?.includes('already exists')) {
        console.log(`ℹ️  Vector index '${config.vector.indexName}' already exists`);
      } else {
        throw error;
      }
    }

    return vectorStore;
  } catch (error) {
    console.error('❌ Failed to initialize Vector Store:', error);
    throw error;
  }
}

/**
 * Initialize MongoDB App Store
 */
export async function initializeAppStore() {
  if (appStore) return appStore;

  appStore = new MongoDBStore({
    uri: config.mongodb.uri,
    dbName: config.mongodb.dbName,
  });

  console.log('✅ Initialized MongoDB App Store');
  return appStore;
}

/**
 * Get Vector Store instance
 */
export function getVectorStore() {
  if (!vectorStore) {
    throw new Error('Vector Store not initialized. Call initializeVectorStore() first.');
  }
  return vectorStore;
}

/**
 * Get App Store instance
 */
export function getAppStore() {
  if (!appStore) {
    throw new Error('App Store not initialized. Call initializeAppStore() first.');
  }
  return appStore;
}

/**
 * Close all connections
 */
export async function closeConnections() {
  if (vectorStore) {
    await vectorStore.close();
    console.log('✅ Closed Vector Store connection');
  }
  
  if (appStore) {
    // MongoDBStore doesn't have a close method, but we can clear the reference
    appStore = null;
    console.log('✅ Cleared App Store reference');
  }
}
import dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Load environment variables
dotenv.config({ path: join(__dirname, '..', '.env') });

export const config = {
  mongodb: {
    uri: process.env.MONGODB_URI || 'mongodb://localhost:27017',
    dbName: process.env.MONGODB_DB_NAME || 'mastra_example'
  },
  openai: {
    apiKey: process.env.OPENAI_API_KEY
  },
  vector: {
    dimension: parseInt(process.env.VECTOR_DIMENSION || '1536'),
    indexName: process.env.VECTOR_INDEX_NAME || 'documents_vector_index'
  }
};

// Validate configuration
if (!config.openai.apiKey) {
  console.warn('Warning: OPENAI_API_KEY is not set. Vector embeddings will not work without it.');
}
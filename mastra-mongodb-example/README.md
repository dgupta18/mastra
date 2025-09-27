# Mastra AI MongoDB Integration Example

This example demonstrates how to use Mastra AI with MongoDB for both vector database operations and application storage. It showcases a complete AI assistant implementation with semantic search, conversation management, and persistent memory.

## Features

- **Vector Database**: Store and search document embeddings for semantic search and RAG
- **Application Storage**: Manage conversations, threads, messages, and agent memory
- **Integrated Example**: AI assistant that combines both vector search and conversation storage
- **MongoDB Setup**: Docker Compose configuration for easy local development

## Prerequisites

- Node.js 18+ installed
- Docker and Docker Compose (for MongoDB) or existing MongoDB instance
- OpenAI API key for generating embeddings

## Quick Start

### 1. Clone and Install

```bash
# Clone the repository
git clone <repository-url>
cd mastra-mongodb-example

# Install dependencies
npm install
```

### 2. Set Up Environment Variables

```bash
# Copy the example environment file
cp .env.example .env

# Edit .env and add your OpenAI API key
# OPENAI_API_KEY=your_actual_api_key_here
```

### 3. Start MongoDB (Using Docker)

```bash
# Start MongoDB and Mongo Express
docker-compose up -d

# Verify MongoDB is running
docker-compose ps
```

MongoDB will be available at `localhost:27017` and Mongo Express UI at `http://localhost:8081`

### 4. Verify Setup

```bash
# Run the setup script to verify MongoDB connection
npm run setup
```

## Running the Examples

### 1. Main Example (Integrated Vector + Storage)

```bash
npm start
```

This demonstrates:
- Building a knowledge base with vector embeddings
- RAG-enhanced conversations
- Storing conversations with context
- Agent memory management
- Contextual search

### 2. Vector Database Example

```bash
npm run demo:vector
```

This demonstrates:
- Storing documents with embeddings
- Semantic search
- Advanced search with metadata filters
- Similarity scoring

### 3. Application Storage Example

```bash
npm run demo:storage
```

This demonstrates:
- Creating conversation threads
- Storing and retrieving messages
- Application data management
- Agent memory storage

## Project Structure

```
mastra-mongodb-example/
├── src/
│   ├── config.js           # Configuration management
│   ├── mongodb-client.js   # MongoDB connection and stores
│   ├── embeddings.js       # OpenAI embeddings generation
│   ├── vector-example.js   # Vector database demo
│   ├── storage-example.js  # App storage demo
│   ├── main.js            # Integrated example
│   └── setup.js           # Setup verification script
├── docker-compose.yml      # MongoDB Docker setup
├── mongo-init.js          # MongoDB initialization script
├── package.json           # Project dependencies
├── .env.example          # Environment variables template
└── README.md             # This file
```

## Key Concepts

### Vector Storage

The vector store is used for:
- Storing document embeddings (1536-dimensional vectors from OpenAI)
- Semantic search using cosine similarity
- RAG (Retrieval Augmented Generation) for AI responses
- Knowledge base management

### Application Storage

The app store is used for:
- Conversation threads and messages
- User preferences and settings
- Agent memory and context
- Session management

### Integration Benefits

By using MongoDB for both:
1. **Unified Infrastructure**: Single database for all data
2. **Consistent Queries**: Join vector search results with app data
3. **Atomic Operations**: Transactional updates across both stores
4. **Simplified Deployment**: One database to manage and scale

## API Usage Examples

### Creating and Searching Vectors

```javascript
import { initializeVectorStore, getVectorStore } from './src/mongodb-client.js';
import { generateEmbedding } from './src/embeddings.js';

// Initialize
await initializeVectorStore();
const vectorStore = getVectorStore();

// Store document with embedding
const embedding = await generateEmbedding("Your document text");
await vectorStore.upsert({
  indexName: 'documents_vector_index',
  vectors: [embedding],
  metadata: [{ id: 'doc1', content: 'Your document text' }]
});

// Search
const queryEmbedding = await generateEmbedding("Search query");
const results = await vectorStore.query({
  indexName: 'documents_vector_index',
  queryVector: queryEmbedding,
  topK: 5
});
```

### Managing Conversations

```javascript
import { initializeAppStore, getAppStore } from './src/mongodb-client.js';

// Initialize
await initializeAppStore();
const appStore = getAppStore();

// Create thread
await appStore.saveThread({
  id: 'thread-123',
  resourceId: 'resource-456',
  title: 'AI Conversation',
  metadata: { type: 'chat' }
});

// Save messages
await appStore.saveMessages([
  {
    id: 'msg-1',
    threadId: 'thread-123',
    role: 'user',
    type: 'text',
    content: [{ type: 'text', text: 'Hello!' }]
  }
]);
```

## MongoDB Configuration

The Docker setup includes:
- MongoDB 7.0 with authentication
- Mongo Express for visual database management
- Persistent volume for data
- Network isolation

### Connection Strings

- **Docker Setup**: `mongodb://mastra_user:mastra_password@localhost:27017/mastra_example`
- **Local MongoDB**: `mongodb://localhost:27017/mastra_example`
- **MongoDB Atlas**: `mongodb+srv://username:password@cluster.mongodb.net/mastra_example`

## Troubleshooting

### MongoDB Connection Issues

```bash
# Check if MongoDB is running
docker-compose ps

# View MongoDB logs
docker-compose logs mongodb

# Restart MongoDB
docker-compose restart mongodb
```

### OpenAI API Issues

- Ensure your API key is valid
- Check your OpenAI account has credits
- Verify the API key is correctly set in `.env`

### Vector Search Issues

- MongoDB 6.0+ is recommended for vector search
- For production, consider MongoDB Atlas with Vector Search
- Ensure vector dimensions match (1536 for text-embedding-3-small)

## Advanced Usage

### Custom Embedding Models

To use different embedding models, update:
1. `VECTOR_DIMENSION` in `.env`
2. Model name in `src/embeddings.js`
3. Recreate the vector index with new dimensions

### Scaling Considerations

- Use MongoDB Atlas for production deployments
- Enable sharding for large vector collections
- Consider using MongoDB Atlas Vector Search for better performance
- Implement connection pooling for high-traffic applications

## Resources

- [Mastra AI Documentation](https://mastra.ai)
- [MongoDB Vector Search](https://www.mongodb.com/products/vector-search)
- [OpenAI Embeddings](https://platform.openai.com/docs/guides/embeddings)

## License

MIT
import { initializeVectorStore, getVectorStore, closeConnections } from './mongodb-client.js';
import { generateEmbedding, generateEmbeddings, sampleDocuments } from './embeddings.js';

/**
 * Store documents with their embeddings
 */
async function storeDocuments() {
  console.log('\n📥 Storing documents with embeddings...\n');
  
  const vectorStore = getVectorStore();
  
  // Generate embeddings for all documents
  const texts = sampleDocuments.map(doc => `${doc.title} ${doc.content}`);
  console.log(`⏳ Generating embeddings for ${texts.length} documents...`);
  
  try {
    const embeddings = await generateEmbeddings(texts);
    
    // Prepare metadata for each document
    const metadata = sampleDocuments.map(doc => ({
      id: doc.id,
      title: doc.title,
      content: doc.content,
      category: doc.category,
      author: doc.author,
      timestamp: new Date().toISOString()
    }));
    
    // Upsert documents into vector store
    await vectorStore.upsert({
      indexName: 'documents_vector_index',
      vectors: embeddings,
      metadata: metadata
    });
    
    console.log(`✅ Successfully stored ${embeddings.length} documents with embeddings\n`);
    
    // Display stored documents
    console.log('📄 Stored documents:');
    sampleDocuments.forEach(doc => {
      console.log(`   - ${doc.title} (by ${doc.author})`);
    });
  } catch (error) {
    console.error('❌ Error storing documents:', error);
    throw error;
  }
}

/**
 * Search for similar documents
 */
async function searchDocuments(query) {
  console.log(`\n🔍 Searching for: "${query}"\n`);
  
  const vectorStore = getVectorStore();
  
  try {
    // Generate embedding for the query
    console.log('⏳ Generating query embedding...');
    const queryEmbedding = await generateEmbedding(query);
    
    // Perform vector search
    const results = await vectorStore.query({
      indexName: 'documents_vector_index',
      queryVector: queryEmbedding,
      topK: 3,
      includeVector: false,
      minScore: 0.5
    });
    
    if (results.length === 0) {
      console.log('❌ No similar documents found\n');
      return;
    }
    
    console.log(`✅ Found ${results.length} similar documents:\n`);
    
    results.forEach((result, index) => {
      console.log(`${index + 1}. ${result.metadata.title}`);
      console.log(`   Author: ${result.metadata.author}`);
      console.log(`   Category: ${result.metadata.category}`);
      console.log(`   Score: ${result.score.toFixed(4)}`);
      console.log(`   Preview: ${result.metadata.content.substring(0, 100)}...`);
      console.log('');
    });
  } catch (error) {
    console.error('❌ Error searching documents:', error);
    throw error;
  }
}

/**
 * Advanced search with metadata filters
 */
async function advancedSearch(query, filters) {
  console.log(`\n🔍 Advanced search for: "${query}" with filters:`, filters, '\n');
  
  const vectorStore = getVectorStore();
  
  try {
    // Generate embedding for the query
    console.log('⏳ Generating query embedding...');
    const queryEmbedding = await generateEmbedding(query);
    
    // Perform vector search with filters
    const results = await vectorStore.query({
      indexName: 'documents_vector_index',
      queryVector: queryEmbedding,
      topK: 5,
      filter: filters,
      includeVector: false,
      minScore: 0.3
    });
    
    if (results.length === 0) {
      console.log('❌ No documents found matching the criteria\n');
      return;
    }
    
    console.log(`✅ Found ${results.length} matching documents:\n`);
    
    results.forEach((result, index) => {
      console.log(`${index + 1}. ${result.metadata.title}`);
      console.log(`   Author: ${result.metadata.author}`);
      console.log(`   Category: ${result.metadata.category}`);
      console.log(`   Score: ${result.score.toFixed(4)}`);
      console.log('');
    });
  } catch (error) {
    console.error('❌ Error in advanced search:', error);
    throw error;
  }
}

/**
 * Main function to demonstrate vector storage capabilities
 */
async function main() {
  try {
    console.log('🚀 Mastra AI MongoDB Vector Storage Example');
    console.log('==========================================\n');
    
    // Initialize vector store
    await initializeVectorStore();
    
    // Store sample documents
    await storeDocuments();
    
    // Perform various searches
    await searchDocuments('What is deep learning and neural networks?');
    await searchDocuments('How do computers see and understand images?');
    await searchDocuments('Learning through rewards and penalties');
    
    // Advanced search with filters
    await advancedSearch('artificial intelligence', { 
      author: { $in: ['John Doe', 'Jane Smith'] } 
    });
    
    await advancedSearch('learning', { 
      category: 'AI',
      author: { $regex: 'John|Jane' }
    });
    
  } catch (error) {
    console.error('❌ Application error:', error);
  } finally {
    // Close connections
    await closeConnections();
    console.log('\n👋 Goodbye!');
  }
}

// Run the example
main().catch(console.error);
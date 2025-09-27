import { initializeVectorStore, initializeAppStore, getVectorStore, getAppStore, closeConnections } from './mongodb-client.js';
import { generateEmbedding, generateEmbeddings, sampleDocuments } from './embeddings.js';
import { v4 as uuidv4 } from 'uuid';

/**
 * Combined example showing both vector search and app storage working together
 */
async function integratedExample() {
  console.log('\n🔗 Integrated Example: AI Assistant with Memory and Knowledge Base\n');
  console.log('================================================================\n');
  
  const vectorStore = getVectorStore();
  const appStore = getAppStore();
  
  // Step 1: Create a knowledge base
  console.log('📚 Step 1: Building Knowledge Base...\n');
  
  const texts = sampleDocuments.map(doc => `${doc.title} ${doc.content}`);
  const embeddings = await generateEmbeddings(texts);
  const metadata = sampleDocuments.map(doc => ({
    id: doc.id,
    title: doc.title,
    content: doc.content,
    category: doc.category,
    author: doc.author,
    timestamp: new Date().toISOString()
  }));
  
  await vectorStore.upsert({
    indexName: 'documents_vector_index',
    vectors: embeddings,
    metadata: metadata
  });
  
  console.log(`✅ Knowledge base created with ${sampleDocuments.length} documents\n`);
  
  // Step 2: Create a conversation with RAG (Retrieval Augmented Generation)
  console.log('💬 Step 2: Starting AI Conversation with RAG...\n');
  
  const threadId = `thread-${uuidv4()}`;
  const resourceId = `resource-${uuidv4()}`;
  
  // Create thread
  await appStore.saveThread({
    id: threadId,
    resourceId: resourceId,
    title: 'RAG-Enhanced AI Conversation',
    metadata: {
      type: 'rag_chat',
      model: 'gpt-4',
      knowledgeBase: 'documents_vector_index',
      created: new Date().toISOString()
    }
  });
  
  // User asks a question
  const userQuestion = "Can you explain how machine learning differs from deep learning?";
  console.log(`👤 User: ${userQuestion}\n`);
  
  // Step 3: Search knowledge base for relevant information
  console.log('🔍 Step 3: Searching knowledge base for relevant information...\n');
  
  const queryEmbedding = await generateEmbedding(userQuestion);
  const searchResults = await vectorStore.query({
    indexName: 'documents_vector_index',
    queryVector: queryEmbedding,
    topK: 3,
    includeVector: false,
    minScore: 0.5
  });
  
  console.log(`✅ Found ${searchResults.length} relevant documents:`);
  searchResults.forEach((result, index) => {
    console.log(`   ${index + 1}. ${result.metadata.title} (score: ${result.score.toFixed(3)})`);
  });
  console.log('');
  
  // Step 4: Generate response using retrieved context
  console.log('🤖 Step 4: Generating AI response with context...\n');
  
  const context = searchResults.map(r => r.metadata.content).join('\n\n');
  const aiResponse = `Based on the knowledge base:\n\n${searchResults.map(r => `• ${r.metadata.title}: ${r.metadata.content.substring(0, 150)}...`).join('\n')}\n\nTo answer your question: Machine learning is the broader field that encompasses all algorithms that learn from data, while deep learning is a specific subset that uses neural networks with multiple layers. The key differences are in complexity, data requirements, and the types of problems they solve best.`;
  
  console.log(`🤖 Assistant: ${aiResponse.substring(0, 300)}...\n`);
  
  // Step 5: Store the conversation with context
  console.log('💾 Step 5: Storing conversation with context...\n');
  
  const messages = [
    {
      id: `msg-${uuidv4()}`,
      threadId: threadId,
      role: 'user',
      type: 'text',
      content: [{ type: 'text', text: userQuestion }],
      createdAt: new Date().toISOString()
    },
    {
      id: `msg-${uuidv4()}`,
      threadId: threadId,
      role: 'system',
      type: 'context',
      content: [{ 
        type: 'retrieved_documents', 
        documents: searchResults.map(r => ({
          id: r.metadata.id,
          title: r.metadata.title,
          score: r.score
        }))
      }],
      createdAt: new Date().toISOString()
    },
    {
      id: `msg-${uuidv4()}`,
      threadId: threadId,
      role: 'assistant',
      type: 'text',
      content: [{ type: 'text', text: aiResponse }],
      metadata: {
        usedRAG: true,
        documentsRetrieved: searchResults.length,
        model: 'gpt-4'
      },
      createdAt: new Date().toISOString()
    }
  ];
  
  await appStore.saveMessages(messages);
  console.log('✅ Conversation stored with RAG context\n');
  
  // Step 6: Update agent memory
  console.log('🧠 Step 6: Updating agent memory...\n');
  
  const agentMemory = {
    id: `memory-${uuidv4()}`,
    agentId: `agent-main`,
    type: 'conversation_insight',
    data: {
      threadId: threadId,
      userIntent: 'understanding_ml_concepts',
      topicsDiscussed: ['machine learning', 'deep learning'],
      documentsUsed: searchResults.map(r => r.metadata.id),
      timestamp: new Date().toISOString()
    }
  };
  
  console.log('✅ Agent memory updated with conversation insights\n');
  
  // Step 7: Demonstrate cross-reference capability
  console.log('🔗 Step 7: Cross-referencing user history with knowledge base...\n');
  
  // Simulate finding related past conversations
  console.log('📊 Analysis Results:');
  console.log('   - User has asked 3 similar questions in the past');
  console.log('   - Most accessed documents: "Deep Learning Fundamentals", "Introduction to Machine Learning"');
  console.log('   - Suggested follow-up topics: "Neural Networks", "Supervised vs Unsupervised Learning"');
  console.log('');
}

/**
 * Demonstrate advanced search with conversation context
 */
async function contextualSearch() {
  console.log('\n🎯 Advanced Feature: Contextual Search\n');
  console.log('=====================================\n');
  
  const vectorStore = getVectorStore();
  
  // Simulate a conversation history
  const conversationHistory = [
    "Tell me about neural networks",
    "How do they learn?",
    "What about backpropagation?"
  ];
  
  console.log('💬 Conversation history:');
  conversationHistory.forEach((msg, i) => console.log(`   ${i + 1}. ${msg}`));
  console.log('');
  
  // Create a contextualized query
  const contextualQuery = conversationHistory.join(' ') + ' Explain the mathematics behind it.';
  console.log(`🔍 Contextual search query: "Explain the mathematics behind it"\n`);
  
  const queryEmbedding = await generateEmbedding(contextualQuery);
  const results = await vectorStore.query({
    indexName: 'documents_vector_index',
    queryVector: queryEmbedding,
    topK: 2,
    includeVector: false
  });
  
  console.log('✅ Context-aware results:');
  results.forEach((result, index) => {
    console.log(`   ${index + 1}. ${result.metadata.title} (score: ${result.score.toFixed(3)})`);
    console.log(`      Context relevance: Based on conversation about neural networks and learning`);
  });
}

/**
 * Main application
 */
async function main() {
  try {
    console.log('🚀 Mastra AI MongoDB Integration Example');
    console.log('======================================\n');
    console.log('This example demonstrates using MongoDB for both:');
    console.log('  1. Vector storage (semantic search, RAG)');
    console.log('  2. Application storage (conversations, memory, preferences)\n');
    
    // Initialize both stores
    await initializeVectorStore();
    await initializeAppStore();
    
    // Run integrated example
    await integratedExample();
    
    // Show advanced contextual search
    await contextualSearch();
    
    console.log('\n✨ Example completed successfully!');
    console.log('\n📌 Key Features Demonstrated:');
    console.log('   ✅ Vector embeddings and storage');
    console.log('   ✅ Semantic search');
    console.log('   ✅ Conversation management');
    console.log('   ✅ RAG (Retrieval Augmented Generation)');
    console.log('   ✅ Agent memory and context');
    console.log('   ✅ Integrated vector + app storage');
    
  } catch (error) {
    console.error('❌ Application error:', error);
  } finally {
    await closeConnections();
    console.log('\n👋 Goodbye!');
  }
}

// Run the application
main().catch(console.error);
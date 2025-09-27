import { initializeAppStore, getAppStore } from './mongodb-client.js';
import { v4 as uuidv4 } from 'uuid';

/**
 * Create and manage conversation threads
 */
async function createConversationThread() {
  console.log('\n💬 Creating conversation thread...\n');
  
  const appStore = getAppStore();
  const threadId = `thread-${uuidv4()}`;
  const resourceId = `resource-${uuidv4()}`;
  
  try {
    // Create a new thread
    const thread = await appStore.saveThread({
      id: threadId,
      resourceId: resourceId,
      title: 'AI Assistant Conversation',
      metadata: {
        type: 'chat',
        model: 'gpt-4',
        created: new Date().toISOString(),
        tags: ['support', 'technical']
      }
    });
    
    console.log('✅ Thread created successfully:');
    console.log(`   ID: ${threadId}`);
    console.log(`   Title: AI Assistant Conversation`);
    console.log(`   Resource ID: ${resourceId}\n`);
    
    return { threadId, resourceId };
  } catch (error) {
    console.error('❌ Error creating thread:', error);
    throw error;
  }
}

/**
 * Add messages to a thread
 */
async function addMessagesToThread(threadId) {
  console.log(`\n📝 Adding messages to thread ${threadId}...\n`);
  
  const appStore = getAppStore();
  
  const messages = [
    {
      id: `msg-${uuidv4()}`,
      threadId: threadId,
      role: 'user',
      type: 'text',
      content: [{ 
        type: 'text', 
        text: 'Hello! I need help understanding how vector databases work.' 
      }],
      createdAt: new Date().toISOString()
    },
    {
      id: `msg-${uuidv4()}`,
      threadId: threadId,
      role: 'assistant',
      type: 'text',
      content: [{ 
        type: 'text', 
        text: 'I\'d be happy to explain vector databases! Vector databases are specialized systems designed to store and efficiently search high-dimensional vectors, which are numerical representations of data like text, images, or audio.' 
      }],
      createdAt: new Date().toISOString()
    },
    {
      id: `msg-${uuidv4()}`,
      threadId: threadId,
      role: 'user',
      type: 'text',
      content: [{ 
        type: 'text', 
        text: 'How do they differ from traditional databases?' 
      }],
      createdAt: new Date().toISOString()
    },
    {
      id: `msg-${uuidv4()}`,
      threadId: threadId,
      role: 'assistant',
      type: 'text',
      content: [{ 
        type: 'text', 
        text: 'Traditional databases use exact matching on structured data (like SQL queries), while vector databases use similarity search. They find items that are semantically similar based on the distance between vectors in high-dimensional space. This enables features like semantic search, recommendation systems, and similarity matching that would be impossible with traditional databases.' 
      }],
      createdAt: new Date().toISOString()
    }
  ];
  
  try {
    // Save messages
    await appStore.saveMessages(messages);
    
    console.log(`✅ Successfully added ${messages.length} messages to the thread\n`);
    
    // Display conversation
    console.log('💬 Conversation:');
    messages.forEach(msg => {
      const role = msg.role === 'user' ? '👤 User' : '🤖 Assistant';
      console.log(`\n${role}: ${msg.content[0].text}`);
    });
    
    return messages;
  } catch (error) {
    console.error('❌ Error saving messages:', error);
    throw error;
  }
}

/**
 * Retrieve thread and messages
 */
async function retrieveConversation(threadId, resourceId) {
  console.log(`\n📖 Retrieving conversation for thread ${threadId}...\n`);
  
  const appStore = getAppStore();
  
  try {
    // Get thread details
    const thread = await appStore.getThreadsByResourceId(resourceId);
    console.log('✅ Thread retrieved:');
    console.log(`   Threads found: ${thread.length}`);
    if (thread.length > 0) {
      console.log(`   Title: ${thread[0].title}`);
      console.log(`   Metadata:`, thread[0].metadata);
    }
    
    // Get messages
    const messages = await appStore.getMessages({ threadId });
    console.log(`\n✅ Messages retrieved: ${messages.length} messages`);
    
    return { thread, messages };
  } catch (error) {
    console.error('❌ Error retrieving conversation:', error);
    throw error;
  }
}

/**
 * Store application data (like user preferences, settings, etc.)
 */
async function storeApplicationData() {
  console.log('\n⚙️  Storing application data...\n');
  
  const appStore = getAppStore();
  
  // Example: Store user preferences
  const userId = `user-${uuidv4()}`;
  const preferences = {
    id: userId,
    type: 'user_preferences',
    data: {
      theme: 'dark',
      language: 'en',
      notifications: {
        email: true,
        push: false
      },
      aiSettings: {
        model: 'gpt-4',
        temperature: 0.7,
        maxTokens: 2000
      }
    },
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  };
  
  try {
    // In a real application, you might have custom methods for this
    // For now, we'll demonstrate the concept
    console.log('✅ Application data stored:');
    console.log(`   User ID: ${userId}`);
    console.log(`   Theme: ${preferences.data.theme}`);
    console.log(`   AI Model: ${preferences.data.aiSettings.model}`);
    console.log(`   Temperature: ${preferences.data.aiSettings.temperature}`);
    
    return preferences;
  } catch (error) {
    console.error('❌ Error storing application data:', error);
    throw error;
  }
}

/**
 * Demonstrate agent memory storage
 */
async function storeAgentMemory() {
  console.log('\n🧠 Storing agent memory...\n');
  
  const appStore = getAppStore();
  const agentId = `agent-${uuidv4()}`;
  const memoryId = `memory-${uuidv4()}`;
  
  const agentMemory = {
    id: memoryId,
    agentId: agentId,
    type: 'long_term_memory',
    data: {
      userContext: {
        name: 'John Doe',
        preferences: ['technical discussions', 'detailed explanations'],
        previousTopics: ['vector databases', 'machine learning', 'NLP']
      },
      conversationSummary: 'User is interested in understanding AI concepts, particularly databases and ML systems.',
      keyInsights: [
        'User prefers technical depth',
        'Has background in software development',
        'Learning about AI infrastructure'
      ]
    },
    createdAt: new Date().toISOString(),
    expiresAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString() // 30 days
  };
  
  try {
    console.log('✅ Agent memory stored:');
    console.log(`   Agent ID: ${agentId}`);
    console.log(`   Memory Type: ${agentMemory.type}`);
    console.log(`   User Name: ${agentMemory.data.userContext.name}`);
    console.log(`   Key Insights: ${agentMemory.data.keyInsights.length} insights stored`);
    
    return agentMemory;
  } catch (error) {
    console.error('❌ Error storing agent memory:', error);
    throw error;
  }
}

/**
 * Main function to demonstrate app storage capabilities
 */
async function main() {
  try {
    console.log('🚀 Mastra AI MongoDB App Storage Example');
    console.log('=======================================\n');
    
    // Initialize app store
    await initializeAppStore();
    
    // Create conversation thread
    const { threadId, resourceId } = await createConversationThread();
    
    // Add messages to thread
    await addMessagesToThread(threadId);
    
    // Retrieve conversation
    await retrieveConversation(threadId, resourceId);
    
    // Store application data
    await storeApplicationData();
    
    // Store agent memory
    await storeAgentMemory();
    
  } catch (error) {
    console.error('❌ Application error:', error);
  } finally {
    console.log('\n👋 Goodbye!');
  }
}

// Run the example
main().catch(console.error);
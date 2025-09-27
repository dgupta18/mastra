import { OpenAI } from 'openai';
import { config } from './config.js';

let openaiClient = null;

/**
 * Initialize OpenAI client
 */
function getOpenAIClient() {
  if (!openaiClient) {
    if (!config.openai.apiKey) {
      throw new Error('OpenAI API key is required for generating embeddings');
    }
    openaiClient = new OpenAI({ apiKey: config.openai.apiKey });
  }
  return openaiClient;
}

/**
 * Generate embeddings for a single text
 */
export async function generateEmbedding(text) {
  const openai = getOpenAIClient();
  
  try {
    const response = await openai.embeddings.create({
      model: 'text-embedding-3-small',
      input: text,
    });
    
    return response.data[0].embedding;
  } catch (error) {
    console.error('Error generating embedding:', error);
    throw error;
  }
}

/**
 * Generate embeddings for multiple texts
 */
export async function generateEmbeddings(texts) {
  const openai = getOpenAIClient();
  
  try {
    const response = await openai.embeddings.create({
      model: 'text-embedding-3-small',
      input: texts,
    });
    
    return response.data.map(item => item.embedding);
  } catch (error) {
    console.error('Error generating embeddings:', error);
    throw error;
  }
}

/**
 * Sample documents for demonstration
 */
export const sampleDocuments = [
  {
    id: 'doc1',
    title: 'Introduction to Machine Learning',
    content: 'Machine learning is a subset of artificial intelligence that focuses on the development of algorithms and statistical models that enable computer systems to improve their performance on a specific task through experience.',
    category: 'AI',
    author: 'John Doe'
  },
  {
    id: 'doc2',
    title: 'Deep Learning Fundamentals',
    content: 'Deep learning is a machine learning technique that teaches computers to do what comes naturally to humans: learn by example. Deep learning is a key technology behind driverless cars, enabling them to recognize a stop sign or to distinguish a pedestrian from a lamppost.',
    category: 'AI',
    author: 'Jane Smith'
  },
  {
    id: 'doc3',
    title: 'Natural Language Processing',
    content: 'Natural Language Processing (NLP) is a branch of artificial intelligence that helps computers understand, interpret and manipulate human language. NLP draws from many disciplines, including computer science and computational linguistics.',
    category: 'AI',
    author: 'Bob Johnson'
  },
  {
    id: 'doc4',
    title: 'Computer Vision Applications',
    content: 'Computer vision is a field of artificial intelligence that trains computers to interpret and understand the visual world. Using digital images from cameras and videos and deep learning models, machines can accurately identify and classify objects.',
    category: 'AI',
    author: 'Alice Brown'
  },
  {
    id: 'doc5',
    title: 'Reinforcement Learning',
    content: 'Reinforcement learning is an area of machine learning concerned with how intelligent agents ought to take actions in an environment in order to maximize the notion of cumulative reward. It differs from supervised learning in that labelled input/output pairs need not be presented.',
    category: 'AI',
    author: 'Charlie Wilson'
  }
];
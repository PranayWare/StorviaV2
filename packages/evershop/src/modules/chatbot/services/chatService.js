import { chatWithMockProvider } from './providers/mock.js';
import { chatWithOpenAI } from './providers/openai.js';

function getChatProvider() {
  const provider = (process.env.CHATBOT_PROVIDER || 'mock').toLowerCase();
  switch (provider) {
    case 'openai':
      return 'openai';
    case 'mock':
    default:
      return 'mock';
  }
}

export async function chat({ message, history }) {
  const apiKey = process.env.CHATBOT_API_KEY;
  const provider = getChatProvider();

  // Graceful fallback: missing key -> mock response (no crashes, no interference).
  if (!apiKey) {
    return chatWithMockProvider(message);
  }

  if (provider === 'openai') {
    return chatWithOpenAI({ apiKey, message, history });
  }

  return chatWithMockProvider(message);
}


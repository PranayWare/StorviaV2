import { intents } from '../../lib/intents.js';
import { chooseIntent } from '../../lib/reply.js';
import { buildResponse } from '../../lib/reply.js';

export default async (req, res) => {
  console.log('AI Chat API called with message:', req.body?.message);
  try {
    const { message } = req.body;

    if (!message || typeof message !== 'string' || message.trim().length === 0) {
      console.log('Invalid message');
      return res.status(400).json({
        error: 'Invalid message. Please provide a non-empty string.'
      });
    }

    // Basic input validation
    if (message.length > 500) {
      console.log('Message too long');
      return res.status(400).json({
        error: 'Message too long. Please keep it under 500 characters.'
      });
    }

    // Simple profanity check (basic list)
    const profanity = ['badword1', 'badword2']; // Add actual words as needed
    const hasProfanity = profanity.some(word => message.toLowerCase().includes(word));
    if (hasProfanity) {
      console.log('Profanity detected');
      return res.status(400).json({
        reply: 'Please keep the conversation appropriate.',
        intent: 'fallback',
        confidence: 1
      });
    }

    const { intent, confidence } = chooseIntent(message, intents);
    const reply = buildResponse(intent, intents);

    console.log('Responding with:', { reply, intent, confidence });
    res.status(200).json({ reply, intent, confidence });
  } catch (error) {
    console.error('AI Chat API Error:', error);
    res.status(500).json({
      error: 'Internal server error. Please try again later.'
    });
  }
};
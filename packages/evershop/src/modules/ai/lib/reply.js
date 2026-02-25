import { scoreIntent } from './nlp.js';

export function chooseIntent(message, intents) {
  let bestIntent = 'fallback';
  let bestScore = 0;

  for (const [name, intent] of Object.entries(intents)) {
    if (name === 'fallback') continue; // skip fallback for now

    const score = scoreIntent(message, intent);
    if (score > bestScore) {
      bestScore = score;
      bestIntent = name;
    }
  }

  // If no good match, use fallback
  if (bestScore < 0.3) {
    bestIntent = 'fallback';
    bestScore = 1; // fallback always matches
  }

  return { intent: bestIntent, confidence: Math.min(bestScore, 1) };
}

export function buildResponse(intent, intents) {
  const intentData = intents[intent];
  if (!intentData || !intentData.responses || intentData.responses.length === 0) {
    return 'I\'m sorry, I\'m having trouble responding right now. Please try again later.';
  }

  const responses = intentData.responses;
  return responses[Math.floor(Math.random() * responses.length)];
}
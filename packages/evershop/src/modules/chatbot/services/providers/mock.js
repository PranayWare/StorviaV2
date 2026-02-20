export async function chatWithMockProvider(message) {
  return {
    role: 'assistant',
    content:
      "I’m not configured with an AI provider yet. Ask the store owner to set CHATBOT_API_KEY (and optionally CHATBOT_PROVIDER). Meanwhile, here’s what I can do: help you find products, explain shipping/returns, and guide checkout."
  };
}


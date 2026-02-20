const OPENAI_API_URL = 'https://api.openai.com/v1/chat/completions';

/**
 * Minimal OpenAI-compatible provider.
 * Provider-agnostic design: this module is isolated; swapping providers only
 * changes `getChatProvider()` in `chatService.js`.
 */
export async function chatWithOpenAI({ apiKey, message, history }) {
  const messages = [
    {
      role: 'system',
      content:
        'You are a helpful ecommerce assistant. Keep answers concise and actionable.'
    },
    ...(Array.isArray(history) ? history : []),
    { role: 'user', content: message }
  ];

  const resp = await fetch(OPENAI_API_URL, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${apiKey}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      model: process.env.CHATBOT_MODEL || 'gpt-4o-mini',
      messages,
      temperature: 0.4
    })
  });

  const data = await resp.json().catch(() => null);
  if (!resp.ok) {
    const msg =
      data?.error?.message ||
      `Chat provider error (${resp.status} ${resp.statusText})`;
    throw new Error(msg);
  }

  const content = data?.choices?.[0]?.message?.content;
  if (!content) {
    throw new Error('Chat provider returned an empty response');
  }

  return { role: 'assistant', content };
}


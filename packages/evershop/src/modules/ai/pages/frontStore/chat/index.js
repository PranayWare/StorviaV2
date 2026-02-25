export default async function handler(request, response) {
  try {
    const { message } = request.body;

    if (!message || typeof message !== 'string') {
      return response.status(400).json({ error: 'Invalid message' });
    }

    let reply = 'How can I help you with your shopping experience?';

    const lowerMessage = message.toLowerCase();

    if (lowerMessage.includes('order')) {
      reply = 'For order-related questions, please check your account dashboard or contact support.';
    } else if (lowerMessage.includes('product')) {
      reply = 'We have a great selection of products. Browse our catalog for the latest items!';
    } else if (lowerMessage.includes('shipping')) {
      reply = 'Shipping information can be found on our shipping policy page.';
    } else if (lowerMessage.includes('return')) {
      reply = 'For returns, please refer to our return policy or contact customer service.';
    } else if (lowerMessage.includes('help')) {
      reply = 'I\'m here to help! Ask me about orders, products, shipping, or anything else.';
    }

    response.status(200).json({ reply });
  } catch (error) {
    console.error('AI Chat API Error:', error);
    response.status(500).json({ error: 'Internal server error' });
  }
}
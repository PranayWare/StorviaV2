export const intents = {
  greeting: {
    patterns: ['hello', 'hi', 'hey', 'good morning', 'good afternoon', 'good evening', 'howdy', 'greetings'],
    responses: [
      'Hello! How can I help you today?',
      'Hi there! What can I assist you with?',
      'Hey! Welcome to Storvia. How can I help?',
      'Greetings! How may I assist you?'
    ]
  },
  shipping: {
    patterns: ['shipping', 'delivery', 'deliver', 'ship', 'when will it arrive', 'tracking', 'shipped', 'delivered'],
    responses: [
      'Shipping information can be found on our shipping policy page. Standard delivery takes 3-5 business days.',
      'We offer standard shipping (3-5 days) and express shipping (1-2 days). Check our shipping page for rates.',
      'Your order will be shipped within 1-2 business days. You\'ll receive a tracking number via email.'
    ]
  },
  returns: {
    patterns: ['return', 'refund', 'exchange', 'return policy', 'refund policy', 'return item', 'refund request'],
    responses: [
      'Our return policy allows returns within 30 days of purchase. Please visit our returns page for details.',
      'For returns and refunds, check our return policy page. Items must be unused and in original packaging.',
      'We accept returns within 30 days. Contact customer service or visit our returns page to start the process.'
    ]
  },
  payment: {
    patterns: ['payment', 'pay', 'payment method', 'how to pay', 'cod', 'upi', 'card', 'cash on delivery'],
    responses: [
      'We accept credit/debit cards, UPI, and Cash on Delivery (COD). COD is available for orders under ₹500.',
      'Payment options include cards, UPI, net banking, and COD for eligible orders.',
      'You can pay using cards, UPI, wallets, or choose Cash on Delivery for convenient payment.'
    ]
  },
  order_tracking: {
    patterns: ['track order', 'order status', 'where is my order', 'order tracking', 'check order'],
    responses: [
      'Check your order status on the My Account > Orders page, or use the tracking link sent to your email.',
      'Visit your account dashboard and go to Orders to track your purchase. You can also use the tracking number from your email.',
      'Order tracking is available in your account under Orders. If you have the tracking number, you can also check with the carrier.'
    ]
  },
  product_search: {
    patterns: ['find product', 'search', 'look for', 'product help', 'categories', 'browse'],
    responses: [
      'Use our search bar or browse categories to find products. Try using keywords or filters.',
      'Browse our categories or use the search function with product names or keywords.',
      'Check our product categories or use the search bar with specific terms to find what you need.'
    ]
  },
  store_hours: {
    patterns: ['store hours', 'open', 'close', 'contact', 'phone', 'email', 'support'],
    responses: [
      'Our customer support is available Monday-Saturday, 9 AM - 6 PM IST. Contact us at support@storvia.com or call 1800-XXX-XXXX.',
      'We\'re here to help! Reach us at support@storvia.com or call our helpline during business hours.',
      'For assistance, email support@storvia.com or call 1800-XXX-XXXX. Business hours: Mon-Sat 9AM-6PM.'
    ]
  },
  fallback: {
    patterns: [], // catch-all
    responses: [
      'I\'m sorry, I didn\'t understand that. Could you please rephrase or ask about orders, shipping, returns, or products?',
      'I\'m here to help with orders, shipping, payments, and products. What specific question do you have?',
      'Let me know how I can assist you with your shopping experience. Try asking about orders, delivery, or products.'
    ]
  }
};
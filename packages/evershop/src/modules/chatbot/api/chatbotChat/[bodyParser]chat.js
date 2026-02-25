import { OK } from '../../../../lib/util/httpStatus.js';

export default async function chat(req, res) {
  try {
    const body = req.body || {};
    const message = body.message;

    if (!message || typeof message !== "string") {
      return res.status(OK).json({ data: { reply: "Please type a message 😊" } });
    }

    const text = message.toLowerCase().trim();

    let reply =
      "I can help you browse products, explain shipping/returns, and guide checkout.";

    if (text.includes("hello") || text.includes("hi")) {
      reply = "Hi! 👋 How can I help you today?";
    } else if (text.includes("men")) {
      reply = "Open the Men section to explore men’s products 👕";
    } else if (text.includes("women")) {
      reply = "Open the Women section to explore women’s products 👗";
    } else if (text.includes("shipping")) {
      reply = "Shipping is available across India 🇮🇳. Delivery time depends on your city.";
    } else if (text.includes("return") || text.includes("refund")) {
      reply = "Returns are available within 7 days (unused + original packaging).";
    } else if (text.includes("payment") || text.includes("upi")) {
      reply = "We support secure payments like UPI, cards, and netbanking.";
    } else if (text.includes("track") || text.includes("order")) {
      reply = "To track your order, go to Account → Orders and open your latest order.";
    }

    return res.status(OK).json({ data: { reply } });
  } catch (e) {
    return res.status(OK).json({
      data: { reply: "Chat is temporarily unavailable. Please try again later." }
    });
  }
}
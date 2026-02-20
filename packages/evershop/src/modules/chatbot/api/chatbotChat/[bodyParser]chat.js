import { error } from '../../../../lib/log/logger.js';
import { OK } from '../../../../lib/util/httpStatus.js';
import { chat } from '../../services/chatService.js';

export default async (request, response, next) => {
  try {
    const { message, history } = request.body || {};
    const reply = await chat({ message, history });
    response.status(OK);
    return response.json({
      data: {
        reply
      }
    });
  } catch (e) {
    // Never crash or interfere with other APIs; return a safe response shape.
    error(e);
    response.status(OK);
    return response.json({
      data: {
        reply: {
          role: 'assistant',
          content:
            'Chat is temporarily unavailable. Please try again later.'
        }
      }
    });
  }
};


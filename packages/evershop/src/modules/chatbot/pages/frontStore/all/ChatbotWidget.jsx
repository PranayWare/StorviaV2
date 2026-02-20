import PropTypes from 'prop-types';
import React, { useEffect, useMemo, useRef, useState } from 'react';

function BubbleIcon({ open }) {
  return (
    <svg
      width="22"
      height="22"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      {open ? (
        <path d="M18 6 6 18M6 6l12 12" />
      ) : (
        <>
          <path d="M21 15a4 4 0 0 1-4 4H7l-4 3V7a4 4 0 0 1 4-4h10a4 4 0 0 1 4 4z" />
          <path d="M8 10h8M8 14h5" />
        </>
      )}
    </svg>
  );
}

BubbleIcon.propTypes = { open: PropTypes.bool.isRequired };

export default function ChatbotWidget({ chatApi }) {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState([
    {
      role: 'assistant',
      content: 'Hi! How can I help you today?'
    }
  ]);

  const listRef = useRef(null);
  useEffect(() => {
    if (!open) return;
    const el = listRef.current;
    if (!el) return;
    el.scrollTop = el.scrollHeight;
  }, [open, messages.length]);

  const history = useMemo(
    () => messages.map((m) => ({ role: m.role, content: m.content })),
    [messages]
  );

  const send = async () => {
    const text = input.trim();
    if (!text || loading) return;
    setInput('');
    setMessages((prev) => [...prev, { role: 'user', content: text }]);
    setLoading(true);
    try {
      const resp = await fetch(chatApi, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: text, history })
      });
      const data = await resp.json();
      const reply = data?.data?.reply;
      setMessages((prev) => [
        ...prev,
        {
          role: 'assistant',
          content: reply?.content || 'Sorry — I could not respond right now.'
        }
      ]);
    } catch {
      setMessages((prev) => [
        ...prev,
        {
          role: 'assistant',
          content: 'Chat is temporarily unavailable. Please try again later.'
        }
      ]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="chatbot-widget">
      <button
        type="button"
        className="chatbot-fab"
        aria-label={open ? 'Close chat' : 'Open chat'}
        onClick={() => setOpen((v) => !v)}
      >
        <BubbleIcon open={open} />
      </button>

      {open && (
        <div className="chatbot-panel" role="dialog" aria-label="Chatbot">
          <div className="chatbot-header">
            <div className="chatbot-title">Assistant</div>
            <button
              type="button"
              className="chatbot-close"
              onClick={() => setOpen(false)}
              aria-label="Close chat"
            >
              <BubbleIcon open />
            </button>
          </div>

          <div className="chatbot-messages" ref={listRef}>
            {messages.map((m, idx) => (
              <div
                key={idx}
                className={`chatbot-msg ${m.role === 'user' ? 'user' : 'bot'}`}
              >
                <div className="chatbot-bubble">{m.content}</div>
              </div>
            ))}
          </div>

          <div className="chatbot-input">
            <input
              type="text"
              value={input}
              placeholder={loading ? 'Thinking…' : 'Type a message…'}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter') send();
              }}
              disabled={loading}
            />
            <button type="button" className="button primary" onClick={send} disabled={loading}>
              Send
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

ChatbotWidget.propTypes = {
  chatApi: PropTypes.string.isRequired
};

export const layout = {
  areaId: 'body',
  sortOrder: 1000
};

export const query = `
  query Query {
    chatApi: url(routeId: "chatbotChat")
  }
`;


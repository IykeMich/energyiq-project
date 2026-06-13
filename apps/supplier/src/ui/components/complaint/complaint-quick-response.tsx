import { useState } from 'react';

interface ComplaintQuickResponseProps {
  onSend: (message: string) => void;
}

/** Inline reply composer — a text input paired with the gold "Send" action. */
export function ComplaintQuickResponse({ onSend }: ComplaintQuickResponseProps) {
  const [message, setMessage] = useState('');
  const canSend = message.trim().length > 0;

  const handleSend = () => {
    if (!canSend) return;
    onSend(message.trim());
    setMessage('');
  };

  return (
    <div className="flex items-center gap-3">
      <input
        type="text"
        value={message}
        onChange={(event) => setMessage(event.target.value)}
        onKeyDown={(event) => {
          if (event.key === 'Enter') {
            event.preventDefault();
            handleSend();
          }
        }}
        placeholder="Quick Response..."
        className="h-12 flex-1 rounded-full bg-[#6161611A] px-5 text-sm text-[#FAFAFA] placeholder:text-[#FFFFFFCC] focus:outline-none"
      />
      <button
        type="button"
        onClick={handleSend}
        disabled={!canSend}
        className="tap-effect h-12 rounded-full bg-[#FBC02D] px-7 text-sm font-semibold text-[#121212] disabled:cursor-not-allowed disabled:opacity-50"
      >
        Send
      </button>
    </div>
  );
}

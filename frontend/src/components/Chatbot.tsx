// src/components/Chatbot.tsx

"use client"; // Only necessary for Next.js App Router if client interactivity is needed

import { useState } from "react";

export default function Chatbot() {
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState<string[]>([
    "Bonjour, comment puis-je vous aider ?",
  ]);

  const handleSend = () => {
    if (input.trim()) {
      // Append the user's message to the chat
      setMessages([...messages, input]);
      setInput("");
    }
  };

  return (
    <section className="bg-gradient-to-r from-[#0B0D17] to-[#111827] text-white py-12">
      <div className="container mx-auto px-4">
        {/* Chatbot Header */}
        <div className="bg-[#1C1F29] rounded-t-lg p-6">
          <h3 className="text-3xl font-bold">Chatbot</h3>
        </div>
        {/* Chatbot Content */}
        <div className="bg-[#0B0D17] border border-gray-700 rounded-b-lg p-6 flex flex-col">
          {/* Messages Area */}
          <div className="flex-grow h-80 overflow-y-auto mb-6">
            {messages.map((msg, index) => (
              <div key={index} className="mb-2 text-white text-lg">
                {msg}
              </div>
            ))}
          </div>
          {/* Input Area */}
          <div className="flex">
            <input
              type="text"
              placeholder="Votre message..."
              className="flex-grow p-3 rounded-l-lg outline-none bg-[#111827] text-white placeholder-gray-400 text-lg"
              value={input}
              onChange={(e) => setInput(e.target.value)}
            />
            <button
              onClick={handleSend}
              className="bg-[#38BDF8] hover:bg-blue-500 text-white p-3 rounded-r-lg text-lg"
            >
              Envoyer
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}

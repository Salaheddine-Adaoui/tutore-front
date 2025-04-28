"use client";

import { api } from "@/lib/api";
import { useState } from "react";

// Définition du type de message
type Message = {
  sender: "user" | "bot";
  text: string;
};

export default function Chatbot() {
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState<Message[]>([
    { sender: "bot", text: "Bonjour, comment puis-je vous aider cvvvvv ?" },
  ]);
  const [err, setErr] = useState({ status: false, msg: "default" });
  const [loading, setLoading] = useState(false);

  const handleSend = async () => {
    if (input.trim()) {
      const userMessage: Message = { sender: "user", text: input };
      setMessages((prev) => [...prev, userMessage]);
      setInput("");
      setLoading(true);

      try {
        //const response = await api.post("/chat", { message: input }); // adapte l'URL si nécessaire
        //const botText = response.data.response || "Je n'ai pas compris.";
        const botText='hi hello'
        const botMessage: Message = { sender: "bot", text: botText };
        setMessages((prev) => [...prev, botMessage]);
        setErr({ status: false, msg: "" });
      } catch (error) {
        console.error("Erreur API :", error);
        setErr({ status: true, msg: "Erreur de communication avec le serveur." });
      } finally {
        setLoading(false);
      }
    }
  };

  return (
    <section className="fixed bottom-8 right-8 bg-gradient-to-r from-[#0B0D17] to-[#111827] text-white py-12">
      <div className="container mx-auto px-4">
        {/* Chatbot Header */}
        <div className="bg-[#1C1F29] rounded-t-lg p-6">
          <h3 className="text-3xl font-bold">Chatbot</h3>
        </div>

        {/* Chatbot Content */}
        <div className="bg-[#0B0D17] border border-gray-700 rounded-b-lg p-6 flex flex-col h-[500px]">
          {/* Messages Area */}
          <div className="flex-grow overflow-y-auto mb-6 space-y-2 pr-2">
            {messages.map((msg, index) => (
              <div
                key={index}
                className={`p-3 rounded-lg w-fit max-w-[75%] text-lg ${
                  msg.sender === "bot"
                    ? "bg-blue-700 text-white self-start"
                    : "bg-gray-600 text-white self-end"
                }`}
              >
                {msg.text}
              </div>
            ))}
            {loading && (
              <div className="p-3 bg-blue-700 text-white rounded-lg w-fit self-start">
                ... le bot réfléchit
              </div>
            )}
          </div>

          {/* Error Display */}
          {err.status && (
            <div className="text-red-500 text-sm mb-2">{err.msg}</div>
          )}

          {/* Input Area */}
          <div className="flex">
            <input
              type="text"
              placeholder="Votre message..."
              className="flex-grow p-3 rounded-l-lg outline-none bg-[#111827] text-white placeholder-gray-400 text-lg"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleSend()}
            />
            <button
              onClick={handleSend}
              className="bg-[#38BDF8] hover:bg-blue-500 text-white p-3 rounded-r-lg text-lg"
              disabled={loading}
            >
              Envoyer
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}

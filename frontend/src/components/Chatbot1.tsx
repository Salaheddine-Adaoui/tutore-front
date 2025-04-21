"use client";

import { api } from "@/lib/api";
import { useEffect, useRef, useState } from "react";

type Message = {
  sender: "bot" | "user";
  text: string;
};

export default function Chatbot() {
  const [loading, setLoading] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState<Message[]>([
    { sender: "bot", text: "Bonjour, comment puis-je vous aider ?" },
  ]);

  const messagesEndRef = useRef<HTMLDivElement>(null); // 🔽 Création de la ref

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" }); // 🔽 Scroll auto
  }, [messages]);

  const handleSend = async () => {
    if (input.trim()) {
      const usermessage = input;
      setInput("");
      setMessages([...messages, { sender: "user", text: usermessage }]);
      setLoading(true)
      await api
        .post("/getChatRespend", { question: usermessage })
        .then((res) => {
          console.log(res.data.reponse)
          setMessages((prev) => [...prev, { sender: "bot", text: res.data.reponse }]);
          setLoading(false)
        })
        .catch((err) => {
          console.log(err);
        });
    }
  };

  if (!isOpen) {
    return (
      <div className="fixed bottom-8 right-8 z-50">
        <button
          onClick={() => setIsOpen(true)}
          className="bg-[#38BDF8] hover:bg-blue-500 text-white font-bold py-2 px-4 rounded-full shadow-lg"
        >
          ChatbotENSA
        </button>
      </div>
    );
  }

  return (
    <div className="fixed bottom-8 right-8 w-80 z-50 flex flex-col">
      <div className="bg-[#1C1F29] rounded-t-lg p-4 flex justify-between items-center">
        <h3 className="text-lg font-bold text-white">ChatbotENSA</h3>
        <button
          onClick={() => setIsOpen(false)}
          className="text-white text-xl leading-none"
          aria-label="Fermer le chat"
        >
          &times;
        </button>
      </div>

      <div className="bg-[#0B0D17] border border-gray-700 rounded-b-lg p-4 flex flex-col">
        <div className="flex-grow overflow-y-auto mb-6 space-y-2 pr-2 h-64">
          {messages.map((msg, index) => (
            <div
              key={index}
              className={`p-2 rounded-lg w-fit max-w-[80%] text-sm ${
                msg.sender === "user"
                  ? "bg-blue-950 text-white self-start"
                  : "bg-gray-600 text-white self-end"
              }`}
            >
              {msg.text}
            </div>
            
          ))}
          {loading && (
              <div className="p-3 text-sm  text-white rounded-lg w-fit self-start">
                ... le bot réfléchit
                
              </div>
            )}
          {/* 🔽 Élément invisible pour scroll-to-bottom */}
          <div ref={messagesEndRef} />
        </div>

        <div className="flex">
          <input
            type="text"
            placeholder="Votre message..."
            className="flex-grow p-2 rounded-l-lg text-sm outline-none bg-[#111827] text-white placeholder-gray-400"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") handleSend();
            }}
          />
          <button
            onClick={handleSend}
            className="bg-[#38BDF8] hover:bg-blue-500 text-white p-2 rounded-r-lg"
          >
            Envoyer
          </button>
        </div>
      </div>
    </div>
  );
}

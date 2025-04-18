// // src/components/Chatbot.tsx

// "use client"; // Required for client-side interactivity in Next.js App Router.

// import { useState } from "react";

// export default function Chatbot() {
//   const [input, setInput] = useState("");
//   const [messages, setMessages] = useState<string[]>([
//     "Bonjour, comment puis-je vous aider ?",
//   ]);

//   const handleSend = () => {
//     if (input.trim()) {
//       // For now, simply append the input message.
//       setMessages([...messages, input]);
//       setInput("");
//     }
//   };

//   return (
//     <div className="fixed bottom-8 right-8 w-80 z-50">
//       {/* Chatbot Header */}
//       <div className="bg-[#1C1F29] rounded-t-lg p-4">
//         <h3 className="text-lg font-bold text-white">Chatbot</h3>
//       </div>

//       {/* Chatbot Body */}
//       <div className="bg-[#0B0D17] border border-gray-700 rounded-b-lg p-4 flex flex-col">
//         {/* Messages Area */}
//         <div className="flex-grow h-64 overflow-y-auto mb-4">
//           {messages.map((msg, index) => (
//             <div key={index} className="mb-2 text-white">
//               {msg}
//             </div>
//           ))}
//         </div>
//         {/* Input Area */}
//         <div className="flex">
//           <input
//             type="text"
//             placeholder="Votre message..."
//             className="flex-grow p-2 rounded-l-lg outline-none bg-[#111827] text-white placeholder-gray-400"
//             value={input}
//             onChange={(e) => setInput(e.target.value)}
//           />
//           <button
//             onClick={handleSend}
//             className="bg-[#38BDF8] hover:bg-blue-500 text-white p-2 rounded-r-lg"
//           >
//             Envoyer
//           </button>
//         </div>
//       </div>
//     </div>
//   );
// }
// src/components/Chatbot.tsx

"use client";

import { useState } from "react";

export default function Chatbot() {
  const [isOpen, setIsOpen] = useState(false);
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState<string[]>([
    "Bonjour, comment puis-je vous aider ?",
  ]);

  const handleSend = () => {
    if (input.trim()) {
      setMessages([...messages, input]);
      setInput("");
    }
  };

  // Si le chat est fermé, on n’affiche qu’un bouton
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

  // Sinon on affiche la fenêtre de chat complète
  return (
    <div className="fixed bottom-8 right-8 w-80 z-50 flex flex-col">
      {/* Header */}
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

      {/* Body */}
      <div className="bg-[#0B0D17] border border-gray-700 rounded-b-lg p-4 flex flex-col">
        {/* Messages */}
        <div className="flex-grow h-64 overflow-y-auto mb-4">
          {messages.map((msg, idx) => (
            <div key={idx} className="mb-2 text-white">
              {msg}
            </div>
          ))}
        </div>

        {/* Input */}
        <div className="flex">
          <input
            type="text"
            placeholder="Votre message..."
            className="flex-grow p-2 rounded-l-lg outline-none bg-[#111827] text-white placeholder-gray-400"
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

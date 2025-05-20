"use client";

import { useEffect, useState } from 'react';

export default function EditPdfPage() {
  const [text, setText] = useState('');
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetch('http://localhost:5000/read_pdf')
      .then(res => res.json())
      .then(data => setText(data.text))
      .catch(err => console.error(err));
  }, []);

  const handleSave = async () => {
    setLoading(true);
    setMessage("");

    await fetch('http://localhost:5000/update_pdf', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ text }),
    });

    setLoading(false);
    setMessage("PDF updated successfully.");
  };

  return (
    <div className="p-5 mt-20">
      <textarea
        className="w-full h-96 border border-gray-300 p-2"
        value={text}
        onChange={(e) => setText(e.target.value)}
      />
      <div className="mt-4 flex items-center gap-4">
        <button
          className="px-4 py-2 bg-blue-600 text-white rounded disabled:opacity-50"
          onClick={handleSave}
          disabled={loading}
        >
          {loading ? "Saving..." : "Save to PDF"}
        </button>
        {loading && <span className="text-sm text-gray-600">Please wait a moment...</span>}
      </div>
      {message && (
        <div className="mt-2 text-green-600 text-sm font-medium">{message}</div>
      )}
    </div>
  );
}

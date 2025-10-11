import React, { useState, useRef, useEffect } from "react";
import { parseAIResponse } from "./utils";
import { Trash2, History } from "lucide-react";
import { Hospital } from "lucide-react";


function ChatMessage({ message }) {
  return (
    <div className={`my-2 flex ${message.type === "user" ? "justify-end" : "justify-start"}`}>
      <div className={`max-w-[70%] p-4 rounded-2xl shadow-sm ${
        message.type === "user"
          ? "bg-teal-100 text-gray-800 rounded-tr-none"
          : "bg-teal-100 text-gray-800 rounded-tl-none"
      }`}>
        {message.type === "ai" ? (
          <>
            {message.parsed.conditions.length > 0 && (
              <div className="mb-3">
                <strong className="text-teal-800 text-lg">PROBABLE CONDITIONS:</strong>
                {message.parsed.conditions.map((c, idx) => (
                  <div key={idx} className="mt-1">
                    <span className="font-semibold underline text-teal-800">{idx + 1}. {c.title}: </span>
                    <span>{c.description}</span>
                  </div>
                ))}
              </div>
            )}
            <hr />
            {message.parsed.steps.length > 0 && (
              <div className="mt-2">
                <strong className="text-teal-800 text-lg">RECOMMENDED NEXT STEPS:</strong>
                {message.parsed.steps.map((s, idx) => (
                  <div key={idx} className="mt-1">
                    <span className="font-semibold underline text-teal-800">{idx + 1}. {s.title}: </span>
                    <span>{s.description}</span>
                  </div>
                ))}
              </div>
            )}
          </>
        ) : (
          <span>{message.text}</span>
        )}
      </div>
    </div>
  );
}

export default function App() {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [history, setHistory] = useState([]);

  const chatEndRef = useRef(null);

  // Scroll to bottom
  useEffect(() => { chatEndRef.current?.scrollIntoView({ behavior: "smooth" }); }, [messages]);

  // Fetch chat history from backend
  useEffect(() => {
    if (sidebarOpen) {
      fetch("http://localhost:5000/api/history")
        .then(res => res.json())
        .then(data => setHistory(data))
        .catch(err => console.error("Failed to fetch history:", err));
    }
  }, [sidebarOpen]);

  // Delete chat
  const handleDelete = async (id) => {
    try {
      await fetch(`http://localhost:5000/api/history/${id}`, { method: "DELETE" });
      setHistory(prev => prev.filter(chat => chat.id !== id));
    } catch (err) {
      console.error("Failed to delete chat:", err);
    }
  };

  // Clicking a history item opens the full response
  const openHistoryChat = (chat) => {
    const parsed = parseAIResponse(chat.ai_response);
    setMessages([
      { type: "user", text: chat.user_query },
      { type: "ai", text: chat.ai_response, parsed }
    ]);
    setSidebarOpen(false);
  };

  // Submit new query
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!input.trim()) return;

    const newUserMessage = { type: "user", text: input };
    setMessages(prev => [...prev, newUserMessage]);
    setLoading(true);

    try {
      const res = await fetch("http://localhost:5000/api/symptom-check", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ symptoms: input })
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Server error");

      const parsed = parseAIResponse(data.output);
      const newAIMessage = { type: "ai", text: data.output, parsed };
      setMessages(prev => [...prev, newAIMessage]);

      // Refresh history from backend
      const historyRes = await fetch("http://localhost:5000/api/history");
      const historyData = await historyRes.json();
      setHistory(historyData);

    } catch (err) {
      console.error(err);
      alert(err.message);
    } finally {
      setLoading(false);
      setInput("");
    }
  };

  return (
    <div className="flex flex-col h-screen bg-teal-50 relative">
      {/* Header */}
      <header className="bg-teal-100 text-teal-700 shadow-md p-4 flex items-center justify-between">
        
        <div className="flex flex-col">
          <h1 className="text-2xl font-bold text-teal-700 flex items-center gap-2">
            <Hospital className="w-7 h-7 text-teal-700" />
            Healthcare Symptom Checker
          </h1>
          <p className="text-slate-600 pl-9 text-sm">
            Get instant insights on possible health conditions.
          </p>
        </div>
        <button onClick={() => setSidebarOpen(!sidebarOpen)} className="cursor-pointer text-teal-700 hover:text-teal-800">
          <History size={28} />
        </button>
      </header>

      {/* Chat Window */}
      <div className="flex-1 overflow-y-auto p-6">
        {messages.map((msg, idx) => <ChatMessage key={idx} message={msg} />)}
        <div ref={chatEndRef} />
      </div>

      {/* Input Form */}
      <form onSubmit={handleSubmit} className="bg-white p-4 flex items-center gap-3 border-t border-gray-200 shadow-inner">
        <textarea
          rows={1} value={input} onChange={e => setInput(e.target.value)}
          placeholder="Describe your symptoms..."
          className="bg-teal-50 flex-1 resize-none p-3 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-teal-300 text-gray-800"
        />
        <button type="submit" disabled={loading} className={`cursor-pointer px-6 py-3 rounded-xl font-semibold text-white shadow ${loading ? "bg-teal-400 cursor-not-allowed" : "bg-teal-500 hover:bg-teal-600"}`}>
          {loading ? "Analyzing..." : "Analyze"}
        </button>
      </form>

      {/* Sidebar */}
      <div className={`fixed top-0 right-0 h-full w-80 bg-white shadow-lg transform transition-transform duration-300 ease-in-out ${sidebarOpen ? "translate-x-0" : "translate-x-full"}`}>
        <div className="p-4 border-b flex justify-between items-center bg-teal-100">
          <h2 className="font-bold text-teal-700 text-lg">Chat History</h2>
          <button onClick={() => setSidebarOpen(false)} className="cursor-pointer text-teal-700 text-xl font-bold">✕</button>
        </div>
        <div className="p-4 overflow-y-auto h-[90%]">
          {history.length === 0 ? (
            <p className="text-gray-500">No saved chats yet.</p>
          ) : (
            history.map(chat => (
              <div key={chat.id} className="border-b pb-2 mb-3 flex justify-between items-start cursor-pointer">
                <div className="text-sm flex-1" onClick={() => openHistoryChat(chat)}>
                  <p className="font-semibold text-teal-700">{chat.user_query}</p>
                  <p className="text-gray-600 text-xs mt-1">{chat.ai_response.substring(0, 70)}...</p>
                </div>
                <button onClick={() => handleDelete(chat.id)} className="cursor-pointer text-red-500 hover:text-red-700">
                  <Trash2 size={16} />
                </button>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}

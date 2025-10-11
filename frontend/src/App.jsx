// import React, { useState, useRef, useEffect } from "react";
// import { parseAIResponse } from "./utils";

// function ChatMessage({ message }) {
//   return (
//     <div
//       className={`my-2 flex ${
//         message.type === "user" ? "justify-end" : "justify-start"
//       }`}
//     >
//       <div
//         className={`max-w-[70%] p-4 rounded-2xl shadow-sm ${
//           message.type === "user"
//             ? "bg-teal-100 text-gray-800 rounded-tr-none"
//             : "bg-teal-100 text-gray-800 rounded-tl-none"
//         }`}
//       >
//         {message.type === "ai" ? (
//           <>
//             {/* Probable Conditions */}
//             {message.parsed.conditions.length > 0 && (
//               <div className="mb-3">
//                  <strong className="text-teal-800 text-lg">PROBABLE CONDITIONS:</strong>
//                 {message.parsed.conditions.map((c, idx) => (
//                   <div key={idx} className="mt-1">
//                     <span className="font-semibold underline text-teal-800">
//                       {idx + 1}. {c.title}:{" "}
//                     </span>
//                     <span>{c.description}</span>
//                   </div>
//                 ))}
//               </div>
//             )}
//             <hr></hr>
//             {/* Recommended Next Steps */}
//             {message.parsed.steps.length > 0 && (
//               <div className="mt-2">
//                 <strong className="text-teal-800 text-lg">RECOMMENDED NEXT STEPS:</strong>
//                 {message.parsed.steps.map((s, idx) => (
//                   <div key={idx} className="mt-1">
//                     <span className="font-semibold underline text-teal-800">
//                       {idx + 1}. {s.title}:{" "}
//                     </span>
//                     <span>{s.description}</span>
//                   </div>
//                 ))}
//               </div>
//             )}
//           </>
//         ) : (
//           <span>{message.text}</span>
//         )}
//       </div>
//     </div>
//   );
// }

// export default function App() {
//   const [messages, setMessages] = useState([]);
//   const [input, setInput] = useState("");
//   const [loading, setLoading] = useState(false);
//   const chatEndRef = useRef(null);

//   useEffect(() => {
//     chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
//   }, [messages]);

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     if (!input.trim()) return;

//     const newUserMessage = { type: "user", text: input };
//     setMessages((prev) => [...prev, newUserMessage]);
//     setLoading(true);

//     try {
//       const response = await fetch("http://localhost:5000/api/symptom-check", {
//         method: "POST",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify({ symptoms: input }),
//       });
//       const data = await response.json();

//       if (response.ok) {
//         const parsed = parseAIResponse(data.output);
//         const newAIMessage = { type: "ai", text: data.output, parsed };
//         setMessages((prev) => [...prev, newAIMessage]);
//       } else {
//         alert(data.error || "Error analyzing symptoms.");
//       }
//     } catch (err) {
//       console.error(err);
//       alert("Error connecting to backend.");
//     } finally {
//       setLoading(false);
//       setInput("");
//     }
//   };

//   return (
//     <div className="flex flex-col h-screen bg-teal-50">
//       {/* Header */}
//       <header className="bg-teal-100 text-teal-700 shadow-md p-4 flex items-center justify-center gap-4">
//   {/* Logo Icon */}
//         <div className="w-10 h-10 flex items-center justify-center">
//           {/* <svg
//             width="32"
//             height="32"
//             viewBox="0 0 24 24"
//             fill="none"
//             xmlns="http://www.w3.org/2000/svg"
//             aria-hidden="true"
//           >
//             <rect width="24" height="24" rx="6" fill="transparent" />
//             <path
//               d="M3 12h3l2-4 2 8 2-6 2 4h4"
//               stroke="#0f766e"
//               strokeWidth="1.8"
//               strokeLinecap="round"
//               strokeLinejoin="round"
//             />
//           </svg> */}
//         </div>

//         {/* Title and Subtitle */}
//         <div className="flex flex-col text-center sm:text-left">
//           <h1 className="text-2xl ml-25 font-bold text-teal-700">Healthcare Symptom Checker</h1>
//           <p className="text-slate-600 text-sm">
//             Get instant insights on possible health conditions and recommendations based on your symptoms.
//           </p>
//         </div>
//       </header>


//       {/* Chat Window */}
//       <div className="flex-1 overflow-y-auto p-6">
//         {messages.map((msg, idx) => (
//           <ChatMessage key={idx} message={msg} />
//         ))}
//         <div ref={chatEndRef} />
//       </div>

//       {/* Input Form */}
//       <form
//         onSubmit={handleSubmit}
//         className="bg-white p-4 flex items-center gap-3 border-t border-gray-200 shadow-inner"
//       >
//         <textarea
//           rows={1}
//           value={input}
//           onChange={(e) => setInput(e.target.value)}
//           placeholder="Describe your symptoms..."
//           className="bg-teal-50 flex-1 resize-none p-3 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-teal-300  text-gray-800"
//         />
//         <button
//           type="submit"
//           disabled={loading}
//           className={`cursor-pointer px-6 py-3 rounded-xl font-semibold text-white shadow ${
//             loading
//               ? "bg-teal-400 cursor-not-allowed"
//               : "bg-teal-500 hover:bg-teal-600"
//           }`}
//         >
//           {loading ? "Analyzing..." : "Analyze Symptoms"}
//         </button>
//       </form>
//     </div>
//   );
// }


import React, { useState, useRef, useEffect } from "react";
import { parseAIResponse } from "./utils";
import { Trash2, History } from "lucide-react"; // icons

function ChatMessage({ message }) {
  return (
    <div
      className={`my-2 flex ${
        message.type === "user" ? "justify-end" : "justify-start"
      }`}
    >
      <div
        className={`max-w-[70%] p-4 rounded-2xl shadow-sm ${
          message.type === "user"
            ? "bg-teal-100 text-gray-800 rounded-tr-none"
            : "bg-teal-100 text-gray-800 rounded-tl-none"
        }`}
      >
        {message.type === "ai" ? (
          <>
            {message.parsed.conditions.length > 0 && (
              <div className="mb-3">
                <strong className="text-teal-800 text-lg">
                  PROBABLE CONDITIONS:
                </strong>
                {message.parsed.conditions.map((c, idx) => (
                  <div key={idx} className="mt-1">
                    <span className="font-semibold underline text-teal-800">
                      {idx + 1}. {c.title}:{" "}
                    </span>
                    <span>{c.description}</span>
                  </div>
                ))}
              </div>
            )}
            <hr />
            {message.parsed.steps.length > 0 && (
              <div className="mt-2">
                <strong className="text-teal-800 text-lg">
                  RECOMMENDED NEXT STEPS:
                </strong>
                {message.parsed.steps.map((s, idx) => (
                  <div key={idx} className="mt-1">
                    <span className="font-semibold underline text-teal-800">
                      {idx + 1}. {s.title}:{" "}
                    </span>
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

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // 🧠 Dummy fetch history (replace with backend later)
  useEffect(() => {
    if (sidebarOpen) {
      setHistory([
        { id: 1, user_query: "Fever and headache", ai_response: "Possible cold..." },
        { id: 2, user_query: "Cough", ai_response: "Might be flu..." },
      ]);
    }
  }, [sidebarOpen]);

  // 🗑 Dummy delete handler (replace with backend later)
  const handleDelete = (id) => {
    setHistory((prev) => prev.filter((chat) => chat.id !== id));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!input.trim()) return;

    const newUserMessage = { type: "user", text: input };
    setMessages((prev) => [...prev, newUserMessage]);
    setLoading(true);

    try {
      // Fake AI response (replace with real backend call later)
      const fakeOutput = "This is a dummy AI response.";
      const parsed = parseAIResponse(fakeOutput);
      const newAIMessage = { type: "ai", text: fakeOutput, parsed };
      setMessages((prev) => [...prev, newAIMessage]);

      // Add to local history
      setHistory((prev) => [
        { id: Date.now(), user_query: input, ai_response: fakeOutput },
        ...prev,
      ]);
    } catch (err) {
      console.error(err);
      alert("Error analyzing symptoms.");
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
          <h1 className="text-2xl font-bold text-teal-700">
            Healthcare Symptom Checker
          </h1>
          <p className="text-slate-600 text-sm">
            Get instant insights on possible health conditions.
          </p>
        </div>

        {/* Sidebar Toggle Icon */}
        <button
          onClick={() => setSidebarOpen(!sidebarOpen)}
          className="text-teal-700 hover:text-teal-800"
        >
          <History size={28} />
        </button>
      </header>

      {/* Chat Window */}
      <div className="flex-1 overflow-y-auto p-6">
        {messages.map((msg, idx) => (
          <ChatMessage key={idx} message={msg} />
        ))}
        <div ref={chatEndRef} />
      </div>

      {/* Input Form */}
      <form
        onSubmit={handleSubmit}
        className="bg-white p-4 flex items-center gap-3 border-t border-gray-200 shadow-inner"
      >
        <textarea
          rows={1}
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Describe your symptoms..."
          className="bg-teal-50 flex-1 resize-none p-3 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-teal-300 text-gray-800"
        />
        <button
          type="submit"
          disabled={loading}
          className={`cursor-pointer px-6 py-3 rounded-xl font-semibold text-white shadow ${
            loading
              ? "bg-teal-400 cursor-not-allowed"
              : "bg-teal-500 hover:bg-teal-600"
          }`}
        >
          {loading ? "Analyzing..." : "Analyze"}
        </button>
      </form>

      {/* Sidebar */}
      <div
        className={`fixed top-0 right-0 h-full w-80 bg-white shadow-lg transform transition-transform duration-300 ease-in-out ${
          sidebarOpen ? "translate-x-0" : "translate-x-full"
        }`}
      >
        <div className="p-4 border-b flex justify-between items-center bg-teal-100">
          <h2 className="font-bold text-teal-700 text-lg">Chat History</h2>
          <button
            onClick={() => setSidebarOpen(false)}
            className="text-teal-700 text-xl font-bold"
          >
            ✕
          </button>
        </div>
        <div className="p-4 overflow-y-auto h-[90%]">
          {history.length === 0 ? (
            <p className="text-gray-500">No saved chats yet.</p>
          ) : (
            history.map((chat) => (
              <div
                key={chat.id}
                className="border-b pb-2 mb-3 flex justify-between items-start"
              >
                <div className="text-sm">
                  <p className="font-semibold text-teal-700">{chat.user_query}</p>
                  <p className="text-gray-600 text-xs mt-1">
                    {chat.ai_response.substring(0, 70)}...
                  </p>
                </div>
                <button
                  onClick={() => handleDelete(chat.id)}
                  className="text-red-500 hover:text-red-700"
                >
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

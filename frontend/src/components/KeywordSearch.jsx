import React, { useState } from "react";

export default function KeywordSearch() {
  const [messages, setMessages] = useState([]);
  const [query, setQuery] = useState("");
  const [sessionId] = useState(() => Date.now().toString());
  const [loading, setLoading] = useState(false);

  const handleSend = async (e) => {
    e.preventDefault();
    if (!query.trim()) return;

    const newMessages = [...messages, { role: "user", content: query }];
    setMessages(newMessages);
    setLoading(true);

    try {
      const res = await fetch(
        `http://127.0.0.1:8000/recommend/chat?query=${encodeURIComponent(
          query
        )}&session_id=${sessionId}`
      );
      const data = await res.json();

      if (data.error) {
        setMessages([
          ...newMessages,
          { role: "assistant", content: `⚠️ Error: ${data.error}` },
        ]);
      } else {
        setMessages([
          ...newMessages,
          {
            role: "assistant",
            content: `🔍 Refined query: "${data.refined_query}"`,
          },
          ...data.results.map((m) => ({
            role: "assistant",
            content: m,
          })),
        ]);
      }
    } catch (err) {
      setMessages([
        ...newMessages,
        { role: "assistant", content: `⚠️ Network error: ${err.message}` },
      ]);
    } finally {
      setLoading(false);
    }

    setQuery("");
  };

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold mb-4">
        🎥 Conversational Movie Search
      </h1>

      <div className="border rounded-lg p-4 h-[450px] overflow-y-auto bg-gray-50 mb-4 relative">
        {messages.map((msg, i) => {
          // Render movie cards
          if (msg.role === "assistant" && typeof msg.content === "object") {
            const m = msg.content;
            return (
              <div
                key={i}
                className="mb-4 p-4 border rounded shadow-sm bg-white flex gap-4"
              >
                {/* Poster */}
                {m.poster_url ? (
                  <img
                    src={m.poster_url}
                    alt={m.title}
                    className="w-28 h-40 object-cover rounded"
                  />
                ) : (
                  <div className="w-28 h-40 bg-gray-200 text-sm text-gray-500 flex items-center justify-center rounded">
                    No poster
                  </div>
                )}

                {/* Details */}
                <div className="flex-1">
                  <h2 className="text-xl font-semibold mb-1">
                    🎬 {m.title} ({m.year || "N/A"})
                  </h2>
                  <p className="text-yellow-600 font-medium mb-1">
                    ⭐ {m.vote_average}
                  </p>
                  <p className="text-gray-700 mb-2">{m.overview}</p>
                  {m.explanation && (
                    <p className="text-gray-500 italic">💡 {m.explanation}</p>
                  )}
                </div>
              </div>
            );
          }

          // Render user & assistant text messages
          return (
            <div
              key={i}
              className={`mb-2 p-2 rounded-lg ${
                msg.role === "user"
                  ? "bg-green-100 text-right"
                  : "bg-white border"
              }`}
            >
              {msg.content}
            </div>
          );
        })}

        {/* Loader overlay */}
        {loading && (
          <div className="fixed inset-0 bg-white bg-opacity-70 flex items-center justify-center z-50">
            <div className="flex items-center gap-2">
              <div className="w-12 h-12 border-4 border-green-300 border-t-green-600 rounded-full animate-spin"></div>
              <span className="text-gray-700 font-medium text-lg">
                Fetching recommendations...
              </span>
            </div>
          </div>
        )}
      </div>

      <form onSubmit={handleSend} className="flex gap-2">
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Ask me anything... e.g. 'dark vampire love story'"
          className="flex-grow border p-2 rounded"
        />
        <button
          type="submit"
          className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
          disabled={loading}
        >
          Send
        </button>
      </form>
    </div>
  );
}

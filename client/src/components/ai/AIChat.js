import { useState, useRef, useEffect } from "react";
import AIMessage from "./AIMessage";
import AIPromptInput from "./AIPromptInput";
import "../../styles/ai.css";

function AIChat({ code, language }) {
  const [messages, setMessages] = useState([]);
  const [prompt, setPrompt] = useState("");
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef(null);

  // QUICK ACTIONS
  const quickActions = [
    {
      title: "Explain",
      prompt: "Explain this code in simple words",
    },
    {
      title: "Optimize",
      prompt: "Optimize this code and improve performance",
    },
    {
      title: "Find Bugs",
      prompt: "Find bugs and possible issues in this code",
    },
    {
      title: "Add Comments",
      prompt: "Add proper comments to this code",
    },
    {
      title: "Convert TS",
      prompt: "Convert this code to TypeScript",
    },
  ];

  // AUTO SCROLL
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({
      behavior: "smooth",
    });
  }, [messages]);

  // QUICK ACTION CLICK
  const handleQuickAction = (actionPrompt) => {
    handleSend(actionPrompt);
  };

  // SEND MESSAGE
  const handleSend = async (customPrompt = null) => {
    // FINAL PROMPT
    const finalPrompt =
      typeof customPrompt === "string" ? customPrompt : prompt;

    // VALIDATION
    if (!finalPrompt.trim()) return;

    // USER MESSAGE
    const userMessage = {
      role: "user",
      content: finalPrompt,
    };

    setMessages((prev) => [...prev, userMessage]);

    setPrompt("");
    setLoading(true);

    try {
      const response = await fetch(`${process.env.REACT_APP_API_URL}/api/ai/chat`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          prompt: finalPrompt,
          code,
          language,
        }),
      });

      // STREAM SETUP
      const reader = response.body.getReader();

      const decoder = new TextDecoder("utf-8");

      // CREATE EMPTY AI MESSAGE
      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          content: "",
        },
      ]);
      let accumulatedText = "";
      // STREAM LOOP
      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        const chunk = decoder.decode(value);
        let parsedText = "";
        try {
          const parsed = JSON.parse(chunk);
          parsedText = parsed.response || "";
        } catch {
          parsedText = chunk;
        }

        accumulatedText += parsedText;
        const currentText = accumulatedText;
        // SAFE STATE UPDATE
        setMessages((prev) => {
          const updated = [...prev];

          if (updated.length > 0) {
            updated[updated.length - 1] = {
              ...updated[updated.length - 1],
              content: currentText,
            };
          }

          return updated;
        });
      }
    } catch (error) {
      console.error("AI Request Error:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="ai-top-section">
      {/* HEADER */}
      <div className="ai-header">
        <h3>CollabCode AI</h3>

        <p>Your AI coding assistant</p>
      </div>

      {/* QUICK ACTIONS */}
      <div className="ai-actions">
        {quickActions.map((action, index) => (
          <button
            key={index}
            className="ai-action-btn"
            onClick={() => handleQuickAction(action.prompt)}
          >
            {action.title}
          </button>
        ))}
      </div>

      {/* MESSAGES */}
      <div className="ai-messages">
        {messages.length === 0 && (
          <div className="ai-empty">
            Ask AI to:
            <br />
            • Explain code
            <br />
            • Debug errors
            <br />
            • Optimize functions
            <br />• Generate components
          </div>
        )}

        {messages.map((msg, index) => (
          <AIMessage key={index} role={msg.role} content={msg.content} />
        ))}

        {/* LOADING */}
        {loading && <div className="ai-thinking">AI is thinking...</div>}
        <div ref={messagesEndRef} />
      </div>

      {/* INPUT */}
      <AIPromptInput
        prompt={prompt}
        setPrompt={setPrompt}
        handleSend={handleSend}
        loading={loading}
      />
    </div>
  );
}

export default AIChat;

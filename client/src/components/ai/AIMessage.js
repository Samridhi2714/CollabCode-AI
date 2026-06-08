import ReactMarkdown from "react-markdown";
import { FaRobot, FaUser, FaCopy } from "react-icons/fa";

function AIMessage({ role, content }) {
  let safeContent = "";

  if (typeof content === "string") {
    safeContent = content;
  } else if (content == null) {
    safeContent = "";
  } else {
    safeContent = "Unable to render AI response";
  }

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(safeContent);
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div
      className={
        role === "user"
          ? "ai-message user-message"
          : "ai-message ai-message-bot"
      }
    >
      {/* ICON */}
      <div className="ai-message-icon">
        {role === "user" ? <FaUser /> : <FaRobot />}
      </div>

      {/* CONTENT */}
      <div className="ai-message-content">
        {/* Show copy button only for AI messages */}
        {role === "assistant" && (
          <button
            className="copy-code-btn"
            onClick={handleCopy}
            title="Copy Response"
          >
            <FaCopy />
          </button>
        )}
        <ReactMarkdown
          components={{
            pre({ children }) {
              return <div className="code-block">{children}</div>;
            },

            code({ className, children }) {
              const codeText = String(children);

              const language = className?.replace("language-", "") || "code";

              return (
                <div className="code-wrapper">
                  <div className="code-header">
                    <span>{language}</span>

                    <button
                      className="copy-code-btn"
                      onClick={() => navigator.clipboard.writeText(codeText)}
                    >
                      <FaCopy />
                    </button>
                  </div>

                  <pre>
                    <code className={className}>{codeText}</code>
                  </pre>
                </div>
              );
            },
          }}
        >
          {safeContent}
        </ReactMarkdown>
      </div>
    </div>
  );
}

export default AIMessage;

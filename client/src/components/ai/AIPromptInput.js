import { FaPaperPlane, } from "react-icons/fa";

function AIPromptInput({
  prompt,
  setPrompt,
  handleSend,
  loading,
}) {
  return (
    <div className="ai-input-area">
      <input
        type="text"
        value={prompt}
        onChange={(e) =>
          setPrompt(e.target.value)
        }
        placeholder="Ask CollabCode AI..."
        onKeyDown={(e) => {
          if (e.key === "Enter") {
            handleSend();
          }
        }}
      />

      <button
        onClick={handleSend}
        disabled={loading}
      >
        <FaPaperPlane />
      </button>
    </div>
  );
}

export default AIPromptInput;
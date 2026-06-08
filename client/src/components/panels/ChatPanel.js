function ChatPanel({
  chat,
  username,
  message,
  setMessage,
  handleTyping,
  sendMessage,
}) {
  return (
    <>
      <div className="chat-messages">
        {chat.map((msg, i) => (
          <p key={i}>
            {msg.system ? (
              <i>{msg.text}</i>
            ) : (
              <>
                <b>
                  {msg.user === username
                    ? "You"
                    : msg.user}
                  :
                </b>{" "}
                {msg.text}
              </>
            )}
          </p>
        ))}
      </div>
      <div className="chat-input-area">
        <input
          value={message}
          onChange={(e) => {
            setMessage(e.target.value);
            handleTyping();
          }}
          placeholder="Type message..."
        />
        <button onClick={sendMessage}>
          Send
        </button>
      </div>
    </>
  );
}

export default ChatPanel;
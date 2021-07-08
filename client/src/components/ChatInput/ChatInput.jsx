import React, { useContext } from "react";
import { SocketContext } from "../../SocketContext.js";
import SendIcon from "@material-ui/icons/Send";
import IconButton from "@material-ui/core/IconButton";
import "./ChatInput.css";

function ChatInput() {
  const { message, setMessage, sendMessage } = useContext(SocketContext);

  const send = (event) => {
    event.preventDefault();
    if (message) {
      sendMessage(message);
    }
  };

  return (
    <form className="form">
      <input
        className="input"
        type="text"
        placeholder="Type a message..."
        value={message}
        onChange={({ target: { value } }) => setMessage(value)}
        onKeyPress={(event) => (event.key === "Enter" ? send(event) : null)}
      />
      <button className="sendButton" onClick={(e) => send(e)}>
        <IconButton
          style={{ width: "100%", height: "100%", borderRadius: "8px" }}
        >
          <SendIcon />
        </IconButton>
      </button>
    </form>
  );
}

export default ChatInput;

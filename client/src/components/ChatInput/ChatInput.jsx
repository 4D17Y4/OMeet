import React, { useContext } from "react";
import { SocketContext } from "../../SocketContext.js";
import IconButton from "@material-ui/core/IconButton";
import { Icon } from "@fluentui/react/lib/Icon";
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
    <form className="chatInput">
      <input
        className="chatInput__message"
        type="text"
        placeholder="Type a new message"
        value={message}
        onChange={({ target: { value } }) => setMessage(value)}
        onKeyPress={(event) => (event.key === "Enter" ? send(event) : null)}
      />
      <div
        className="chatInput__send"
        style={{ background: "var(--T3)" }}
        onClick={(e) => send(e)}
      >
        <IconButton
          style={{ width: "100%", height: "100%", borderRadius: "8px" }}
        >
          <Icon iconName="Send" />
        </IconButton>
      </div>
    </form>
  );
}

export default ChatInput;

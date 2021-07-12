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
      // saftey check for undefined messages.
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
      <div className="chatInput__send">
        <IconButton onClick={(e) => send(e)}>
          <Icon iconName="Send" />
        </IconButton>
      </div>
    </form>
  );
}

export default ChatInput;

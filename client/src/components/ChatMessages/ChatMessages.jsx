import React, { useContext } from "react";
import ScrollToBottom from "react-scroll-to-bottom";
import ChatMessage from "../ChatMessage/ChatMessage";
import { SocketContext } from "../../SocketContext.js";
import "./ChatMessages.css";
function ChatMessages({ messages, name }) {
  return (
    <ScrollToBottom className="messages">
      {messages.map((message, i) => {
        return (
          <div key={i}>
            <ChatMessage message={message} name={name} />
          </div>
        );
      })}
    </ScrollToBottom>
  );
}

export default ChatMessages;

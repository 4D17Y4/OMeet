import React from "react";
import ReactEmoji from "react-emoji";
import "./ChatMessage.css";

function ChatMessage({ message, name }) {
  let myMessage = false;
  if (name === message.user) {
    myMessage = true;
  }

  return myMessage ? (
    <div className="messageContainer justifyEnd">
      <p className="sentText pr-10">{message.user}</p>
      <div className="messageBox backgroundWhite">
        <p className="messageText colorDark">
          {ReactEmoji.emojify(message.text)}
        </p>
      </div>
    </div>
  ) : (
    <div className="messageContainer justifyStart">
      <div className="messageBox backgroundLight">
        <p className="messageText colorDark">
          {ReactEmoji.emojify(message.text)}
        </p>
      </div>
      <p className="sentText pl-10 ">{message.user}</p>
    </div>
  );
}

export default ChatMessage;

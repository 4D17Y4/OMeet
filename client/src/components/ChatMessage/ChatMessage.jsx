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
      <div className="messageBox backgroundT3">
        <div className="head">
          <p className="sentText pr-10">{message.user}</p>
          <p
            style={{ padding: "0", fontWeight: "400", fontSize: "0.9em" }}
            className="sentText pr-10"
          >
            {message.time}
          </p>
        </div>
        <p className="messageText colorDark">
          {ReactEmoji.emojify(message.text)}
        </p>
      </div>
    </div>
  ) : (
    <div className="messageContainer justifyStart">
      <div className="messageBox backgroundWhite">
        <div className="head">
          <p className="sentText pr-10">{message.user}</p>
          <p
            style={{ padding: "0", fontWeight: "400" }}
            className="sentText pr-10"
          >
            {message.time}
          </p>
        </div>
        <p className="messageText colorDark">
          {ReactEmoji.emojify(message.text)}
        </p>
      </div>
    </div>
  );
}

export default ChatMessage;

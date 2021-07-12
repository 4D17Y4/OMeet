import React from "react";
import ReactEmoji from "react-emoji";
import "./ChatMessage.css";

function ChatMessage({ message, name }) {
  // used to differentiate between the users message and other messages.
  let myMessage = false;

  if (name === message.user) {
    // if this is users message, we need to show it in different ui pattern.
    myMessage = true;
  }

  return myMessage ? (
    <div className="message justifyEnd">
      <div className="message__container backgroundT3">
        <div className="message__head">
          <p className="head__text pr-10">{message.user}</p>
          <p
            style={{ padding: "0", fontWeight: "400", fontSize: "0.8em" }}
            className="head__text pr-10"
          >
            {message.time}
          </p>
        </div>
        <p className="message__text width100 colorDark">
          {ReactEmoji.emojify(message.text)}
        </p>
      </div>
    </div>
  ) : (
    <div className="message justifyStart">
      <div className="message__container backgroundWhite">
        <div className="message__head">
          <p className="head__text pr-10">{message.user}</p>
          <p
            style={{ padding: "0", fontWeight: "400" }}
            className="head__text pr-10"
          >
            {message.time}
          </p>
        </div>
        <p className="message__text colorDark">
          {ReactEmoji.emojify(message.text)}
        </p>
      </div>
    </div>
  );
}

export default ChatMessage;

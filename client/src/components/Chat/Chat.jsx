import React, { useContext, useState, useRef, useEffect } from "react";
import "./Chat.css";
import ChatMessages from "../ChatMessages/ChatMessages";
import ChatInput from "../ChatInput/ChatInput";
import { SocketContext } from "../../SocketContext.js";
import Participants from "../Participants/Participants";

function Chat() {
  const { joinChatRoom, chatUsers, messages, name, roomID } =
    useContext(SocketContext);

  useEffect(() => {
    joinChatRoom();
  }, []);

  return (
    <div className="outerContainer">
      <Participants users={chatUsers} room={roomID} />
      <div className="container">
        <ChatMessages messages={messages} name={name} />
        <ChatInput />
      </div>
    </div>
  );
}

export default Chat;

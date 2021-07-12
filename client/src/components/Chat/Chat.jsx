import React, { useContext, useEffect } from "react";
import "./Chat.css";
import ChatMessages from "../ChatMessages/ChatMessages";
import ChatInput from "../ChatInput/ChatInput";
import { SocketContext } from "../../SocketContext.js";
import Participants from "../Participants/Participants";

function Chat() {
  const {
    joinChatRoom,
    joinRoom,
    chatUsers,
    messages,
    name,
    roomID,
    socketRef,
  } = useContext(SocketContext);

  useEffect(() => {
    console.log(socketRef, name, roomID);
    if (name !== "") {
      joinRoom();
      joinChatRoom();
    }
  }, [name]);

  return (
    <div className="chat">
      <Participants users={chatUsers} room={roomID} />
      <div className="chat__container">
        <ChatMessages messages={messages} name={name} />
        <ChatInput />
      </div>
    </div>
  );
}

export default Chat;

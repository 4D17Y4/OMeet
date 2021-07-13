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
    if (!socketRef.current && name !== "") {
      //saftey check so that no user with a empty name joins the room.

      // join the room, inits socket.
      joinRoom();

      // join the chat room, the user joins the chat room.
      joinChatRoom();
    }
  }, [name]);

  return (
    <div className="chat">
      {/* Participants section */}
      <Participants users={chatUsers} room={roomID} />

      {/* Chat section */}
      <div className="chat__container height100">
        {/* Messages */}
        <ChatMessages messages={messages} name={name} />

        {/* Chat Input */}
        <ChatInput />
      </div>
    </div>
  );
}

export default Chat;

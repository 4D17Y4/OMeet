import React from "react";
import Chat from "../Chat/Chat";
import Header from "../Header/Header";
import Controls from "../Controls/Controls";

function ChatRoom() {
  return (
    <div>
      <Header />
      <Chat />
      <Controls inVideo={false} />
    </div>
  );
}

export default ChatRoom;

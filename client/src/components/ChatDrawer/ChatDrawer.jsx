import React from "react";
import "./ChatDrawer.css";
import ChatMessages from "../ChatMessages/ChatMessages";
import ChatInput from "../ChatInput/ChatInput";
import CloseIcon from "@material-ui/icons/Close";
import IconButton from "@material-ui/core/IconButton";

function ChatDrawer({ drawerOpen, toggleDrawer, name, messages, room }) {
  return (
    <div
      className={`drawer__Container ${
        drawerOpen ? "drawer__Container--isOpen" : ""
      }`}
    >
      <div className="drawer__roomName">
        {room}
        <IconButton
          onClick={toggleDrawer}
          className="drawer__closeIcon"
          style={{ position: "absolute" }}
        >
          <CloseIcon className="control__button" fontSize="large" />
        </IconButton>
      </div>
      <ChatMessages messages={messages} name={name} />
      <ChatInput />
    </div>
  );
}

export default ChatDrawer;

import React, { useContext, useEffect } from "react";
import Chat from "../Chat/Chat";
import Header from "../Header/Header";
import Controls from "../Controls/Controls";
import { SocketContext } from "../../SocketContext.js";

function ChatRoom(props) {
  const { endCall, name } = useContext(SocketContext);

  useEffect(() => {
    if (!name || name === "") {
      props.history.push("/");
      return;
    }

    window.onbeforeunload = (event) => {
      const e = event || window.event;
      e.preventDefault();
      if (e) {
        e.returnValue = "";
      }
      return "";
    };

    const onBackButtonEvent = (e) => {
      e.preventDefault();
      if (
        window.confirm(
          "Are you sure ? You will leave the room, you can join as a new member."
        )
      ) {
        endCall();
        props.history.push("/");
      } else {
        window.history.pushState(null, null, window.location.pathname);
      }
    };

    window.history.pushState(null, null, window.location.pathname);
    window.addEventListener("popstate", onBackButtonEvent);
    return () => {
      window.removeEventListener("popstate", onBackButtonEvent);
      window.onbeforeunload = null;
    };
  }, [name, props.history, endCall]);

  return (
    <div>
      <Header />
      <Chat props={props} />
      <Controls props={props} inVideo={false} />
    </div>
  );
}

export default ChatRoom;

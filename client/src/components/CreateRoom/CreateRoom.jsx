import React, { useContext, useEffect } from "react";
import "./CreateRoom.css";
import UserVideo from "../UserVideo/UserVideo";
import Header from "../Header/Header";
import { SocketContext } from "../../SocketContext.js";

function CreateRoom(props) {
  const { initUserPreview, roomID, userPreview, socketRef } =
    useContext(SocketContext);

  useEffect(() => {
    if (!socketRef.current) {
      props.history.push("/");
      return;
    }
    initUserPreview();

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
      if (userPreview.current) {
        userPreview.current.srcObject.getVideoTracks()[0].stop();
        userPreview.current.srcObject.getVideoTracks()[0].stop();
      }
      props.history.push(`/chat/${roomID}`);
    };

    window.history.pushState(null, null, window.location.pathname);
    window.addEventListener("popstate", onBackButtonEvent);

    return () => {
      window.onbeforeunload = null;
      window.removeEventListener("popstate", onBackButtonEvent);
    };
  }, [props.history, roomID]);

  return (
    <div className="view">
      <Header />
      <div className="createRoom">
        <div className="userPreview__wrapper">
          <UserVideo showButtons={true} />
        </div>
      </div>
      <div className="bottom__empty" />
    </div>
  );
}

export default CreateRoom;

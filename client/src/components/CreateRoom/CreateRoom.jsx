import React, { useContext, useState, useRef, useEffect } from "react";
import { v1 as uuid } from "uuid";
import { Button, TextField, Grid } from "@material-ui/core";
import "./CreateRoom.css";
import UserVideo from "../UserVideo/UserVideo";
import Header from "../Header/Header";
import { Link } from "react-router-dom";
import { SocketContext } from "../../SocketContext.js";

function CreateRoom(props) {
  const {
    initUserPreview,
    videoState,
    audioState,
    roomID,
    setRoomID,
    name,
    userPreview,
    socketRef,
    setName,
  } = useContext(SocketContext);

  const onBackButtonEvent = (e) => {
    e.preventDefault();
    if (userPreview.current) {
      userPreview.current.srcObject.getVideoTracks()[0].stop();
      userPreview.current.srcObject.getVideoTracks()[0].stop();
    }
    props.history.push(`/chat/${roomID}`);
  };

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

    window.history.pushState(null, null, window.location.pathname);
    window.addEventListener("popstate", onBackButtonEvent);

    return () => {
      window.onbeforeunload = null;
      window.removeEventListener("popstate", onBackButtonEvent);
    };
  }, []);

  return (
    <div className="view">
      <Header />
      <div container className="createRoom">
        <div className="userPreview__wrapper">
          <UserVideo showButtons={true} />
        </div>
      </div>
      <div className="bottom__empty" />
    </div>
  );
}

export default CreateRoom;

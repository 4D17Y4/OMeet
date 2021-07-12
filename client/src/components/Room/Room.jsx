import React, { useContext, useEffect, useState } from "react";
import "./Room.css";
import ParticipantVideo from "../ParticipantsVideo/ParticipantVideo";
import UserVideo from "../UserVideo/UserVideo";
import Controls from "../Controls/Controls";
import { SocketContext } from "../../SocketContext.js";
import Header from "../Header/Header";
import ChatDrawer from "../ChatDrawer/ChatDrawer";
const logo = require("../../static/microsoft_teams.png");

/**
 * Set up the room and join room.
 * @param {*} props
 * @returns
 */
const Room = (props) => {
  const {
    name,
    messages,
    roomID,
    joinVideoChat,
    socketRef,
    endVideoCall,
    peers,
  } = useContext(SocketContext);
  const [drawerOpen, setDrawerOpen] = useState(false);

  useEffect(() => {
    if (!socketRef.current || name === "") {
      //safety check for name and socket.
      props.history.push("/");
      return;
    }

    // join the video chat.
    joinVideoChat();

    // on before unload, notify the user that video call will be ended.
    window.onbeforeunload = (event) => {
      const e = event || window.event;
      e.preventDefault();
      if (e) {
        e.returnValue = "";
      }
      return "";
    };

    // dialog for on back event of the browser.
    const onBackButtonEvent = (e) => {
      e.preventDefault();
      if (
        window.confirm(
          "Are you sure ? You will leave the video room and will be redirected to the chat."
        )
      ) {
        endVideoCall();
        props.history.push(`/chat/${roomID}`);
      } else {
        window.history.pushState(null, null, window.location.pathname);
      }
    };

    window.history.pushState(null, null, window.location.pathname);
    window.addEventListener("popstate", onBackButtonEvent);

    return () => {
      window.onbeforeunload = null;
      window.removeEventListener("popstate", onBackButtonEvent);
    };
  }, []);

  // toggle drawer function.
  function toggleDrawer() {
    setDrawerOpen(!drawerOpen);
  }

  return (
    <div className="room">
      <Header props={props} home={false} />
      <div className="room__view">
        <ChatDrawer
          className="chat__drawer"
          drawerOpen={drawerOpen}
          toggleDrawer={toggleDrawer}
          name={name}
          messages={messages}
          room={roomID}
        />
        <div className="room__videoWrapper">
          <UserVideo showButtons={false} />
        </div>
        {peers.length === 0 ? (
          // empty room, show empty image and text.
          <div className="room__empty height100">
            <img alt="failed to load" src={String(logo)} />
            <p style={{ marginTop: "30px", fontSize: "1.25em" }}>
              There's no one here...
            </p>
          </div>
        ) : (
          // load participants video in grid.
          <div
            className={"room__videoGrid height100 width100 type" + peers.length}
          >
            {peers.map((peer) => {
              return (
                <div key={peer.peerID} className="room__gridItem">
                  <ParticipantVideo
                    peer={peer.peer}
                    name={peer.name}
                    size={peers.length}
                    videoState={peer.videoState}
                    audioState={peer.audioState}
                  />
                </div>
              );
            })}
          </div>
        )}
      </div>
      <Controls props={props} inVideo={true} toggleDrawer={toggleDrawer} />
    </div>
  );
};

export default Room;

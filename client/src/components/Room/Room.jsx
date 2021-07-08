import React, { useContext, useEffect, useState } from "react";
import "./Room.css";
import ParticipantVideo from "../ParticipantsVideo/ParticipantVideo";
import UserVideo from "../UserVideo/UserVideo";
import Controls from "../Controls/Controls";
import { SocketContext } from "../../SocketContext.js";
import Header from "../Header/Header";
import ChatDrawer from "../ChatDrawer/ChatDrawer";
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

  useEffect(() => {
    if (!socketRef.current) {
      props.history.push("/");
      return;
    }

    joinVideoChat();

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

  function toggleDrawer() {
    setDrawerOpen(!drawerOpen);
  }

  return (
    <div className="room">
      <Header />
      <div className="room__view">
        <ChatDrawer
          drawerOpen={drawerOpen}
          toggleDrawer={toggleDrawer}
          name={name}
          messages={messages}
          room={roomID}
        />
        <div className="room__videoWrapper">
          <UserVideo showButtons={false} />
        </div>
        {peers.length == 0 ? (
          <div className="room__empty">
            <h1>
              OMeet is better with friends
              <br />
              Invite friends to room <i>{roomID}</i>
            </h1>
          </div>
        ) : (
          <div className={"room__videoGrid type" + peers.length}>
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

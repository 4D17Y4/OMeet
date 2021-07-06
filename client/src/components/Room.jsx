import React, { useContext, useEffect } from "react";
import "./Room.css";
import ParticipantsVideo from "./PariticipantsVideo";
import "./Room.css";
import UserVideo from "./UserVideo";
import Controls from "./Controls";
import { SocketContext } from "../SocketContext.js";
import { Button, TextField, Grid } from "@material-ui/core";
import Header from "./Header";

/**
 * Set up the room and join room.
 * @param {*} props
 * @returns
 */
const Room = (props) => {
  const { roomID, joinRoom, name, peers } = useContext(SocketContext);

  useEffect(() => {
    joinRoom();
  }, []);

  return (
    <div class="room">
      <Header />
      <div className="room__view">
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
                <div className="room__gridItem">
                  <ParticipantsVideo
                    key={peer.peerID}
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
      <Controls />
    </div>
  );
};

export default Room;

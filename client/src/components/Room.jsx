import React, {
  createContext,
  useContext,
  useEffect,
  useRef,
  useState,
} from "react";
import "./Room.css";
import ParicipantsVideo from "./PariticipantsVideo";
import "./Room.css";
import UserVideo from "./UserVideo";
import Controls from "./Controls";
import { SocketContext } from "../SocketContext.js";
import { Button, TextField, Grid } from "@material-ui/core";
import Header from "./Header";
// createContext(SocketContext);

const Room = (props) => {
  const { roomID, setUp, joinRoom, name, peers } = useContext(SocketContext);

  function showInGrid() {}

  useEffect(() => {
    // setUp();
    console.log("inRoom " + name);
    joinRoom();
    console.log(peers);
  }, []);

  return (
    <div>
      <Header />
      <div className="view">
        <div className="videoWrapper">
          <UserVideo showButtons={false} />
        </div>
        {peers.length == 0 ? (
          <div className="emptyRoom">
            <h1>
              OMeet is better with friends
              <br />
              Invite friends to room <i>{roomID}</i>
            </h1>
          </div>
        ) : (
          <div className={"participantsContainer type" + peers.length}>
            {peers.map((peer) => {
              return (
                <div className="twoContainer">
                  <ParicipantsVideo
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

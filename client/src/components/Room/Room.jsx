import React, { useContext, useEffect } from "react";
import "./Room.css";
import ParticipantVideo from "../ParticipantsVideo/ParticipantVideo";
import UserVideo from "../UserVideo/UserVideo";
import Controls from "../Controls/Controls";
import { SocketContext } from "../../SocketContext.js";
import Header from "../Header/Header";

/**
 * Set up the room and join room.
 * @param {*} props
 * @returns
 */
const Room = () => {
  const { roomID, joinVideoChat, peers } = useContext(SocketContext);

  useEffect(() => {
    joinVideoChat();
  }, []);

  return (
    <div className="room">
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
      <Controls inVideo={true} />
    </div>
  );
};

export default Room;

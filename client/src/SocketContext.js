import React, { createContext, useEffect, useRef, useState } from "react";
import io from "socket.io-client";
import Peer from "simple-peer";

const SocketContext = createContext();

const ContextProvider = ({ children }) => {
  console.log("context called");
  const [id, setId] = useState("");
  const [peers, setPeers] = useState([]);
  const socketRef = useRef();
  const userPreview = useRef();
  const peersRef = useRef([]);
  const [videoState, setVideoState] = useState(true);
  const [audioState, setAudioState] = useState(true);
  const [roomID, setRoomID] = useState("");
  const [name, setName] = useState("");
  const [userStream, setUserStream] = useState();

  /**
   * toggles given track (helper function for audio and video toggle.)
   * @param {list of tracks to toggle} tracks
   */
  function toggleTracks(tracks) {
    tracks.forEach((track) => {
      track.enabled = !track.enabled;
    });
  }

  /**
   * Sends the updates to the participant that the video is switched off.
   */
  function sendUpdate(video, audio) {
    if (socketRef.current)
      socketRef.current.emit("user updated", {
        videoEnabled: video,
        audioEnabled: audio,
        roomId: roomID,
      });
  }

  /**
   * Toggle the video
   * Disables the user video stream and sends the update signal.
   */
  function videoToggle() {
    console.log("video toggle " + videoState);
    setVideoState(!videoState);
    toggleTracks(userStream.getVideoTracks());
    sendUpdate(!videoState, audioState);
  }

  /**
   * Toggle the audio
   * Disables the user auido stream and sends the update signal.
   */
  function audioToggle() {
    setAudioState(!audioState);
    toggleTracks(userStream.getAudioTracks());
    sendUpdate(videoState, !audioState);
  }

  function joinRoom() {
    socketRef.current = io.connect("/");
    setId(socketRef.current.id);
    init();
    userPreview.current.srcObject = userStream;
    setName(name);
    socketRef.current.emit("join room", {
      roomID,
      name,
      videoState,
      audioState,
    });
  }

  const getUserMedia = async () => {
    const stream = await navigator.mediaDevices.getUserMedia({
      video: videoState,
      audio: audioState,
    });
    setUserStream(stream);
    userPreview.current.srcObject = stream;
  };

  /**
   * SetUp the room.
   */

  function init() {
    socketRef.current.on("all users", (users) => {
      // set up a new temporary peers array.
      const peers = [];

      // for every user create a new peer. (Mesh)
      users.forEach((user) => {
        const peer = createPeer(user.id);
        peersRef.current.push({
          peerID: user.id,
          name: user.userName,
          videoState: user.videoState,
          audioState: user.audioState,
          peer,
        });

        peers.push({
          peerID: user.id,
          name: user.userName,
          videoState: user.videoState,
          audioState: user.audioState,
          peer,
        });
      });
      setPeers(peers);
    });

    socketRef.current.on("user joined", (payload) => {
      console.log("user joined");
      console.log(payload);

      const peer = addPeer(
        payload.signal,
        payload.callerID,
        userPreview.current.srcObject,
        payload.name,
        payload.videoState,
        payload.audioState
      );

      peersRef.current.push({
        peerID: payload.callerID,
        name: payload.name,
        videoState: payload.videoState,
        audioState: payload.audioState,
        peer,
      });
      setPeers([...peersRef.current]);
    });

    socketRef.current.on("update user stream", (payload) => {
      console.log("update user stream callled");
      const item = peersRef.current.find((p) => p.peerID === payload.callerID);
      if (item) {
        item.peer.emit("update", {
          videoEnabled: payload.videoEnabled,
          audioEnabled: payload.audioEnabled,
        });
      }
    });

    socketRef.current.on("user left", (id) => {
      const peerObj = peersRef.current.find((p) => p.peerID === id);
      if (peerObj) {
        peerObj.peer.destroy();
      }
      const peers = peersRef.current.filter((p) => p.peerID !== id);
      peersRef.current = peers;
      setPeers(peers);
    });

    socketRef.current.on("receiving returned signal", (payload) => {
      const item = peersRef.current.find((p) => p.peerID === payload.id);
      item.peer.signal(payload.signal);
    });
  }

  useEffect(() => {
    getUserMedia();
  }, []);

  function createPeer(userToSignal) {
    const peer = new Peer({
      initiator: true,
      trickle: false,
      stream: userPreview.current.srcObject,
    });

    peer.on("signal", (signal) => {
      console.log("signaling in socket " + name);
      socketRef.current.emit("sending signal", {
        userToSignal,
        callerID: socketRef.current.id,
        signal,
        name,
        videoState: videoState,
        audioState: audioState,
      });
    });
    return peer;
  }

  function addPeer(incomingSignal, callerID, stream, name) {
    const peer = new Peer({
      initiator: false,
      trickle: false,
      stream,
    });

    peer.on("signal", (signal) => {
      socketRef.current.emit("returning signal", {
        signal,
        callerID,
        name,
        videoState,
        audioState,
      });
    });

    peer.signal(incomingSignal);

    return peer;
  }

  return (
    <SocketContext.Provider
      value={{
        id,
        peers,
        videoState,
        setVideoState,
        audioState,
        setAudioState,
        roomID,
        setRoomID,
        name,
        setName,
        audioToggle,
        videoToggle,
        userStream,
        joinRoom,
        userPreview,
      }}
    >
      {children}
    </SocketContext.Provider>
  );
};

export { ContextProvider, SocketContext };

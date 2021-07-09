import React, { createContext, useRef, useState } from "react";
import io from "socket.io-client";
import Peer from "simple-peer";

const SocketContext = createContext();

/**
 *
 * Socket context provider.
 * @returns
 */
const ContextProvider = ({ children }) => {
  const [id, setId] = useState("");
  const [name, setName] = useState("");
  const [peers, setPeers] = useState([]);
  const [roomID, setRoomID] = useState("");
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState([]);
  const [userStream, setUserStream] = useState();
  const [videoState, setVideoState] = useState(true);
  const [audioState, setAudioState] = useState(true);
  const [socket, setSocket] = useState();
  const [chatUsers, setChatUsers] = useState([]);

  const socketRef = useRef();
  const peersRef = useRef([]);
  const userPreview = useRef();

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
    initSocket();
    initRoom();
  }

  function initSocket() {
    console.log("initSocketCalled");
    socketRef.current = io.connect("/");
    setId(socketRef.current.id);
    setSocket(socketRef.current);
  }

  function joinChatRoom() {
    console.log("join chat");
    socketRef.current.emit("join chat", { name, room: roomID });
  }

  function sendMessage(message) {
    socketRef.current.emit("sendMessage", message, () => setMessage(""));
  }

  /**
   * Join room
   */
  function joinVideoChat() {
    userPreview.current.srcObject = userStream;
    console.log("join video chat " + roomID + " " + name);
    socketRef.current.emit("join room", {
      roomID,
      name,
      videoState,
      audioState,
    });
    console.log("join video chat after" + roomID + " " + name);
  }

  const initUserPreview = async () => {
    const stream = await navigator.mediaDevices.getUserMedia({
      video: { aspectRatio: 1.5 },
      audio: audioState,
    });

    const constraints = {};
    stream.getVideoTracks()[0].applyConstraints(constraints);

    setUserStream(stream);

    userPreview.current.srcObject = stream;
  };

  /**
   * SetUp the room.
   */
  function initRoom() {
    socketRef.current.on("message", (message) => {
      setMessages((messages) => [...messages, message]);
    });

    socketRef.current.on("roomData", (users) => {
      setChatUsers(users);
    });

    socketRef.current.on("all users", (users) => {
      // set up a new temporary peers array.
      const peers = [];

      // for every user create a new peer. (Mesh)
      users.forEach((user) => {
        const peer = createPeer(user.id);
        peersRef.current.push({
          peerID: user.id,
          name: user.name,
          videoState: user.videoState,
          audioState: user.audioState,
          peer,
        });

        peers.push({
          peerID: user.id,
          name: user.name,
          videoState: user.videoState,
          audioState: user.audioState,
          peer,
        });
      });
      setPeers(peers);
    });

    // for each user joined we add a new peer. (Mesh)
    socketRef.current.on("user joined", (payload) => {
      const peer = addPeer(
        payload.signal,
        payload.callerID,
        userPreview.current.srcObject,
        payload.name,
        payload.videoState,
        payload.audioState
      );

      peersRef.current.push({
        name: payload.name,
        peerID: payload.callerID,
        videoState: payload.videoState,
        audioState: payload.audioState,
        peer,
      });

      setPeers([...peersRef.current]);
    });

    // send update to the socket.
    socketRef.current.on("update user stream", (payload) => {
      const item = peersRef.current.find((p) => p.peerID === payload.callerID);
      if (item) {
        item.peer.emit("update", {
          videoEnabled: payload.videoEnabled,
          audioEnabled: payload.audioEnabled,
        });
      }
    });

    // on user left, destroy the peer and filter the ref.
    socketRef.current.on("user left", (id) => {
      const peerObj = peersRef.current.find((p) => p.peerID === id);
      if (peerObj) {
        peerObj.peer.destroy();
      }
      const peers = peersRef.current.filter((p) => p.peerID !== id);
      peersRef.current = peers;
      setPeers(peers);
    });

    socketRef.current.on("cleanUser", () => {
      console.log("clean User called " + socketRef.current.id);
      endVideoCall();
      endCall();
    });

    // set the signal to peer on recieving returned signal data.
    socketRef.current.on("receiving returned signal", (payload) => {
      const item = peersRef.current.find((p) => p.peerID === payload.id);
      item.peer.signal(payload.signal);
    });
  }

  /**
   *
   * @param {*} userToSignal end user to connect to on joining room.
   * @returns
   */
  function createPeer(userToSignal) {
    const peer = new Peer({
      initiator: true,
      trickle: false,
      stream: userPreview.current.srcObject,
    });

    // return signal.
    peer.on("signal", (signal) => {
      socketRef.current.emit("sending signal", {
        signal,
        userToSignal,
        callerID: socketRef.current.id,
      });
    });
    return peer;
  }

  function endVideoCall() {
    setPeers([]);
    userStream.getAudioTracks().forEach((track) => {
      track.stop();
    });
    userStream.getVideoTracks().forEach((track) => {
      track.stop();
    });
    setAudioState(true);
    setVideoState(true);
    socketRef.current.emit("videoCallEnded");
  }

  function endCall() {
    setMessages([]);
    setChatUsers([]);
    socketRef.current.emit("leaveRoom");
  }

  /**
   *
   * @param {*} incomingSignal new user's signal
   * @param {*} callerID new user's id.
   * @param {*} stream new user's stream
   * @param {*} name new user's name
   * @returns
   */
  function addPeer(
    incomingSignal,
    callerID,
    stream,
    name,
    videoState,
    audioState
  ) {
    const peer = new Peer({
      initiator: false,
      trickle: false,
      stream,
    });

    peer.on("signal", (signal) => {
      socketRef.current.emit("returning signal", {
        name,
        signal,
        callerID,
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
        name,
        peers,
        socket,
        roomID,
        joinRoom,
        setName,
        message,
        messages,
        socketRef,
        setRoomID,
        setMessage,
        audioState,
        videoState,
        userStream,
        videoToggle,
        audioToggle,
        sendMessage,
        userPreview,
        setMessages,
        joinChatRoom,
        setVideoState,
        setAudioState,
        joinVideoChat,
        endVideoCall,
        initUserPreview,
        chatUsers,
        endCall,
      }}
    >
      {children}
    </SocketContext.Provider>
  );
};

export { ContextProvider, SocketContext };

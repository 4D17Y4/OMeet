import React, { createContext, useRef, useState } from "react";
import io from "socket.io-client";
import Peer from "simple-peer";

//---------------------------------------------------------------- Create Context.

const SocketContext = createContext();

/**
 * Socket context provider.
 * @returns
 */
const ContextProvider = ({ children }) => {
  const [id, setId] = useState("");
  const [name, setName] = useState("");
  const [peers, setPeers] = useState([]);
  const [socket, setSocket] = useState();
  const [roomID, setRoomID] = useState("");
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState([]);
  const [chatUsers, setChatUsers] = useState([]);
  const [userStream, setUserStream] = useState();
  const [videoState, setVideoState] = useState(true);
  const [audioState, setAudioState] = useState(true);

  const socketRef = useRef();
  const peersRef = useRef([]);
  const userPreview = useRef();

  //---------------------------------------------------------------- Toggle Streams.

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
   * Toggle the video
   * Disables the user video stream and sends the update signal.
   */
  function videoToggle() {
    // set video state.
    setVideoState(!videoState);

    // toggle the video track.
    toggleTracks(userStream.getVideoTracks());

    // send update to all user, to update the status.
    sendUpdate(!videoState, audioState);
  }

  /**
   * Toggle the audio
   * Disables the user auido stream and sends the update signal.
   */
  function audioToggle() {
    // set audio state.
    setAudioState(!audioState);

    // toggle the audio track.
    toggleTracks(userStream.getAudioTracks());

    // send update to all user, to update the status.
    sendUpdate(videoState, !audioState);
  }

  /**
   * Sends the updates to the participant that the video is switched off.
   */
  function sendUpdate(video, audio) {
    if (socketRef.current) {
      // null check for socketRef
      socketRef.current.emit("user updated", {
        videoEnabled: video,
        audioEnabled: audio,
        roomId: roomID,
      });
    }
  }

  //---------------------------------------------------------------- Initialising room

  /**
   * Connect socket, setup id and socket.
   */
  function initSocket() {
    socketRef.current = io("https://o-meet-server-2.herokuapp.com/");
    setId(socketRef.current.id);
    setSocket(socketRef.current);
  }

  /**
   * SetUp the room.
   */
  function initRoom() {
    // update the messages array on message recieve.
    socketRef.current.on("message", (message) => {
      setMessages((messages) => [...messages, message]);
    });

    // update participants on with room data.
    // - users (All the users in room).
    socketRef.current.on("roomData", (users) => {
      setChatUsers(users);
    });

    // update video participants with all users data
    // - users (All the users in video conference).
    socketRef.current.on("all users", (users) => {
      // set up a new temporary peers array.
      const peers = [];

      // for every user create a new peer. (Mesh)
      users.forEach((user) => {
        // create a new peer ( initiator. )
        const peer = createPeer(user.id);
        peersRef.current.push({
          peerID: user.id,
          name: user.name,
          videoState: user.videoState,
          audioState: user.audioState,
          peer,
        });

        // add it to the peers array
        peers.push({
          peerID: user.id,
          name: user.name,
          videoState: user.videoState,
          audioState: user.audioState,
          peer,
        });
      });

      // update global peers.
      setPeers(peers);
    });

    // for each user joined we add a new peer. (Mesh)
    socketRef.current.on("user joined", (payload) => {
      // add a peer.
      const peer = addPeer(
        payload.signal,
        payload.callerID,
        userPreview.current.srcObject,
        payload.name,
        payload.videoState,
        payload.audioState
      );

      // update peers ref.
      peersRef.current.push({
        name: payload.name,
        peerID: payload.callerID,
        videoState: payload.videoState,
        audioState: payload.audioState,
        peer,
      });

      // update peers array.
      setPeers([...peersRef.current]);
    });

    // send update to the socket.
    // -payload (users data)
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

  /**
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

  //---------------------------------------------------------------- Init User Preview

  /**
   * Initailises the user preview for the video call.
   */
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

  //---------------------------------------------------------------- Room Helper functions.

  /**
   * Join Room, initialises the socket and room.
   */
  function joinRoom() {
    initSocket();
    initRoom();
  }

  /**
   * Join chat room with name and room
   */
  function joinChatRoom() {
    socketRef.current.emit("join chat", { name, room: roomID });
  }

  /**
   * Send chat message inside the room.
   * @param {*} message
   */
  function sendMessage(message) {
    socketRef.current.emit("sendMessage", message, () => setMessage(""));
  }

  /**
   * Join room
   */
  function joinVideoChat() {
    userPreview.current.srcObject = userStream;
    socketRef.current.emit("join room", {
      roomID,
      name,
      videoState,
      audioState,
    });
  }

  /**
   * Cleanup function on video call end.
   */
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

  /**
   * End the call ie leave the room.
   */
  function endCall() {
    setMessages([]);
    setChatUsers([]);
    socketRef.current.emit("leaveRoom");
    socketRef.current = null;
  }

  return (
    <SocketContext.Provider
      value={{
        id,
        name,
        peers,
        socket,
        roomID,
        endCall,
        setName,
        message,
        messages,
        joinRoom,
        socketRef,
        setRoomID,
        chatUsers,
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
      }}
    >
      {children}
    </SocketContext.Provider>
  );
};

export { ContextProvider, SocketContext };

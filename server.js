require("dotenv").config();
const express = require("express");
const http = require("http");
const app = express();
const server = http.createServer(app);
const socket = require("socket.io");
const io = socket(server);
const {
  addChatUser,
  removeChatUser,
  getChatUser,
  getChatUsersInRoom,
} = require("./chatUsers.js");

const {
  addVideoUser,
  removeVideoUser,
  getVideoUser,
  getVideoUsersInRoom,
  updateVideoUser,
  getVideoParticipantsInRoom,
} = require("./videoUsers.js");

// On socket connction.
io.on("connection", (socket) => {
  console.log("connected " + socket.id);

  socket.on("join chat", (payload) => {
    const { error, chatUser } = addChatUser({
      id: socket.id,
      name: payload.name,
      room: payload.room,
    });
    if (error) {
      return;
    }
    socket.emit("message", {
      user: "admin",
      text: `${chatUser.name} welcome to the room ${chatUser.room}`,
    });

    socket.broadcast.to(chatUser.room).emit("message", {
      user: "admin",
      text: `A mighty ${chatUser.name} hoped into the room`,
    });

    socket.join(chatUser.room);

    console.log("sending room data...");
    console.log(getChatUsersInRoom(chatUser.room));
    io.to(chatUser.room).emit("roomData", getChatUsersInRoom(chatUser.room));
  });

  socket.on("sendMessage", (message, callback) => {
    const chatUser = getChatUser(socket.id);
    console.log("sendMessage");
    io.to(chatUser.room).emit("message", {
      user: chatUser.name,
      text: message,
    });
    callback();
  });

  /**
   * User joins the room.
   * @param {payload} contains
   * - roomId (room id to join)
   * - name (user name)
   * - videoState (current video state of the user)
   * - audioState (current audio state of the user)
   */
  socket.on("join room", (payload) => {
    console.log("user joining");
    console.log(payload);
    const { error, videoUser } = addVideoUser({
      id: socket.id,
      name: payload.name,
      room: payload.roomID,
      videoState: payload.videoState,
      audioState: payload.audioState,
    });

    if (error) {
      return;
    }

    socket.emit(
      "all users",
      getVideoParticipantsInRoom(payload.roomID, socket.id)
    );

    socket.join(payload.roomID);
  });

  /**
   * sending joined users signal.
   * @param {payload}
   * - signal (user signal)
   * - callerID (user Id)
   * - name (user name)
   * - videoState (user current video state)
   * - audioState (user current audio state)
   */
  socket.on("sending signal", (payload) => {
    const user = getVideoUser(payload.callerID);
    io.to(payload.userToSignal).emit("user joined", {
      signal: payload.signal,
      callerID: payload.callerID,
      name: user.name,
      videoState: user.videoState,
      audioState: user.audioState,
    });
  });

  /**
   * returning the signal to complete shakehand.
   * @param {payload}
   * - signal (user signal)
   */
  socket.on("returning signal", (payload) => {
    io.to(payload.callerID).emit("receiving returned signal", {
      signal: payload.signal,
      id: socket.id,
    });
  });

  /**
   * on user stream updated
   * @param {payload}
   * - roomId (room Id of the user stream)
   * - videoState (updated video state)
   * - audioState (updated audio state)
   */
  socket.on("user updated", (payload) => {
    // update the user attributes in user list.
    updateVideoUser({
      id: socket.id,
      room: payload.roomId,
      videoState: payload.videoEnabled,
      audioState: payload.audioEnabled,
    });

    // broadcast user stream update.
    socket.broadcast.to(payload.roomId).emit("update user stream", {
      videoEnabled: payload.videoEnabled,
      audioEnabled: payload.audioEnabled,
      callerID: socket.id.toString(),
    });
  });

  socket.on("videoCallEnded", () => {
    endVideoCall();
  });

  function endVideoCall() {
    const userRemoved = removeVideoUser(socket.id);
    if (userRemoved) {
      socket.broadcast
        .to(userRemoved.room)
        .emit("user left", socket.id.toString());

      io.to(userRemoved.room).emit("message", {
        user: "admin",
        text: `${userRemoved.name} left the video call`,
      });
    }
  }

  socket.on("leaveRoom", () => {
    leaveRoom();
  });

  function leaveRoom() {
    const userRemoved = removeChatUser(socket.id);
    if (userRemoved) {
      socket.broadcast.to(userRemoved.room).emit("message", {
        user: "admin",
        text: `Guys calm down, ${userRemoved.name} left the room`,
      });
      io.to(userRemoved.room).emit(
        "roomData",
        getChatUsersInRoom(userRemoved.room)
      );
      socket.leave(userRemoved.room);
    }
  }

  /**
   * Handle user disconnect
   */
  socket.on("disconnect", () => {
    socket.emit("cleanUser");
    endVideoCall();
    leaveRoom();
  });
});

// server listen.
server.listen(process.env.PORT || 8000, () =>
  console.log("server is running on port 8000")
);

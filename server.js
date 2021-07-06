require("dotenv").config();
const express = require("express");
const http = require("http");
const app = express();
const server = http.createServer(app);
const socket = require("socket.io");
const io = socket(server);

// Maintain a list of users.
const users = {};

// Maintain soket to room link.
const socketToRoom = {};

// On socket connction.
io.on("connection", (socket) => {
  /**
   * User joins the room.
   * @param {payload} contains
   * - roomId (room id to join)
   * - name (user name)
   * - videoState (current video state of the user)
   * - audioState (current audio state of the user)
   */
  socket.on("join room", (payload) => {
    console.log(payload);
    if (users[payload.roomID]) {
      const length = users[payload.roomID].length;

      // check if room is full.
      if (length === 5) {
        socket.emit("room full");
        return;
      }

      // if room has space join the user.
      users[payload.roomID].push({
        userName: payload.name,
        id: socket.id,
        videoState: payload.videoState,
        audioState: payload.audioState,
      });
    } else {
      users[payload.roomID] = [
        {
          userName: payload.name,
          id: socket.id,
          videoState: payload.videoState,
          audioState: payload.audioState,
        },
      ];
    }
    socketToRoom[socket.id] = payload.roomID;
    const usersInThisRoom = users[payload.roomID].filter(
      (user) => user.id !== socket.id
    );

    socket.emit("all users", usersInThisRoom);
  });

  socket.on("sending signal", (payload) => {
    console.log(payload);
    console.log(payload.name);
    io.to(payload.userToSignal).emit("user joined", {
      signal: payload.signal,
      callerID: payload.callerID,
      name: payload.name,
      videoState: payload.videoState,
      audioState: payload.audioState,
    });
  });

  socket.on("returning signal", (payload) => {
    io.to(payload.callerID).emit("receiving returned signal", {
      signal: payload.signal,
      id: socket.id,
    });
  });

  socket.on("get Stream", (stream) => {
    console.log("stream");
    console.log(stream);
  });
  socket.on("user updated", (payload) => {
    // console.log(stream);
    console.log(payload.stream);
    const usersInThisRoom = users[payload.roomId].filter(
      (user) => user.id !== socket.id
    );
    for (var i = 0; i < users[payload.roomId].length; i++) {
      if (socket.id === users[payload.roomId][i].id) {
        users[payload.roomId][i].videoState = payload.videoEnabled;
        users[payload.roomId][i].audioState = payload.audioEnabled;
      }
    }
    socket.broadcast.emit("update user stream", {
      videoEnabled: payload.videoEnabled,
      audioEnabled: payload.audioEnabled,
      callerID: socket.id,
    });
  });

  socket.on("disconnect", () => {
    const roomID = socketToRoom[socket.id];
    let room = users[roomID];
    if (room) {
      room = room.filter((user) => user.id !== socket.id);
      users[roomID] = room;
    }
    socket.broadcast.emit("user left", socket.id);
  });
});

server.listen(process.env.PORT || 8000, () =>
  console.log("server is running on port 8000")
);

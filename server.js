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
    // check if room is already present.
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
      // room not present init room.

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

    // get all room participants to the user joined.
    socket.emit("all users", usersInThisRoom);
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
    io.to(payload.userToSignal).emit("user joined", {
      signal: payload.signal,
      callerID: payload.callerID,
      name: payload.name,
      videoState: payload.videoState,
      audioState: payload.audioState,
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
    for (var i = 0; i < users[payload.roomId].length; i++) {
      if (socket.id === users[payload.roomId][i].id) {
        users[payload.roomId][i].videoState = payload.videoEnabled;
        users[payload.roomId][i].audioState = payload.audioEnabled;
      }
    }

    // broadcast user stream update.
    socket.broadcast.emit("update user stream", {
      videoEnabled: payload.videoEnabled,
      audioEnabled: payload.audioEnabled,
      callerID: socket.id,
    });
  });

  /**
   * Handle user disconnect
   */
  socket.on("disconnect", () => {
    const roomID = socketToRoom[socket.id];
    // getRoom.
    let room = users[roomID];

    // remove user from room.
    if (room) {
      room = room.filter((user) => user.id !== socket.id);
      users[roomID] = room;
    }
    socket.broadcast.emit("user left", socket.id);
  });
});

// server listen.
server.listen(process.env.PORT || 8000, () =>
  console.log("server is running on port 8000")
);

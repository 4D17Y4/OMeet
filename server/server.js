require("dotenv").config();

/**
 * Set up the server.
 */
const express = require("express");
const http = require("http");
const router = require("./router");
const cors = require("cors");
const socket = require("socket.io");

const app = express();
const server = http.createServer(app);
const io = socket(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"],
  },
});

app.use(cors());
app.use(router);

//---------------------------------------------------------------- Helper functions

// Chat user function
const {
  addChatUser,
  removeChatUser,
  getChatUser,
  getChatUsersInRoom,
} = require("./chatUsers.js");

// Video user function
const {
  addVideoUser,
  removeVideoUser,
  getVideoUser,
  updateVideoUser,
  getVideoParticipantsInRoom,
} = require("./videoUsers.js");

// Current time in specific format (day HH:MM) (12 hour format)
function getTime() {
  const date = new Date();
  var hours = date.getHours();
  var minutes = date.getMinutes();
  var ampm = hours >= 12 ? "PM" : "AM";
  hours = hours % 12;
  hours = hours ? hours : 12; // the hour '0' should be '12'
  minutes = minutes < 10 ? "0" + minutes : minutes;
  var strTime =
    date.toLocaleDateString("en", { weekday: "long" }) +
    " " +
    hours +
    ":" +
    minutes +
    " " +
    ampm;
  return strTime;
}

//---------------------------------------------------------------- On socket connction.

io.on("connection", (socket) => {
  /**
   * On join chat.
   * Add the chat user to the users array.
   * Emit a welcome message to the user.
   * Notify the users in the room that the user has joined the room.
   * Join room and send the room data (participants) to the user.
   */

  socket.on("join chat", (payload) => {
    // add user (Chat user is the returned added user)
    const { error, chatUser } = addChatUser({
      id: socket.id,
      name: payload.name,
      room: payload.room,
    });

    if (error) {
      // the user already exist or the entries are invalid.
      return;
    }

    // welcome message.
    socket.emit("message", {
      user: "Admin",
      text: `${chatUser.name} welcome to the room ${chatUser.room}`,
      time: getTime(),
    });

    // notify users.
    socket.broadcast.to(chatUser.room).emit("message", {
      user: "Admin",
      text: `A mighty ${chatUser.name} hoped into the room`,
      time: getTime(),
    });

    // join user, send updated participants.
    socket.join(chatUser.room);
    io.to(chatUser.room).emit("roomData", getChatUsersInRoom(chatUser.room));
  });

  /**
   * On sending message find the user from socket and emit the message to specific room.
   * - message ( text message from the user ).
   * - callaback ( any callback from the function ).
   */
  socket.on("sendMessage", (message, callback) => {
    // get chat user
    const chatUser = getChatUser(socket.id);

    // emit the message
    io.to(chatUser.room).emit("message", {
      user: chatUser.name,
      text: message,
      time: getTime(),
    });

    // callback if any
    callback();
  });

  /**
   * User joins the room.
   * @param {payload} contains
   * - roomId (room id to join)
   * - name (user name)
   * - videoState (current video state of the user)
   * - audioState (current audio state of the user)
   *
   * Add video user.
   * Return video participants in the room to the newly joined user.
   *
   */
  socket.on("join room", (payload) => {
    // Add video user to the conference.
    const { error, videoUser } = addVideoUser({
      id: socket.id,
      name: payload.name,
      room: payload.roomID,
      videoState: payload.videoState,
      audioState: payload.audioState,
    });

    if (error) {
      // the user already exist or the entries are invalid.
      return;
    }

    // Broadcast a message that the user has joined the video call.
    socket.broadcast.to(videoUser.room).emit("message", {
      user: "Admin",
      text: `${videoUser.name} joined the video call`,
      time: getTime(),
    });

    // Get the video users data to the newly joined user.
    socket.emit(
      "all users",
      getVideoParticipantsInRoom(payload.roomID, socket.id)
    );
  });

  /**
   * sending joined users signal.
   * @param {payload}
   * - signal (user signal)
   * - callerID (user Id)
   * - name (user name)
   * - videoState (user current video state)
   * - audioState (user current audio state)
   *
   * Get the user's room and send the signal to the user to signal.
   */
  socket.on("sending signal", (payload) => {
    // get video user.
    const user = getVideoUser(payload.callerID);

    // emit "user joined" with the recieved signal.
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
   *
   * Send the returning signal to the client.
   */
  socket.on("returning signal", (payload) => {
    // send the signal to the client.
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
   *
   * Update the current state in video users
   * Broadcast the update.
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

  /**
   * On video call ended, end the video call from server end.
   */
  socket.on("videoCallEnded", () => {
    endVideoCall();
  });

  /**
   * On end video call
   *
   * Remove the user from the video users.
   * Broadcast that the user left.
   * Update the users in room through an admin message.
   *
   */
  function endVideoCall() {
    // remove the user
    const userRemoved = removeVideoUser(socket.id); // gets the user removed.
    if (userRemoved) {
      // if user was succesfully removed.

      // broadcast that the user left.
      socket.broadcast
        .to(userRemoved.room)
        .emit("user left", socket.id.toString());

      // emit admin message to notify all participants.
      io.to(userRemoved.room).emit("message", {
        user: "Admin",
        text: `${userRemoved.name} left the video call`,
        time: getTime(),
      });
    }
  }

  /**
   * On leaving room
   */
  socket.on("leaveRoom", () => {
    leaveRoom();
  });

  /**
   * On leave room
   *
   * Remove the user from the chat room.
   * Broadcast the user removed message.
   * Update the room participants.
   *
   */
  function leaveRoom() {
    // remove the user from chat room.
    const userRemoved = removeChatUser(socket.id);
    if (userRemoved) {
      // if the user was succesfully removed.

      // emit an admin message that the user left the room.
      socket.broadcast.to(userRemoved.room).emit("message", {
        user: "Admin",
        text: `${userRemoved.name} left the room`,
        time: getTime(),
      });

      // update the particiapants data in the room.
      io.to(userRemoved.room).emit(
        "roomData",
        getChatUsersInRoom(userRemoved.room)
      );

      // leave the room;
      socket.leave(userRemoved.room);
    }
  }

  /**
   * Handle user disconnect.
   *
   * End video call.
   * Leave the room.
   */
  socket.on("disconnect", () => {
    // clean user from the client side.
    socket.emit("cleanUser");

    // leave video call and room.
    endVideoCall();
    leaveRoom();
  });
});

// server listen.
server.listen(process.env.PORT || 8000, () =>
  console.log("server is running on port 8000")
);

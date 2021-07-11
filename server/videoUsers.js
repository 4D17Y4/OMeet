// video user array.
const videoUsers = [];

// Add video user to the array, if does not already exists
const addVideoUser = ({ id, name, room, videoState, audioState }) => {
  const userExist = videoUsers.find(
    (user) => user.room === room && user.id === id
  );

  if (userExist) {
    return { error: "Already in room" };
  }

  if (getVideoUsersInRoom(room).length == 5) {
    return { error: "Video Room Full" };
  }

  const videoUser = { id, name, room, videoState, audioState };
  videoUsers.push(videoUser);

  return { videoUser };
};

// Update the user video.
const updateVideoUser = ({ id, room, videoState, audioState }) => {
  for (var user in videoUsers) {
    if (videoUsers[user].id === id) {
      videoUsers[user].room = room;
      videoUsers[user].videoState = videoState;
      videoUsers[user].audioState = audioState;
      break;
    }
  }
};

// remove the user video if present.
const removeVideoUser = (id) => {
  const index = videoUsers.findIndex((user) => user.id === id);

  if (index !== -1) {
    return videoUsers.splice(index, 1)[0];
  }
};

// getVideo user from the array by id.
const getVideoUser = (id) => videoUsers.find((user) => user.id === id);

// get video users in specific video room.
const getVideoUsersInRoom = (room) => {
  return videoUsers.filter((user) => user.room === room);
};

// get participants in room ie room users excluding ourself.
const getVideoParticipantsInRoom = (room, id) => {
  return videoUsers.filter((user) => user.room === room && user.id !== id);
};

// export the functions for use in server.
module.exports = {
  addVideoUser,
  removeVideoUser,
  getVideoUser,
  getVideoUsersInRoom,
  updateVideoUser,
  getVideoParticipantsInRoom,
};

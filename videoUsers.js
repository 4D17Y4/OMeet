const videoUsers = [];

const addVideoUser = ({ id, name, room, videoState, audioState }) => {
  console.log(videoUsers);
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
  console.log(videoUsers);

  return { videoUser };
};

const updateVideoUser = ({ id, room, videoState, audioState }) => {
  console.log("updateVideoUser", id, room, videoState, audioState);
  console.log(videoUsers);
  for (var user in videoUsers) {
    if (videoUsers[user].id === id) {
      videoUsers[user].room = room;
      videoUsers[user].videoState = videoState;
      videoUsers[user].audioState = audioState;
      break;
    }
  }
  console.log(videoUsers);
};

const removeVideoUser = (id) => {
  const index = videoUsers.findIndex((user) => user.id === id);

  if (index !== -1) {
    return videoUsers.splice(index, 1)[0];
  }
};

const getVideoUser = (id) => videoUsers.find((user) => user.id === id);
const getVideoUsersInRoom = (room) => {
  return videoUsers.filter((user) => user.room === room);
};
const getVideoParticipantsInRoom = (room, id) => {
  return videoUsers.filter((user) => user.room === room && user.id !== id);
};

module.exports = {
  addVideoUser,
  removeVideoUser,
  getVideoUser,
  getVideoUsersInRoom,
  updateVideoUser,
  getVideoParticipantsInRoom,
};

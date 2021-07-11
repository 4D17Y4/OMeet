// chat users array.
const chatUsers = [];

// Add chat user to the array.
const addChatUser = ({ id, name, room }) => {
  const userExist = chatUsers.find(
    (user) => user.room === room && user.id === id
  );

  if (userExist) {
    return { error: "Already in room" };
  }

  const chatUser = { id, name, room };
  chatUsers.push(chatUser);
  return { chatUser };
};

// remove chat user from the room.
const removeChatUser = (id) => {
  const index = chatUsers.findIndex((user) => user.id === id);

  if (index !== -1) {
    return chatUsers.splice(index, 1)[0];
  }
};

// returns the chat user with given unique id.
const getChatUser = (id) => {
  return chatUsers.find((user) => user.id === id);
};

// returns all the chat users in room.
const getChatUsersInRoom = (room) =>
  chatUsers.filter((user) => user.room === room);

// export the functions.
module.exports = {
  addChatUser,
  removeChatUser,
  getChatUser,
  getChatUsersInRoom,
};

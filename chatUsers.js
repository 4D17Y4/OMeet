const chatUsers = [];

const addChatUser = ({ id, name, room }) => {
  console.log("adding chat user");
  console.log(chatUsers);
  const userExist = chatUsers.find(
    (user) => user.room === room && user.id === id
  );

  if (userExist) {
    return { error: "Already in room" };
  }

  const chatUser = { id, name, room };
  chatUsers.push(chatUser);
  console.log(chatUsers);
  return { chatUser };
};

const removeChatUser = (id) => {
  const index = chatUsers.findIndex((user) => user.id === id);

  if (index !== -1) {
    return chatUsers.splice(index, 1)[0];
  }
};

const getChatUser = (id) => {
  return chatUsers.find((user) => user.id === id);
};
const getChatUsersInRoom = (room) =>
  chatUsers.filter((user) => user.room === room);

module.exports = {
  addChatUser,
  removeChatUser,
  getChatUser,
  getChatUsersInRoom,
};

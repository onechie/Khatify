const {
  handleFindPartner,
  handleChat,
  handleForceDisconnect,
  handleDisconnect,
  handleReconnect,
} = require("./handlers/userHandler");

let onlineUsers = 0;

const broadcastOnlineUsers = require("./utils/broadcastOnlineUsers");

const socketHandler = (io) => {
  io.on("connection", (socket) => {
    onlineUsers++;
    broadcastOnlineUsers(io, onlineUsers);

    socket.on("findPartner", (data) => handleFindPartner(io, socket, data));
    socket.on("chat", (data) => handleChat(socket, data));
    socket.on("forceDisconnect", (data) => handleForceDisconnect(socket, data));
    socket.on("disconnect", () => {
      handleDisconnect(io, socket, onlineUsers);
      onlineUsers--;
    });
    socket.on("reconnect", (data) => handleReconnect(io, socket, data));
  });
};

module.exports = socketHandler;
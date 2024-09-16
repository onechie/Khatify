const {
  handleFindPartner,
  handleChat,
  handleForceDisconnect,
  handleDisconnect,
  handleReconnect,
  handleUserTyping,
  handleUserStoppedTyping,
} = require("./handlers/userHandler");

let onlineUsers = 0;
let totalVisits = 0;

const broadcastOnlineUsers = require("./utils/broadcastOnlineUsers");

const socketHandler = (io) => {
  io.on("connection", (socket) => {
    onlineUsers++;
    totalVisits++;
    console.log("Total Visits:", totalVisits);
    broadcastOnlineUsers(io, onlineUsers);

    socket.on("findPartner", (data) => handleFindPartner(io, socket, data));
    socket.on("chat", (data) => handleChat(socket, data));
    socket.on("forceDisconnect", (data) => handleForceDisconnect(socket, data));
    socket.on("disconnect", () => {
      handleDisconnect(io, socket, onlineUsers);
      onlineUsers--;
    });
    socket.on("reconnect", (data) => handleReconnect(io, socket, data));

    // User typing
    socket.on("userTyping", (data) => handleUserTyping(socket, data));
    socket.on("userStoppedTyping", (data) =>
      handleUserStoppedTyping(socket, data)
    );
  });
};

module.exports = socketHandler;

const broadcastOnlineUsers = (io, onlineUsers) => {
  io.emit("updateOnlineUsers", onlineUsers);
};

module.exports = broadcastOnlineUsers;

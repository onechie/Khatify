const createRoomId = require("../utils/createRoomId");
const waitingUsers = new Set();

const handleFindPartner = (io, socket, { username, interest }) => {
  socket.username = username || "Stranger";
  socket.interest = interest;

  if (!waitingUsers.has(socket)) {
    waitingUsers.add(socket);
    pairUsers(io);
  }
};

const handleChat = (socket, { roomId, message, username }) => {
  if (roomId) {
    socket
      .to(roomId)
      .emit("chat", { message, username: username || "Stranger" });
  }
};

const handleForceDisconnect = (socket, { username }) => {
  handleDisconnection(socket, false, username || "Stranger");
};

const handleDisconnect = (io, socket, onlineUsers) => {
  handleDisconnection(socket, true);
  require("../utils/broadcastOnlineUsers")(io, onlineUsers);
};

const handleReconnect = (io, socket, { roomId, username, interest }) => {
  const rooms = io.sockets.adapter.rooms;
  if (rooms.get(roomId)) {
    socket.join(roomId);
    socket.roomId = roomId;
    socket.username = username;
    socket.interest = interest;

    socket.to(roomId).emit("reconnect", {
      username: username || "Stranger",
    });

    socket.emit("reconnectStatus", {
      message: "You have reconnected to the room.",
    });
  } else {
    socket.emit("reconnectFailed", {
      message: "Failed to reconnect. The room no longer exists.",
    });
  }
};

// Helper function to pair users
const pairUsers = (io) => {
  if (waitingUsers.size >= 2) {
    let user1,
      user2,
      matchedInterests = [];

    const usersArray = [...waitingUsers];

    for (let i = 0; i < usersArray.length; i++) {
      for (let j = i + 1; j < usersArray.length; j++) {
        const commonInterests = usersArray[i].interest.filter((interest) =>
          usersArray[j].interest.includes(interest)
        );

        if (
          commonInterests.length > 0 ||
          (!usersArray[i].interest.length && !usersArray[j].interest.length)
        ) {
          user1 = usersArray[i];
          user2 = usersArray[j];
          matchedInterests = commonInterests;
          break;
        }
      }
      if (user1 && user2) break;
    }

    if (user1 && user2) {
      waitingUsers.delete(user1);
      waitingUsers.delete(user2);

      const roomId = createRoomId(user1, user2);

      user1.roomId = roomId;
      user2.roomId = roomId;

      user1.join(roomId);
      user2.join(roomId);

      user1.emit("paired", {
        roomId,
        username: user2.username,
        interest: matchedInterests,
      });
      user2.emit("paired", {
        roomId,
        username: user1.username,
        interest: matchedInterests,
      });
    }
  }
};

const handleDisconnection = (socket, isAccident = false, username) => {
  const { roomId } = socket;
  if (waitingUsers.has(socket)) {
    waitingUsers.delete(socket);
  }
  if (isAccident) {
    socket.to(roomId).emit("accidentDisconnect", { username });
    socket.to(roomId).emit("waitPartner");
  } else {
    socket.to(roomId).emit("forceDisconnect", { username });
  }
};

const handleUserTyping = (socket, { username, roomId }) => {
  if (roomId) {
    socket.to(roomId).emit("userTyping", { username: username || "Stranger" });
  }
};
const handleUserStoppedTyping = (socket, { username, roomId }) => {
  if (roomId) {
    socket
      .to(roomId)
      .emit("userStoppedTyping", { username: username || "Stranger" });
  }
};

module.exports = {
  handleFindPartner,
  handleChat,
  handleForceDisconnect,
  handleDisconnect,
  handleReconnect,
  handleUserTyping,
  handleUserStoppedTyping,
};

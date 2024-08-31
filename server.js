const path = require("path");
const http = require("http");
const express = require("express");
const socketio = require("socket.io");

const app = express();
const server = http.createServer(app);
const io = socketio(server);

const PORT = process.env.PORT || 3000;

app.use(express.static(path.join(__dirname, "public")));

const waitingUsers = new Set();
let onlineUsers = 0;

// Function to create a unique room ID
const createRoomId = (user1, user2) => `room-${user1.id}-${user2.id}`;

const pairUsers = () => {
  if (waitingUsers.size >= 2) {
    let user1,
      user2,
      matchedInterests = [];

    // Convert the Set to an Array for easy iteration
    const usersArray = [...waitingUsers];

    // Loop through waiting users to find a pair with matching interests
    for (let i = 0; i < usersArray.length; i++) {
      for (let j = i + 1; j < usersArray.length; j++) {
        const commonInterests = usersArray[i].interest.filter((interest) =>
          usersArray[j].interest.includes(interest)
        );

        // If common interests are found or both users have no interests
        if (
          commonInterests.length > 0 ||
          (!usersArray[i].interest.length && !usersArray[j].interest.length)
        ) {
          user1 = usersArray[i];
          user2 = usersArray[j];
          matchedInterests = commonInterests; // Store matched interests
          break;
        }
      }
      if (user1 && user2) break; // Exit loop once a pair is found
    }

    // If a pair is found, proceed with pairing
    if (user1 && user2) {
      waitingUsers.delete(user1);
      waitingUsers.delete(user2);

      const roomId = createRoomId(user1, user2);

      // Store the roomId on each user's socket object
      user1.roomId = roomId;
      user2.roomId = roomId;

      // Join the users to a unique room
      user1.join(roomId);
      user2.join(roomId);

      // Notify both users they are paired and include matched interests
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

// Function to broadcast the number of online users
const broadcastOnlineUsers = () => {
  io.emit("updateOnlineUsers", onlineUsers);
};

// Function to handle user disconnection
const handleDisconnection = (socket, isGone = false, username) => {
  const { roomId } = socket;
  // Remove the socket from waitingUsers set if it exists
  if (waitingUsers.has(socket)) {
    waitingUsers.delete(socket);
  }
  if (roomId) {
    // Notify the other user in the room
    socket.to(roomId).emit("partnerDisconnect", { username });
  }
  if (isGone) {
    onlineUsers -= 1;
  }
  broadcastOnlineUsers(); // Broadcast updated count after a user disconnects
};

const isSocketInWaitingList = (socket) => waitingUsers.has(socket);

io.on("connection", (socket) => {
  onlineUsers += 1;
  broadcastOnlineUsers(); // Broadcast updated count when a user connects

  socket.on("findPartner", ({ username, interest }) => {
    socket.username = username;
    socket.interest = interest;
    if (!isSocketInWaitingList(socket)) {
      waitingUsers.add(socket);
      pairUsers();
    }
    console.log("=============================");
    waitingUsers.forEach((user) => {
      console.log(`{${user.id}, ${user.username}}`);
    });
  });

  socket.on("chat", ({ roomId, message, username }) => {
    if (roomId) {
      socket.to(roomId).emit("chat", { message, username });
    }
  });

  socket.on("forceDisconnect", ({ username }) =>
    handleDisconnection(socket, false, username)
  );
  socket.on("disconnect", () => handleDisconnection(socket, true));
});

server.listen(PORT, () => console.log(`Server running on port: ${PORT}`));

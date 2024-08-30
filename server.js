const path = require("path");
const http = require("http");
const express = require("express");
const socketio = require("socket.io");
const moment = require("moment");

const app = express();
const server = http.createServer(app);
const io = socketio(server);

const PORT = process.env.PORT || 3000;

app.use(express.static(path.join(__dirname, "public")));

const waitingUsers = [];
let onlineUsers = 0;

// Function to create a unique room ID
function createRoomId(user1, user2) {
  return `room-${user1.id}-${user2.id}`;
}

// Function to handle pairing users
function pairUsers() {
  if (waitingUsers.length >= 2) {
    const user1 = waitingUsers.shift();
    const user2 = waitingUsers.shift();

    const roomId = createRoomId(user1, user2);

    // Store the roomId on each user's socket object
    user1.roomId = roomId;
    user2.roomId = roomId;

    // Join the users to a unique room
    user1.join(roomId);
    user2.join(roomId);

    // Notify both users they are paired
    user1.emit("paired", roomId);
    user2.emit("paired", roomId);
  }
}
// Function to broadcast the number of online users
function broadcastOnlineUsers() {
  io.emit("updateOnlineUsers", onlineUsers);
}

// Function to handle user disconnection
function handleDisconnection(socket, isGone = false) {
  const roomId = socket.roomId;
  if (roomId) {
    // Notify the other user in the room
    socket.to(roomId).emit("partnerDisconnected");
  }
  if (isGone) {
    onlineUsers -= 1;
  }
  broadcastOnlineUsers(); // Broadcast updated count after a user disconnects
}

function isSocketInWaitingList(socket) {
  return waitingUsers.includes(socket);
}
function getCurrentTime() {
  return { time: moment().format("h:m a") };
}

io.on("connection", (socket) => {
  onlineUsers += 1;
  broadcastOnlineUsers(); // Broadcast updated count when a user connects
  socket.on("findPartner", () => {
    if (!isSocketInWaitingList(socket)) {
      waitingUsers.push(socket);
      pairUsers();
    }
  });

  socket.on("message", ({ roomId, message }) => {
    socket.to(roomId).emit("message", { message, time: getCurrentTime().time });
  });

  socket.on("partnerDisconnect", () => handleDisconnection(socket));

  socket.on("disconnect", () => handleDisconnection(socket, true));
});

server.listen(PORT, () => console.log(`Server running on port: ${PORT}`));

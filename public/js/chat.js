const socket = io();

let userRoomId = null;
let isPaired = false;

socket.on("updateOnlineUsers", (count) => {
  onlineUsers.innerText = count;
});

socket.on("paired", (roomId) => {
  userRoomId = roomId;
  chatBox.innerHTML = "";
  appendMessage("System", "You are now chatting with a stranger...");
  disableButtons(false);
  isPaired = true;
});

socket.on("message", ({ message }) => {
  appendMessage("Stranger", message, getCurrentTime());
});

socket.on("partnerDisconnected", () => {
  appendMessage("System", "Stranger Disconnected...");
  swapButtons();
  disableButtons(true);
  isPaired = false;
});

function sendMessage(message) {
  if (message.trim()) {
    socket.emit("message", { roomId: userRoomId, message });
    appendMessage("You", message, getCurrentTime());
  }
}

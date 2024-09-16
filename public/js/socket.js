// ---- Socket Event Listeners ---- //

/**
 * Setup all socket event listeners.
 * This function organizes socket.on events in one place for easy maintainability.
 */
const initializeSocketListeners = () => {
  // Update the count of online users
  socket.on("updateOnlineUsers", updateOnlineUsers);

  // Triggered when a partner is paired
  socket.on("paired", handlePartnerPaired);

  // Receive a chat message from the partner
  socket.on("chat", handleChatReceived);

  // Partner accidentally disconnects
  socket.on("accidentDisconnect", handleAccidentalDisconnect);

  // Partner forcefully disconnects
  socket.on("forceDisconnect", handleForceDisconnectReceived);

  // Waiting for a partner to reconnect
  socket.on("waitPartner", handleWaitForPartnerReconnect);

  // Partner successfully reconnects
  socket.on("reconnect", handlePartnerReconnected);

  // Handle reconnect status (success or failure)
  socket.on("reconnectStatus", handleReconnectStatus);

  // Reconnect failed
  socket.on("reconnectFailed", handleReconnectFailed);

  // Partner is typing
  socket.on("userTyping", handlePartnerTyping);

  // Partner stopped typing
  socket.on("userStoppedTyping", handlePartnerStoppedTyping);
};

// Initialize socket event listeners when needed
initializeSocketListeners();

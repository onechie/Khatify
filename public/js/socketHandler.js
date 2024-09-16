// ---- Helper Handlers ---- //

/**
 * Handler to find a chat partner based on session interests.
 */
const handleFindPartner = () => {
  const sessionInterest = getSessionData("interest");
  let interests = [];

  // Disable input fields while searching for a partner
  disableInputs(true);
  chatBox.innerHTML = "";
  createSystemMessage("Looking for a partner.");

  if (sessionInterest && sessionInterest.trim() !== "") {
    interests = sessionInterest
      .split(",")
      .map((item) => item.trim())
      .filter(Boolean); // Filter out empty strings

    createSystemMessage(`Interest(s): ${interests.join(", ")}.`);
  }

  toggleLoading(findPartner, true);

  setTimeout(() => {
    // Emit 'findPartner' event to server
    socket.emit("findPartner", {
      username: getSessionData("username") || "",
      interest: interests,
    });

    toggleLoading(findPartner, false);
    swapButtons();
  }, 1000);
};

/**
 * Handler to emit a force disconnect event.
 */
const handleForceDisconnect = () => {
  socket.emit("forceDisconnect", {
    username: getSessionData("username") || "",
  });

  deleteSessionData("roomId");
  createSystemMessage("You have disconnected.");

  swapButtons();
  disableButtons(true);
  disconnectModal.hidden = true;
  isPaired = false;
  disableInputs(false);
};

/**
 * Handler to send a chat message to the server.
 * @param {string} message - The message to send.
 */
const handleSendMessage = (message) => {
  clearTimeout(typingTimeout); // Stop typing indicator

  isTyping = false;

  if (message.trim()) {
    socket.emit("chat", {
      roomId: getSessionData("roomId"),
      message,
      username: getSessionData("username") || "",
    });
    createYourMessage(message, getCurrentTime());
  }
};

// ---- Socket Event Listeners ---- //

/**
 * Handler to update the number of online users.
 * @param {number} userCount - The current number of online users.
 */
const updateOnlineUsers = (userCount) => {
  onlineUsers.innerText = userCount;
};

/**
 * Handler when a user is paired with a partner.
 * @param {object} data - Pairing information, including roomId, username, and interest.
 */
const handlePartnerPaired = ({ roomId, username, interest }) => {
  chatBox.innerHTML = ""; // Clear chat box on pairing
  collapsibleContent.classList.toggle("hidden");

  setSessionData("roomId", roomId);
  setSessionData("partnerUsername", username || "Stranger");

  createSystemMessage(`You are now chatting with ${username}.`);

  if (interest && interest.length > 0) {
    createSystemMessage(`Matched interest(s): ${interest.join(", ")}.`);
  }

  disableButtons(false);
  isPaired = true;
};

/**
 * Handler for receiving a chat message.
 * @param {object} data - Contains the message and username of the sender.
 */
const handleChatReceived = ({ message, username }) => {
  loadingElement.remove(); // Remove loading indicator
  createStrangerMessage(message, getCurrentTime(), username);
};

/**
 * Handler for accidental partner disconnect.
 */
const handleAccidentalDisconnect = () => {
  createSystemMessage(`${getSessionData("partnerUsername")} has disconnected.`);
};

/**
 * Handler for forced partner disconnect.
 * @param {object} data - Contains the username of the disconnected user.
 */
const handleForceDisconnectReceived = ({ username }) => {
  collapsibleContent.classList.toggle("hidden");
  createSystemMessage(`${username} has disconnected.`);

  deleteSessionData("roomId");
  swapButtons();
  disableButtons(true);
  isPaired = false;
  disableInputs(false);
};

/**
 * Handler when waiting for a partner to reconnect after disconnection.
 */
const handleWaitForPartnerReconnect = () => {
  createSystemMessage(
    `${getSessionData(
      "partnerUsername"
    )} accidentally disconnected. Waiting for them to reconnect or find a new partner.`
  );
};

/**
 * Handler when partner successfully reconnects.
 * @param {object} data - Contains the username of the reconnected partner.
 */
const handlePartnerReconnected = ({ username }) => {
  createSystemMessage(`${username} has successfully reconnected.`);
};

/**
 * Handler for reconnect status (e.g., success or fail).
 * @param {object} data - Contains the reconnect message.
 */
const handleReconnectStatus = ({ message }) => {
  createSystemMessage(message);
  toggleLoading(findPartner, true);

  setTimeout(() => {
    toggleLoading(findPartner, false);
    swapButtons();
  }, 1000);

  disableButtons(false);
  isPaired = true;
};

/**
 * Handler for failed reconnection.
 * @param {object} data - Contains the failure message.
 */
const handleReconnectFailed = ({ message }) => {
  createSystemMessage(message);

  toggleLoading(findPartner, true);

  setTimeout(() => {
    toggleLoading(findPartner, false);
  }, 1000);

  deleteSessionData("roomId");
};

// ---- Typing Indicator ---- //

/**
 * Emit typing event when the user starts typing.
 */
const handleUserTyping = () => {
  if (!isTyping) {
    isTyping = true;
    socket.emit("userTyping", {
      username: getSessionData("username") || "",
      roomId: getSessionData("roomId"),
    });
  }

  clearTimeout(typingTimeout);

  typingTimeout = setTimeout(() => {
    isTyping = false;
    socket.emit("userStoppedTyping", {
      username: getSessionData("username") || "",
      roomId: getSessionData("roomId"),
    });
  }, 1000); // Adjust as needed
};

/**
 * Handle event when the partner is typing.
 * @param {object} data - Contains the partner's username.
 */
const handlePartnerTyping = ({ username }) => {
  createTyping(username);
};

/**
 * Handle event when the partner stops typing.
 */
const handlePartnerStoppedTyping = () => {
  removeTyping();
};

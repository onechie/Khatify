// SOCKET EMIT
const findPartnerHandler = () => {
  const sessionInterest = getSessionData("interest");
  let interestArray = [];
  disableInputs(true);
  chatBox.innerHTML = "";
  createSystemMessage(`Looking for partner.`);
  if (sessionInterest && sessionInterest.trim() !== "") {
    interestArray = sessionInterest
      .split(",")
      .map((item) => item.trim())
      .filter(Boolean);
    createSystemMessage(`Interest(s): ${interestArray.join(", ")}.`);
  }
  toggleLoading(findPartner, true);
  setTimeout(() => {
    socket.emit("findPartner", {
      username: getSessionData("username") || "",
      interest: interestArray,
    });
    toggleLoading(findPartner, false);
    swapButtons();
  }, 1000);
};

const emitForceDisconnectHandler = () => {
  socket.emit("forceDisconnect", {
    username: getSessionData("username") || "",
  });
  deleteSessionData("roomId");
  createSystemMessage("You Disconnected.");
  swapButtons();
  disableButtons(true);
  disconnectModal.hidden = true;
  isPaired = false;
  disableInputs(false);
};

const sendMessageHandler = (message) => {
  if (message.trim()) {
    socket.emit("chat", {
      roomId: getSessionData("roomId"),
      message,
      username: getSessionData("username") || "",
    });
    createYourMessage(message, getCurrentTime());
  }
};

// SOCKET ON

const updateUsersHandler = (count) => {
  onlineUsers.innerText = count;
};

const pairedHandler = ({ roomId, username, interest }) => {
  chatBox.innerHTML = "";
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

const chatHandler = ({ message, username }) => {
  createStrangerMessage(message, getCurrentTime(), username);
};

const onAccidentDisconnectHandler = () => {
  createSystemMessage(`${getSessionData("partnerUsername")} disconnected.`);
};
const onForceDisconnectHandler = ({ username }) => {
  collapsibleContent.classList.toggle("hidden");
  createSystemMessage(`${username} Disconnected.`);
  deleteSessionData("roomId");
  swapButtons();
  disableButtons(true);
  isPaired = false;
  disableInputs(false);
};

const waitPartnerHandler = () => {
  createSystemMessage(
    `${getSessionData(
      "partnerUsername"
    )} accidentally disconnected. You can wait for them to reconnect or find a new partner.`
  );
};

const reconnectHandler = ({ username }) => {
  createSystemMessage(`${username} successfully reconnected.`);
};
const reconnectStatusHandler = ({ message }) => {
  createSystemMessage(message);
  toggleLoading(findPartner, true);
  setTimeout(() => {
    toggleLoading(findPartner, false);
    swapButtons();
  }, 1000);
  disableButtons(false);
  isPaired = true;
};
const reconnectFailedHandler = ({ message }) => {
  createSystemMessage(message);
  toggleLoading(findPartner, true);
  setTimeout(() => {
    toggleLoading(findPartner, false);
  }, 1000);
  deleteSessionData("roomId");
};

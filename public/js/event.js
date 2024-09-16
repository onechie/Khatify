// ---- Event Listeners Setup ---- //

/**
 * Initialize all event listeners in one place for better organization and maintainability.
 */
const initializeEventListeners = () => {
  // Find partner button click
  findPartner.addEventListener("click", handleFindPartnerClick);

  // Disconnect partner button click
  disconnectPartner.addEventListener("click", handleDisconnectClick);

  // Confirm disconnect (yes button) click
  disconnectYes.addEventListener("click", handleForceDisconnectConfirm);

  // Cancel disconnect (no button) click
  disconnectNo.addEventListener("click", handleCancelDisconnect);

  // Chat form submission
  chatForm.addEventListener("submit", handleChatFormSubmit);

  // Username input change
  usernameInput.addEventListener("change", handleUsernameInputChange);

  // Interest input change
  interestInput.addEventListener("change", handleInterestInputChange);

  // Hamburger menu toggle
  hamburgerMenu.addEventListener("click", toggleHamburgerMenu);

  // Window load event to handle reconnections and session restoration
  window.addEventListener("load", handleWindowLoad);

  // Message input keydown (for typing indicator)
  messageInput.addEventListener("keydown", handleUserTyping);
};

// ---- Event Handler Functions ---- //

const handleFindPartnerClick = () => {
  handleFindPartner();
};

const handleDisconnectClick = () => {
  disconnectText.innerText = isPaired
    ? "Are you sure you want to disconnect from your partner?"
    : "Are you sure you want to disconnect from looking for a partner?";
  disconnectModal.hidden = false;
};

const handleForceDisconnectConfirm = () => {
  handleForceDisconnect();
};

const handleCancelDisconnect = () => {
  disconnectModal.hidden = true;
};

const handleChatFormSubmit = (e) => {
  e.preventDefault();
  const messageInput = e.target.elements.message;
  handleSendMessage(messageInput.value);
  messageInput.value = "";
  messageInput.focus();
};

const handleUsernameInputChange = () => {
  usernameInput.value = removeNonLetters(usernameInput.value);
  setSessionData("username", usernameInput.value);
};

const handleInterestInputChange = () => {
  const interests = extractLetters(
    `${interestInput.value.toLowerCase()},${getSessionData("interest")}`
  );
  interestInput.value = "";
  setSessionData("interest", interests);
  updateInterestList(interests);
};

const toggleHamburgerMenu = () => {
  collapsibleContent.classList.toggle("hidden");
  hamburgerMenu.classList.toggle("text-white");
  hamburgerMenu.classList.toggle("text-purple-500");
};

const handleWindowLoad = () => {
  const roomId = getSessionData("roomId");
  const username = getSessionData("username");
  const interest = extractLetters(getSessionData("interest"));

  // Restore session values to inputs
  username ? (usernameInput.value = username) : (usernameInput.value = "");
  interest ? updateInterestList(interest) : (interestInput.value = "");

  // If the user was in a room, attempt to reconnect
  if (roomId) {
    socket.emit("reconnect", { roomId, username, interest });
    createSystemMessage(
      "You were disconnected last time. Attempting to reconnect."
    );
  }
};
// ---- Initialize Event Listeners ---- //
initializeEventListeners();

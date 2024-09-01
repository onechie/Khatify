findPartner.addEventListener("click", findPartnerHandler);

disconnectPartner.addEventListener("click", () => {
  if (isPaired) {
    disconnectText.innerText =
      "Are you sure you want to disconnect from your partner?";
  } else {
    disconnectText.innerText =
      "Are you sure you want to disconnect looking for a partner?";
  }
  disconnectModal.hidden = false;
});

disconnectYes.addEventListener("click", emitForceDisconnectHandler);

disconnectNo.addEventListener("click", () => {
  disconnectModal.hidden = true;
});

chatForm.addEventListener("submit", (e) => {
  e.preventDefault();
  const messageInput = e.target.elements.message;
  sendMessageHandler(messageInput.value);
  messageInput.value = "";
  messageInput.focus();
});

interestInput.addEventListener("change", () => {
  interestInput.value = extractLetters(interestInput.value);
  sessionStorage.setItem("interest", interestInput.value);
});
usernameInput.addEventListener("change", () => {
  usernameInput.value = removeNonLetters(usernameInput.value);
  sessionStorage.setItem("username", usernameInput.value);
});

hamburgerMenu.addEventListener("click", () => {
  collapsibleContent.classList.toggle("hidden");
});

window.addEventListener("load", () => {
  const roomId = getSessionData("roomId");
  const username = getSessionData("username");
  const interest = getSessionData("interest");

  username ? (usernameInput.value = username) : (usernameInput.value = "");
  interest ? (interestInput.value = interest) : (interestInput.value = "");

  if (roomId) {
    socket.emit("reconnect", { roomId, username, interest});
    createSystemMessage(
      "You were disconnected last time. Attempting to reconnect."
    );
  }
});

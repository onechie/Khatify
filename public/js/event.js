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

usernameInput.addEventListener("change", () => {
  usernameInput.value = removeNonLetters(usernameInput.value);
  setSessionData("username", usernameInput.value);
});

interestInput.addEventListener("change", () => {
  const interests = extractLetters(
    `${interestInput.value.toLowerCase()},${getSessionData("interest")}`
  );
  interestInput.value = "";
  setSessionData("interest", interests);
  updateInterestList(interests);
});

hamburgerMenu.addEventListener("click", () => {
  collapsibleContent.classList.toggle("hidden");
  hamburgerMenu.classList.toggle("text-white")
  hamburgerMenu.classList.toggle("text-purple-500")
});

window.addEventListener("load", () => {
  const roomId = getSessionData("roomId");
  const username = getSessionData("username");
  const interest = extractLetters(getSessionData("interest"));

  username ? (usernameInput.value = username) : (usernameInput.value = "");
  interest ? updateInterestList(interest) : (interestInput.value = "");

  if (roomId) {
    socket.emit("reconnect", { roomId, username, interest });
    createSystemMessage(
      "You were disconnected last time. Attempting to reconnect."
    );
  }
});

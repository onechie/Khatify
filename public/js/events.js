findPartner.addEventListener("click", () => {
  let interestArray = [];
  disableInputs(true);
  chatBox.innerHTML = "";
  appendMessage("System", `Looking for partner.`);
  if (interestInput.value.trim() !== "") {
    interestArray = interestInput.value.split(",").map(item => item.trim()).filter(Boolean);
    appendMessage("System", `Interest(s): ${interestArray.join(", ")}.`);
  }
  toggleLoading(findPartner, true);
  setTimeout(() => {
    socket.emit("findPartner", {
      username: usernameInput.value,
      interest: interestArray,
    });
    toggleLoading(findPartner, false);
    swapButtons();
  }, 1000);
});

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

disconnectYes.addEventListener("click", () => {
  socket.emit("forceDisconnect", {username:usernameInput.value});
  appendMessage("System", "You Disconnected.");
  swapButtons();
  disableButtons(true);
  disconnectModal.hidden = true;
  isPaired = false;
  disableInputs(false);
});

disconnectNo.addEventListener("click", () => {
  disconnectModal.hidden = true;
});

chatForm.addEventListener("submit", (e) => {
  e.preventDefault();
  const messageInput = e.target.elements.message;
  sendMessage(messageInput.value);
  messageInput.value = "";
  messageInput.focus();
});

interestInput.addEventListener("change", () => {
  interestInput.value = extractLetters(interestInput.value);
});
usernameInput.addEventListener("change", () => {
  usernameInput.value = removeNonLetters(usernameInput.value);
});

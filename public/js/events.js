findPartner.addEventListener("click", () => {
    appendMessage("System", "Looking for partner...");
    toggleLoading(findPartner, true);
    setTimeout(() => {
      socket.emit("findPartner");
      toggleLoading(findPartner, false);
      swapButtons();
    }, 1000);
  });
  
  disconnectPartner.addEventListener("click", () => {
    if (isPaired) {
      disconnectText.innerText = "Are you sure you want to disconnect from your partner?";
    } else {
      disconnectText.innerText = "Are you sure you want to disconnect looking for a partner?";
    }
    disconnectModal.hidden = false;
  });
  
  disconnectYes.addEventListener("click", () => {
    socket.emit("partnerDisconnect");
    appendMessage("System", "You Disconnected...");
    swapButtons();
    disableButtons(true);
    disconnectModal.hidden = true;
    isPaired = false;
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
  
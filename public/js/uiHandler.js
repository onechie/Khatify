// ---- Message Creation Functions ---- //

/**
 * Creates and appends a system message to the chat box.
 * @param {string} message - The system message to display.
 */
const createSystemMessage = (message) => {
  const messageElement = document.createElement("div");
  messageElement.innerHTML = `
    <p class="text-center text-xs pb-2 text-neutral-500">${message}</p>
  `;
  appendMessageToChatBox(messageElement);
};

/**
 * Creates and appends a user's message to the chat box.
 * @param {string} message - The message to display.
 * @param {string} time - The time the message was sent.
 */
const createYourMessage = (message, time) => {
  const messageElement = document.createElement("div");
  messageElement.innerHTML = `
    <div class="flex flex-col items-end pb-1">
      ${showYourName ? `<p class="text-neutral-500 text-xs px-2">You</p>` : ""}
      <div class="px-3 py-2 bg-purple-500 max-w-[80%] w-fit rounded-lg">
        <p class="text-wrap break-words max-w-full text-sm">${message}</p>
        <p class="text-nowrap text-neutral-300 text-end text-xs">${time}</p>
      </div>
    </div>
  `;
  showStrangerName = true;
  showYourName = false;
  appendMessageToChatBox(messageElement);
};

/**
 * Creates and appends a stranger's message to the chat box.
 * @param {string} message - The message to display.
 * @param {string} time - The time the message was sent.
 * @param {string} username - The username of the sender.
 */
const createStrangerMessage = (message, time, username) => {
  const messageElement = document.createElement("div");
  messageElement.innerHTML = `
    <div class="flex flex-col pb-2">
      ${
        showStrangerName
          ? `<p class="text-neutral-500 text-xs px-2">${
              username || "Stranger"
            }</p>`
          : ""
      }
      <div class="px-3 py-2 bg-neutral-900 max-w-[80%] w-fit rounded-lg">
        <p class="text-wrap break-words text-sm">${message}</p>
        <p class="text-nowrap text-neutral-500 text-end text-xs">${time}</p>
      </div>
    </div>
  `;
  showStrangerName = false;
  showYourName = true;
  appendMessageToChatBox(messageElement);
};

/**
 * Appends a message element to the chat box and scrolls to the bottom.
 * @param {HTMLElement} messageElement - The message element to append.
 */
const appendMessageToChatBox = (messageElement) => {
  chatBox.appendChild(messageElement);
  chatBox.scrollTop = chatBox.scrollHeight;
};

// ---- Interest List Functions ---- //

/**
 * Updates the interest list with new interests.
 * @param {Array<string>} interests - An array of interest strings.
 */
const updateInterestList = (interests) => {
  interestList.innerHTML = "";
  interests.forEach((interest) => {
    const interestItem = document.createElement("div");
    interestItem.className =
      "text-xs flex items-center bg-white text-neutral-900 p-1 rounded-md hover:bg-neutral-200 hover:cursor-pointer";
    interestItem.innerHTML = `
      <div class="ps-1 pe-2">${interest}</div>
      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="size-3">
        <path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12" />
      </svg>
    `;
    interestList.appendChild(interestItem);
    interestItem.addEventListener("click", () => {
      if (!isPaired) {
        interestList.removeChild(interestItem);
        interests = interests.filter(
          (thisInterest) => thisInterest !== interest
        );
        setSessionData("interest", interests);
      }
    });
  });
};

// ---- UI State Functions ---- //

/**
 * Toggles the visibility of the find partner and disconnect buttons.
 */
const swapButtons = () => {
  findPartner.hidden = !findPartner.hidden;
  disconnectPartner.hidden = !disconnectPartner.hidden;
};

/**
 * Enables or disables the message input and send button.
 * @param {boolean} shouldDisable - Whether to disable or enable the buttons.
 */
const disableButtons = (shouldDisable) => {
  messageInput.disabled = shouldDisable;
  messageButton.disabled = shouldDisable;
};

/**
 * Enables or disables the username and interest inputs.
 * @param {boolean} shouldDisable - Whether to disable or enable the inputs.
 */
const disableInputs = (shouldDisable) => {
  usernameInput.disabled = shouldDisable;
  interestInput.disabled = shouldDisable;
};

/**
 * Toggles the loading state of a button element.
 * @param {HTMLElement} element - The button element.
 * @param {boolean} on - Whether to show the loading state.
 */
const toggleLoading = (element, on) => {
  if (on) {
    element.disabled = true;
    element.querySelector(".icon").style.display = "none";
    element.querySelector(".loading").style.display = "block";
  } else {
    element.disabled = false;
    element.querySelector(".icon").style.display = "block";
    element.querySelector(".loading").style.display = "none";
  }
};

// ---- Typing Indicator Functions ---- //

/**
 * Displays a typing animation in the chat box.
 * @param {string} username - The username of the person typing.
 */
const createTyping = (username) => {
  loadingElement.innerHTML = `
    <div class="flex flex-col pb-2">
      ${
        showStrangerName
          ? `<p class="text-neutral-500 text-xs px-2">${
              username || "Stranger"
            }</p>`
          : ""
      }
      <div class="px-3 py-2 bg-neutral-900 max-w-[80%] w-fit rounded-lg flex items-center gap-2">
        <div class='h-2 w-2 bg-neutral-500 rounded-full animate-bounce [animation-delay:-0.3s]'></div>
        <div class='h-2 w-2 bg-neutral-500 rounded-full animate-bounce [animation-delay:-0.15s]'></div>
        <div class='h-2 w-2 bg-neutral-500 rounded-full animate-bounce'></div>
      </div>
    </div>
  `;
  appendMessageToChatBox(loadingElement);
};

/**
 * Removes the typing animation from the chat box.
 */
const removeTyping = () => {
  loadingElement.remove();
};

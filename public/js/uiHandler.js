const createSystemMessage = (message) => {
  const messageElement = document.createElement("div");
  messageElement.innerHTML = `
        <p class="text-center pb-2 text-neutral-500">${message}</p>
      `;
  chatBox.appendChild(messageElement);
  chatBox.scrollTop = chatBox.scrollHeight;
};

const createYourMessage = (message, time) => {
  const messageElement = document.createElement("div");
  messageElement.innerHTML = `
        <div class="flex flex-col items-end pb-1">
        ${
          showYourName ? `<p class="text-neutral-500 text-sm px-2">You</p>` : ""
        }
            <div class="px-3 py-2 bg-purple-500 max-w-[80%] w-fit rounded-lg">
                <p class="text-wrap break-words max-w-full">${message}</p>
                <p class="text-nowrap text-neutral-300 text-end text-sm">${time}</p>
            </div>
        </div>
      `;
  showStrangerName = true;
  showYourName = false;
  chatBox.appendChild(messageElement);
  chatBox.scrollTop = chatBox.scrollHeight;
};

const createStrangerMessage = (message, time, username) => {
  const messageElement = document.createElement("div");
  messageElement.innerHTML = `
    <div class="flex flex-col pb-2">
    ${
      showStrangerName
        ? `<p class="text-neutral-500 text-sm px-2">${
            username || "Stranger"
          }</p>`
        : ""
    }
      <div class="px-3 py-2 bg-neutral-900 max-w-[80%] w-fit rounded-lg ">
        <p class="text-wrap break-words">${message}</p>
        <p class="text-nowrap text-neutral-300 text-end text-sm">${time}</p>
      </div>
    </div>
  `;
  showStrangerName = false;
  showYourName = true;
  chatBox.appendChild(messageElement);
  chatBox.scrollTop = chatBox.scrollHeight;
};

const swapButtons = () => {
  findPartner.hidden = !findPartner.hidden;
  disconnectPartner.hidden = !disconnectPartner.hidden;
};

const disableButtons = (shouldDisable) => {
  messageInput.disabled = shouldDisable;
  messageButton.disabled = shouldDisable;
};

const disableInputs = (shouldDisable) => {
  usernameInput.disabled = shouldDisable;
  interestInput.disabled = shouldDisable;
};

const toggleLoading = (element, on) => {
  if (on) {
    element.disabled = true;
    element.querySelector(".text").style.display = "none";
    element.querySelector(".loading").style.display = "block";
  } else {
    element.disabled = false;
    element.querySelector(".text").style.display = "block";
    element.querySelector(".loading").style.display = "none";
  }
};

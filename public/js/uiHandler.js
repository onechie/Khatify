const createSystemMessage = (message) => {
  const messageElement = document.createElement("div");
  messageElement.innerHTML = `
        <p class="text-center text-xs pb-2 text-neutral-500">${message}</p>
      `;
  chatBox.appendChild(messageElement);
  chatBox.scrollTop = chatBox.scrollHeight;
};

const createYourMessage = (message, time) => {
  const messageElement = document.createElement("div");
  messageElement.innerHTML = `
        <div class="flex flex-col items-end pb-1">
        ${
          showYourName ? `<p class="text-neutral-500 text-xs px-2">You</p>` : ""
        }
            <div class="px-3 py-2 bg-purple-500 max-w-[80%] w-fit rounded-lg">
                <p class="text-wrap break-words max-w-full text-sm">${message}</p>
                <p class="text-nowrap text-neutral-300 text-end text-xs">${time}</p>
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
        ? `<p class="text-neutral-500 text-xs px-2">${
            username || "Stranger"
          }</p>`
        : ""
    }
      <div class="px-3 py-2 bg-neutral-900 max-w-[80%] w-fit rounded-lg ">
        <p class="text-wrap break-words text-sm">${message}</p>
        <p class="text-nowrap text-neutral-500 text-end text-xs">${time}</p>
      </div>
    </div>
  `;
  showStrangerName = false;
  showYourName = true;
  chatBox.appendChild(messageElement);
  chatBox.scrollTop = chatBox.scrollHeight;
};

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

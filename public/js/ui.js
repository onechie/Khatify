const chatBox = document.getElementById("chat-box");
const chatForm = document.getElementById("chat-form");
const onlineUsers = document.getElementById("online-users");
const findPartner = document.getElementById("find-partner");
const disconnectPartner = document.getElementById("disconnect-partner");
const messageInput = document.getElementById("message-input");
const messageButton = document.getElementById("message-send");
const disconnectModal = document.getElementById("disconnect-modal");
const disconnectYes = document.getElementById("disconnect-yes");
const disconnectNo = document.getElementById("disconnect-no");
const disconnectText = document.getElementById("disconnect-text");
const hamburgerMenu = document.getElementById("hamburger-menu");
const collapsibleContent = document.getElementById("collapsible-content");
const usernameInput = document.getElementById("username-input");
const interestInput = document.getElementById("interest-input");

let showStrangerName = true;
let showYourName = true;

hamburgerMenu.addEventListener("click", () => {
  collapsibleContent.classList.toggle("hidden");
});

function appendMessage(user, message, time, username = "") {
  const messageElement = document.createElement("div");
  if (user.toLowerCase() === "stranger") {
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
  } else if (user.toLowerCase() === "you") {
    messageElement.innerHTML = `
        <div class="flex flex-col items-end pb-1">
        ${
          showYourName
            ? `<p class="text-neutral-500 text-sm px-2">${
                username || "You"
              }</p>`
            : ""
        }
            <div class="px-3 py-2 bg-purple-500 max-w-[80%] w-fit rounded-lg">
                <p class="text-wrap break-words max-w-full">${message}</p>
                <p class="text-nowrap text-neutral-300 text-end text-sm">${time}</p>
            </div>
        </div>
      `;
    showStrangerName = true;
    showYourName = false;
  } else {
    messageElement.innerHTML = `
        <p class="text-center pb-2 text-neutral-500">${message}</p>
      `;
  }
  chatBox.appendChild(messageElement);
  chatBox.scrollTop = chatBox.scrollHeight;
}

function swapButtons() {
  findPartner.hidden = !findPartner.hidden;
  disconnectPartner.hidden = !disconnectPartner.hidden;
}

function disableButtons(shouldDisable) {
  messageInput.disabled = shouldDisable;
  messageButton.disabled = shouldDisable;
}

function disableInputs(shouldDisable) {
  usernameInput.disabled = shouldDisable;
  interestInput.disabled = shouldDisable;
}

function toggleLoading(element, on) {
  if (on) {
    element.disabled = true;
    element.querySelector(".text").style.display = "none";
    element.querySelector(".loading").style.display = "block";
  } else {
    element.disabled = false;
    element.querySelector(".text").style.display = "block";
    element.querySelector(".loading").style.display = "none";
  }
}

function getCurrentTime() {
  const now = new Date();

  let hours = now.getHours();
  const minutes = now.getMinutes();
  const period = hours >= 12 ? "PM" : "AM";

  hours = hours % 12 || 12;
  const formattedMinutes = minutes < 10 ? `0${minutes}` : minutes;

  return `${hours}:${formattedMinutes} ${period}`;
}
function removeNonLetters(word) {
  return word.replace(/[^a-zA-Z]/g, "");
}
function extractLetters(input) {
  const words = input.split(",");
  const uniqueWords = new Set(words.map((word) => removeNonLetters(word)));
  const result = Array.from(uniqueWords);
  return result;
}

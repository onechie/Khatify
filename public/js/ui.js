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

function appendMessage(user, message, time) {
  const messageElement = document.createElement("div");
  if (user.toLowerCase() === "stranger") {
    messageElement.innerHTML = `
    <div class="flex flex-col pb-2">
      <div class="px-4 py-3 bg-neutral-900 max-w-[80%] w-fit rounded-xl">
        <p class="text-wrap break-words">${message}</p>
        <p class="text-neutral-300 text-end">${time}</p>
      </div>
    </div>
  `;
  } else if (user.toLowerCase() === "you") {
    messageElement.innerHTML = `
        <div class="flex flex-col items-end pb-2">
            <div class="px-4 py-3 bg-purple-500 max-w-[80%] w-fit rounded-xl">
                <p class="text-wrap break-words">${message}</p>
                <p class="text-neutral-300 text-end">${time}</p>
            </div>
        </div>
      `;
  } else {
    messageElement.innerHTML = `
        <p class="text-center pb-2 text-neutral-300">${message}</p>
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

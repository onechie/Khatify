// ---- DOM Elements ---- //
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
const interestList = document.getElementById("interest-list");
const typingAnimation = document.getElementById("typing-animation");

// ---- Dynamic Elements ---- //
const loadingElement = document.createElement("div");

// ---- Socket Connection ---- //
const socket = io();

// ---- Application State ---- //
let userRoomId = null;
let isPaired = false;
let showStrangerName = true;
let showYourName = true;

// ---- Typing Indicator ---- //
let typingTimeout;
let isTyping = false;

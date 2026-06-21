const socket = io();

const chatBox = document.getElementById("chat-box");
const messageInput = document.getElementById("message-input");
const sendButton = document.getElementById("send-button");
const usernameInput = document.getElementById("username-input");
const joinButton = document.getElementById("join-button");
const chatContainer = document.getElementById("chat-container");
const namePrompt = document.getElementById("name-prompt");
const usersCount = document.getElementById("usersCount");
const typingIndicator = document.getElementById("typingIndicator");

let username = "";

/* JOIN CHAT */

joinButton.addEventListener("click", () => {

    username = usernameInput.value.trim();

    if (username === "") {
        alert("Please enter your name");
        return;
    }

    window.username = username;

    socket.emit("userJoined", username);

    namePrompt.style.display = "none";
    chatContainer.style.display = "flex";

    messageInput.focus();

    addSystemMessage(`Welcome ${username} 👋`);
});

/* ENTER TO JOIN */

usernameInput.addEventListener("keypress", (e) => {
    if (e.key === "Enter") {
        joinButton.click();
    }
});

/* SEND MESSAGE */

function sendMessage() {

    const message = messageInput.value.trim();

    if (message === "" || username === "") {
        return;
    }

    socket.emit("chatMessage", {
        username,
        message
    });

    messageInput.value = "";
}

/* BUTTON SEND */

sendButton.addEventListener("click", sendMessage);

/* ENTER TO SEND */

messageInput.addEventListener("keypress", (e) => {
    if (e.key === "Enter") {
        sendMessage();
    }
});

/* TYPING EVENT */

messageInput.addEventListener("input", () => {

    if (username) {
        socket.emit("typing", username);
    }
});

/* RECEIVE MESSAGE */

socket.on("chatMessage", ({ username, message }) => {

    const time = new Date().toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit"
    });

    const messageElement = document.createElement("div");

    messageElement.classList.add("message");

    if (
        username === window.username &&
        username !== "System"
    ) {
        messageElement.classList.add("own-message");
    }

    messageElement.innerHTML = `
        <strong>${username}</strong>
        <br>
        ${message}
        <br>
        <small>${time}</small>
    `;

    chatBox.appendChild(messageElement);

    chatBox.scrollTop = chatBox.scrollHeight;
});

/* ONLINE USERS */

socket.on("usersCount", (count) => {

    usersCount.innerText =
        `Online Users: ${count}`;
});

/* TYPING INDICATOR */

socket.on("typing", (user) => {

    if (user === window.username) return;

    typingIndicator.innerText =
        `${user} is typing...`;

    clearTimeout(window.typingTimeout);

    window.typingTimeout = setTimeout(() => {

        typingIndicator.innerText = "";

    }, 1500);
});

/* SYSTEM MESSAGE */

function addSystemMessage(text) {

    const div = document.createElement("div");

    div.classList.add("message");

    div.innerHTML = `
        <strong>System</strong>
        <br>
        ${text}
    `;

    chatBox.appendChild(div);

    chatBox.scrollTop = chatBox.scrollHeight;
}
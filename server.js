const express = require("express");
const http = require("http");
const socketIo = require("socket.io");

const app = express();
const server = http.createServer(app);

const io = socketIo(server);

app.use(express.static("public"));

let onlineUsers = 0;
const users = {};

io.on("connection", (socket) => {

    console.log(
        "User Connected:",
        socket.id
    );

    onlineUsers++;

    io.emit(
        "usersCount",
        onlineUsers
    );

    /* USER JOINED */

    socket.on(
        "userJoined",
        (username) => {

            users[socket.id] =
            username;

            io.emit(
                "chatMessage",
                {
                    username: "System",
                    message:
                    `${username} joined the chat 🚀`
                }
            );

        }
    );

    /* CHAT MESSAGE */

    socket.on(
        "chatMessage",
        ({ username, message }) => {

            io.emit(
                "chatMessage",
                {
                    username,
                    message
                }
            );

        }
    );

    /* USER TYPING */

    socket.on(
        "typing",
        (username) => {

            socket.broadcast.emit(
                "typing",
                username
            );

        }
    );

    /* USER DISCONNECT */

    socket.on(
        "disconnect",
        () => {

            console.log(
                "User Disconnected:",
                socket.id
            );

            const username =
            users[socket.id];

            if(username){

                io.emit(
                    "chatMessage",
                    {
                        username:
                        "System",

                        message:
                        `${username} left the chat 👋`
                    }
                );

                delete users[socket.id];
            }

            onlineUsers--;

            io.emit(
                "usersCount",
                onlineUsers
            );

        }
    );

});

const PORT = 3000;

server.listen(
    PORT,
    () => {

        console.log(
            `Server running on http://localhost:${PORT}`
        );

    }
);
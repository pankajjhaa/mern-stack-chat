const express = require('express')
const env = require('dotenv')
const user = require("./routes/user");
const message = require("./routes/message");
const chat = require("./routes/chat");
const connectDatabase = require("./config/database");
const {notFound, errorHandler} = require("./middleware/ErrorMiddleware");
const path = require("path");

const app = express()

app.use(express.json())

env.config()

connectDatabase()
app.use(function (req, res, next) {
    res.setHeader('Access-Control-Allow-Origin', 'http://127.0.0.1:5173');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');
    res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type');
    res.setHeader('Access-Control-Allow-Credentials', true);
    res.setHeader("Access-Control-Allow-Headers", "Access-Control-Allow-Headers, Authorization, Origin,Accept, X-Requested-With, Content-Type, Access-Control-Request-Method, Access-Control-Request-Headers");
    next();
});


// app.get('/', (req, res) => {
//     res.send("Api is running")
// })


app.use('/api/chats', chat)
app.use('/api/user', user)
app.use('/api/message', message)

// --------------------------deployment------------------------------

const __dirname1 = path.resolve();

console.log(process.env.NODE_ENV)
if (process.env.NODE_ENV === "production") {
    app.use(express.static(path.join(__dirname1, "/client/dist")));

    app.get("*", (req, res) =>
        res.sendFile(path.resolve(__dirname1, "client", "dist", "index.html"))
    );
} else {
    app.get("/", (req, res) => {
        res.send("API is running..");
    });
}

// --------------------------deployment------------------------------

app.use(notFound)
app.use(errorHandler)

const PORT = process.env.PORT || 5000

const server = app.listen(PORT)

const io = require("socket.io")(server, {
    pingTimeout: 60000,
    cors: {
        origin: "http://127.0.0.1:5173",
        // credentials: true,
    },
});

io.on("connection", (socket) => {
    console.log("Connected to socket.io");
    socket.on("setup", (userData) => {
        socket.join(userData._id);
        socket.emit("connected");
    });

    socket.on("join chat", (room) => {
        socket.join(room);
        console.log("User Joined Room: " + room);
    });

    socket.on("typing", (room) => socket.in(room).emit("typing"));
    socket.on("stop typing", (room) => socket.in(room).emit("stop typing"));

    socket.on("new message", (newMessageReceived) => {
        const chat = newMessageReceived.chat;

        if (!chat.users) return console.log("chat.users not defined");

        chat.users.forEach((user) => {
            if (user._id === newMessageReceived.sender._id) return;

            socket.in(user._id).emit("message received", newMessageReceived);
        });
    });

    socket.off("setup", () => {
        console.log("USER DISCONNECTED");
        socket.leave(userData._id);
    });
});


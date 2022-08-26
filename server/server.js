const express = require('express')
const env = require('dotenv')
const user = require("./routes/user");
const chat = require("./routes/chat");
const connectDatabase = require("./config/database");
const {notFound, errorHandler} = require("./middleware/ErrorMiddleware");


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


app.get('/', (req, res) => {
    res.send("Api is running")
})


app.use('/api/chats', chat)
app.use('/api/user', user)

app.use(notFound)
app.use(errorHandler)

const PORT = process.env.PORT || 5000

app.listen(PORT)


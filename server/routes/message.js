const express = require("express");
const {
    allMessages,
    sendMessage,
} = require("../controllers/MessageController");
const {protectedRoute} = require("../middleware/AuthMiddleware");

const router = express.Router();

router.route("/:chatId").get(protectedRoute, allMessages);
router.route("/").post(protectedRoute, sendMessage);

module.exports = router;

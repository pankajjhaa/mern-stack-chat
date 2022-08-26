const express = require('express')
const {protectedRoute} = require("../middleware/AuthMiddleware");
const {accessChat, getChats, createGroupChat, renameGroup, removeFromGroup, addToGroup} = require("../controllers/ChatController");

const router = express.Router()

router.route("/").post(protectedRoute, accessChat)
router.route("/").get(protectedRoute, getChats)
router.route("/createGroupChat").post(protectedRoute, createGroupChat)
router.route("/renameGroup").put(protectedRoute, renameGroup)
router.route("/removeFromGroup").put(protectedRoute, removeFromGroup)
router.route("/addToGroup").put(protectedRoute, addToGroup)

module.exports = router

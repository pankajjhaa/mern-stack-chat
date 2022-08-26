const express = require('express')
const {register, login, users} = require("../controllers/UserController");
const {protectedRoute} = require("../middleware/AuthMiddleware");

const router = express.Router()

router.route('/').get(protectedRoute, users)
router.route('/register').post(register)
router.route('/login').post(login)



module.exports = router

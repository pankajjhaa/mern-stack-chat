const asyncHandler = require('express-async-handler');
const User = require("../models/User");
const generateToken = require("../config/jwt");

const register = asyncHandler(async (req, res) => {
    const {name, email, password, image} = req?.body

    if (!name || !email || !password) {
        res.status(400)
        throw new Error("Enter all fields")
    }

    const userExists = await User.findOne({email})

    if (userExists) {
        res.status(400)
        throw new Error("User already exists")
    }

    const user = await User.create({
        name,
        email,
        password,
        image
    })

    if (user) {
        res.status(201).json({
            _id: user._id,
            name: user.name,
            email: user.email,
            image: user.image,
            token: generateToken(user._id)
        })
    } else {
        res.status(400)
        throw new Error("Failed to create user")
    }
})


const login = asyncHandler(async (req, res) => {
    const {email, password} = req.body

    const user = await User.findOne({email})

    if (user && (await user.matchPassword(password))) {
        res.status(200).json({
            _id: user._id,
            name: user.name,
            email: user.email,
            image: user.image,
            token: generateToken(user._id)
        })
    } else {
        res.status(400)
        throw new Error("Invalid email password")
    }
})


const users = asyncHandler(async (req, res) => {
    const searchKey = req.query.search ? {
        $or: [
            {name: {$regex: req.query.search, $options: "i"}},
            {email: {$regex: req.query.search, $options: "i"}}
        ]
    } : {}

    const users = await User.find(searchKey).find(({id: {$ne: req.user._id}}))
    res.send(users)
})

module.exports = {register, login, users};


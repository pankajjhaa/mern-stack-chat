const mongoose = require('mongoose')
const bcrypt = require("bcryptjs");

const UserSchema = mongoose.Schema({
    name: {type: String, required: true},
    email: {type: String, required: true, unique: true},
    password: {type: String, required: true},
    image: {type: String, default: "https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_960_720.png"}
}, {timestamps: true})

UserSchema.methods.matchPassword = async function (password){
    return await bcrypt.compare(password, this.password)
}

UserSchema.pre('save', async function (next) {
    if (!this.isModified){
        next()
    }

    const salt = await bcrypt.genSalt()
    this.password = await bcrypt.hash(this.password, salt)

})
const User = mongoose.model("User", UserSchema)

module.exports = User

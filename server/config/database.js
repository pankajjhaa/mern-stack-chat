const mongoose = require('mongoose')

const connectDatabase = async () => {
    try {
        const connection = await mongoose.connect(process.env.MONGO_URI, {
            useUnifiedTopology: true
        })

        console.log('connected', connection.connection.host)
    } catch (e) {
        console.log("Error", e.message)
        process.exit()
    }
}

module.exports = connectDatabase

require('dotenv').config();
const mongoose = require('mongoose')

async function connect() {
    try {
        await mongoose.connect('mongodb+srv://nguyen29092000:nguyen20026293@simpletourism.ffyky.mongodb.net/simpletourism?retryWrites=true&w=majority')
        // await mongoose.connect(process.env.MONGODB_URL)
        console.log("Connect MongoDB Successfully")
    } catch (error) {
        console.log("Connect MongoDB Failed")
    }
}

module.exports = { connect }
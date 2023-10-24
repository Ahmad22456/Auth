const mongoose = require('mongoose')

const userSchema = new mongoose.Schema({
    username: {
        type: String,
        unique: true,
        required: true
    },
    pass: {
        type: String,
        unique: true,
        required: true
    }
})

module.exports = mongoose.model('account', userSchema)
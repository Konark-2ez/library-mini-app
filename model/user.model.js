const mongoose = require('mongoose');
const userSchema = mongoose.Schema({
    Name: String,
    Email: String,
    Password: String,
    Role:[{
        type: String,
        enum: ["CREATOR", "VIEWER", "VIEW_ALL"]
    }],

}, {
    versionKey: false
})


const User = mongoose.model("users", userSchema);

module.exports = {User}
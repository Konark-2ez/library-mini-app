const mongoose = require('mongoose');
const mongoURL = "mongodb+srv://konark:konark@cluster0.m3plh1e.mongodb.net/library?retryWrites=true&w=majority"
const connection = mongoose.connect(mongoURL)
module.exports={
    connection
}
const express= require('express');
require('dotenv').config();
const { connection } = require('./config/db');
const { userRouter } = require('./routes/user.route');
const { bookRouter } = require('./routes/book.route');
const server=express()
const PORT = 3000
server.use(express.json())

server.get("/",(req,res)=>{
    res.send("Welcome to Library app")
})


server.use("/user",userRouter)
server.use("/library",bookRouter)

server.listen(PORT,async()=>{
    try {
        await connection
        console.log("Connected to MongoDB")
    } catch (error) {
        console.log(error.message)
    }
    console.log("Connected to server")
})
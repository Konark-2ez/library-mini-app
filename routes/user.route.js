const express = require('express')
const jwt = require("jsonwebtoken")
const userRouter=express.Router()
const {User}=require('../model/user.model');
userRouter.post("/signup", async (req, res) => {
    const { Name, Email, Password, Role } = req.body;
    const existingUser = await User.findOne({ Email });
  
    if (existingUser) {
      return res.status(409).json({ msg: "User already exists. Please log in." });
    } else {
      try {
        bcrypt.hash(Password, 4, async (err, hash) => {
          if (err) {
            return res.status(500).json({ error: err.message });
          }
          const newUser = new User({ Name, Email, Password: hash, Role });
          await newUser.save();
  
          res.status(201).json({ msg: "User is registered" });
        });
      } catch (err) {
        res.status(500).json({ error: err.message });
      }
    }
  })


  userRouter.post("/login", async (req, res) => {
    const { Email, Password } = req.body;
    try {
      const user = await User.find({ Email })
      if (user.length > 0) {
        bcrypt.compare(Password, user[0].Password, (err, result) => {
          if (result) {
            const accessToken = jwt.sign({ id: user[0]._id }, "Token", { expiresIn: "1d" })
            res.status(200).send({
              "msg": "Login Succesfull", "Token": accessToken
            })
          } else {
            res.status(400).send({ "msg": "Invalid Password" })
          }
        })
      } else {
        res.status(404).send({ "msg": "Email does not exist" })
      }
    } catch (error) {
      res.status(400).send({ "error": error.message })
    }
  })
  

  module.exports={
    userRouter
  }
const express = require('express');
const { Book} = require('../model/book.model');
const { auth } = require('../middlewares/auth');
const { User } = require('../model/user.model');
const bookRouter = express.Router();


// Adding bok in database
BookRouter.post("/books", auth, async (req, res) => {
    const { title, author } = req.body;
    const id = req.body.userid;
    const user = await User.findById(id);
    const roles = user.Role;
    try {
        const BookAlreadyAvailable = await Book.findOne({ title })
        if (BookAlreadyAvailable) {
            return res.status(200).send({ "msg": "Book already available in liabrary data" });
        }
        if (roles && roles.includes("CREATOR")) {
            const data = new Book({ title, author, addedBy: id });
            await data.save();
            res.status(200).send({ "msg": "Book data stored succefully" })
        } else {
            res.status(201).send({ "msg": "You are not authorized to add a book" })
        }
    } catch (error) {
        res.status(400).send({ "error": error.message })
    }
})

// getting user specific books from database
BookRouter.get("/books", auth, async (req, res) => {
    const id = req.body.userid;
    const user = await User.findById(id);
    const roles = user.Role;

    try {
        // Additional logic for handling the 'old' query parameter
        const isOld = req.query.old === '1';
        const isNew = req.query.new === '1';
        console.log(isOld)
        if (isOld && roles && roles.includes("VIEWER")) {
            // Get books created 10 minutes or more ago
            const thresholdTime = new Date(Date.now() - 10 * 60  * 1000);

            const oldBooks = await Book.find({addedBy: id, addedAt: { $lte: thresholdTime } });

            if (oldBooks.length === 0) {
                res.send("No old books found");
            } else {
                res.status(200).send({ "Old Books you added": oldBooks });
            }
        } else if(isNew && roles && roles.includes("VIEWER")){
            const thresholdTime = new Date(Date.now() - 10 * 60 * 1000);
            const newBooks = await Book.find({ addedBy: id, addedAt: { $gte: thresholdTime} });

            if (newBooks.length === 0) {
                res.send("No new books found");
            } else {
                res.status(200).send({ "New Books you added": newBooks });
            }
        }else if (roles && roles.includes("VIEWER")) {
            // Get books added by the user
            const userBooks = await Book.find({ addedBy: id });

            if (userBooks.length === 0) {
                res.send("No Book found");
            } else {
                res.status(200).send({ "Books you added": userBooks });
            }
        }else{
            res.status(201).send({ "msg": "You are not authorized to view books" });
        }
    } catch (error) {
        res.status(400).send({ "error": error.message });
    }
});

// Getting all books data
BookRouter.get("/allBooks", auth, async (req, res) => {
    const id = req.body.userid;
    const user = await User.findById(id);
    const roles = user.Role;
    try {
        if (roles && roles.includes("VIEW_ALL")) {
            const data = await Book.find()
            if (data.length === 0) {
                res.send("No Book found")
            } else {
                res.status(200).send({ "All Books": data })
            }
        } else {
            res.status(201).send({ "msg": "You are not authorized to View a book" })
        }
    } catch (error) {
        res.status(400).send({ "error": error.message })
    }
})

module.exports = {
    bookRouter
}

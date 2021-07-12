'use strict';

const express = require('express');
require('dotenv').config();
const mongoose = require('mongoose');

const cors = require('cors');

const server = express();
server.use(cors());
const PORT = process.env.PORT;

mongoose.connect('mongodb://localhost:27017/book', { useNewUrlParser: true, useUnifiedTopology: true });

const bookSchema = new mongoose.Schema({
    name: String,
    description: String,
    status: String
});

const userSchema = new mongoose.Schema({
    email: String,
    book: [bookSchema]
});

const bookModel = mongoose.model('books', bookSchema);
const userModel = mongoose.model('user', userSchema);

function seedBooksCollection() {
    const bookDb = new bookModel({
        name: 'The Growth Mindset',
        description: 'Dweck coined the terms fixed mindset and growth mindset to describe the underlying beliefs people have about learning and intelligence. When students believe they can get smarter, they understand that effort makes them stronger. Therefore they put in extra time and effort, and that leads to higher achievement.',
        status: 'FAVORITE FIVE'
    })
    console.log(bookDb);
    bookDb.save();
}
seedBooksCollection();

function seedUserCollection() {
    const UserDb = new userModel({
        email: 'algourabrar@gmail.com',
        book: [
            {
                name: 'The Growth Mindset',
                description: 'Dweck coined the terms fixed mindset and growth mindset to describe the underlying beliefs people have about learning and intelligence. When students believe they can get smarter, they understand that effort makes them stronger. Therefore they put in extra time and effort, and that leads to higher achievement.',
                status: 'FAVORITE FIVE'
            },
            {
                name: 'The Momnt of Lift', 
                description: 'Melinda Gates shares her how her exposure to the poor around the world has established the objectives of her foundation.',
                 status: 'RECOMMENDED TO ME'
            }
        ]
    })
    console.log(UserDb);
    UserDb.save();
}
seedUserCollection();

//http://localhost:3001/books?userEmail=algourabrar@gmail.com
server.get('/books', booksFun)
function booksFun(req, res) {
// let email = req.query.email;

let {userEmail}=req.query;
userModel.find({email:userEmail}, function(error,userData){
    if (error){
        res.send(error)

    }else{
        res.send(userData[0].book)
    }
})
}

server.listen(PORT, () => {
    console.log(`Listening on PORT ${PORT}`);
})

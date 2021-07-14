'use strict';

const express = require('express');
require('dotenv').config();
const mongoose = require('mongoose');

const cors = require('cors');

const server = express();
server.use(cors());
const PORT = process.env.PORT;
server.use(express.json())

mongoose.connect('mongodb://abrar:12345@cluster0-shard-00-00.bezrw.mongodb.net:27017,cluster0-shard-00-01.bezrw.mongodb.net:27017,cluster0-shard-00-02.bezrw.mongodb.net:27017/book?ssl=true&replicaSet=atlas-wtxjwi-shard-0&authSource=admin&retryWrites=true&w=majority', { useNewUrlParser: true, useUnifiedTopology: true });

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
// seedBooksCollection();

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
    // let userName = req.query.userName;

    let { userEmail } = req.query;
    userModel.find({ email: userEmail }, function (error, userData) {
        if (error) {
            res.send('error')
        } else {
            res.send(userData[0].book)
        }
    })

}
//http://localhost:3001/addBooks?userEmail=algorabrar@gmail.com&name=hhh&description=jjjj&status=kkkk
server.post('/addBooks', addBooksFun)

function addBooksFun(req, res) {

    console.log(req.body)

    let { userEmail, name, description, status } = req.body;

    userModel.find({ email: userEmail }, (error, userData) => {
        if (error) {
            res.send(error)
        } else {
            console.log('before adding', userData)
            userData[0].book.push({
                name: name,
                description: description,
                status: status
            })
            console.log('after adding', userData[0])
            userData[0].save();
            res.send(userData[0].book)
        }

    })
}
server.delete('/deleteBooks/:bookId', deleteBook)

function deleteBook(req, res) {

    console.log(req.params)
    console.log(req.query)

    let index = Number(req.params.bookId);

    console.log(index)

    let userEmail = req.query.userEmail;

    userModel.find({ email: userEmail }, (error, userData) => {

        if (error) { res.send('cant find user') }

        else {

            console.log('before deleting', userData[0].book)

               let newUserData = userData[0].book.filter((item,idx)=>{
                   if(idx !== index) {return item}
                // return idx!==index
               })
            // let newUserData = userData[0].book.splice(index, 1);
            userData[0].book = newUserData
            console.log('after deleting', userData[0].book)
            userData[0].save();
            res.send(userData[0].book)
        }

    })
}

server.listen(PORT, () => {
    console.log(`Listening on PORT ${PORT}`);
})

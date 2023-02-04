const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();

const doesExist = (username) => {
  let userswithsamename = users.filter((user) => user.username === username);
  if (userswithsamename.length > 0) {
    return true;
  } else {
    return false;
  }
}
public_users.post("/register", (req, res) => {
  const { username, password } = req.body;

  if (username && password) {
    if (!doesExist(username)) {
      users.push({ "username": username, "password": password });
      res.status(200).send({
        message: "User successfully registred. Now you can login"
      });
    } else {
      res.status(404).send({
        message: "User already exists!"
      });
    }
  } else {
    res.status(404).send({
      message: "Unable to register user."
    });
  }
});

// Get the book list available in the shop
public_users.get('/', function (req, res) {
  const result = JSON.stringify(books, null, 2)
  const result2 = JSON.parse(result)

  res.status(200).send({
    data: books
  });
});

// Get book details based on ISBN
public_users.get('/isbn/:isbn', function (req, res) {
  const { isbn } = req.params
  result = books[Number(isbn)]
  return res.status(200).send({
    data: result
  });
});

// Get book details based on author
public_users.get('/author/:author', function (req, res) {
  const { author } = req.params
  const result = Object.values(books)
  const authors = result.filter(r => r['author'] == author)
  return res.status(200).send({
    data: authors
  });
});

// Get all books based on title
public_users.get('/title/:title', function (req, res) {
  const { title } = req.params
  const result = Object.values(books)
  const book = result.filter(r => r['title'] == title)
  return res.status(200).send({
    data: book
  });
});

//  Get book review
public_users.get('/review/:isbn', function (req, res) {
  const { isbn } = req.params
  const bookReview = books[Number(isbn)]['reviews']
  return res.status(200).send({
    data: bookReview
  });
});

module.exports.general = public_users;

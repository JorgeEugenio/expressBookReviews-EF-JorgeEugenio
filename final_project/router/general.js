const express = require('express');
let { getBooks, getBookbyId, getBookByAuthor, getBookByTitle, getBookReviews } = require("./booksdb.js");

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
public_users.get('/', async (req, res) => {
  const books = await getBooks()
  res.status(200).send({
    data: books
  })
});

// Get book details based on ISBN
public_users.get('/isbn/:isbn', async (req, res) => {
  const { isbn } = req.params
  book = await getBookbyId(Number(isbn))
  return res.status(200).send({
    data: book
  });
});

// Get book details based on author
public_users.get('/author/:author', async (req, res) => {
  const { author } = req.params
  const book = await getBookByAuthor(author)
  return res.status(200).send({
    data: book
  });
});

// Get all books based on title
public_users.get('/title/:title', async (req, res) => {
  const { title } = req.params
  const book = await getBookByTitle(title)
  return res.status(200).send({
    data: book
  });
});

//  Get book review
public_users.get('/review/:isbn', async (req, res) => {
  const { isbn } = req.params
  const bookReview = await getBookReviews(isbn)
  return res.status(200).send({
    data: bookReview
  });
});

module.exports.general = public_users;

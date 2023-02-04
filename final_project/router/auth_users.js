const express = require('express');
const jwt = require('jsonwebtoken');
let {books} = require("./booksdb.js");
const regd_users = express.Router();

let users = [];

const isValid = (username) => { //returns boolean
  //write code to check is the username is valid
}

const authenticatedUser = async (username, password) => { //returns boolean
  let validusers = users.filter((user) => user.username === username && user.password === password)
  if (validusers.length > 0) {
    return true;
  } else {
    return false;
  }
}

//only registered users can login
regd_users.post("/login", async (req, res) => {
  const { username, password } = req.body;

  if (!username || !password) {
    return res.status(404).json({
      msg: "Error logging in"
    });
  }

  if (await authenticatedUser(username, password)) {
    let accessToken = jwt.sign({
      data: password
    }, 'access', { expiresIn: 60 * 10 });

    req.session.authorization = {
      accessToken, username
    }
    return res.status(200).send({
      msg: `User successfully logged in`
    });
  } else {
    return res.status(208).json({
      msg: "Invalid Login. Check username and password"
    });
  }
});

// Add a book review
regd_users.put("/auth/review/:isbn", (req, res) => {
  //Write your code here
  const {isbn} = req.params
  const {username, stars, comment} = req.body

  reviewsObject = books[Number(isbn)]['reviews']//iniciamente {}
  if (reviewsObject[username]) {
    books[Number(isbn)]['reviews'][username] = {stars, comment}
  }else{
    books[Number(isbn)]['reviews'][username] = {stars, comment}
  }

  res.status(200).send({
    data: JSON.parse(JSON.stringify(books[Number(isbn)]['reviews'][username]))
  })  
});
// Delete a book review
regd_users.delete("/auth/review/:isbn", (req, res) => {
  //Write your code here
  const {isbn} = req.params
  const {username} = req.body

  reviewsObject = books[Number(isbn)]['reviews']//iniciamente {}
  if (reviewsObject[username]) {
    delete books[Number(isbn)]['reviews'][username]
  }

  res.status(200).send({
    data: `the book with isbn: ${isbn} was deleted`
  })  
});

module.exports.authenticated = regd_users;
module.exports.isValid = isValid;
module.exports.users = users;

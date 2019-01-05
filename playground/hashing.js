const {SHA256} = require('crypto-js');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');

//
// var msg = 'I am user 3'
// var hash = SHA256(msg).toString();
//
// console.log(msg)
// console.log(hash)

const data = {
  date: 5
};

const token = jwt.sign(data, '123abc');
console.log(token);

const decoded = jwt.verify(token, '123abc');
console.log(decoded);

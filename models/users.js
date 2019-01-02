const {mongoose} = require('../server/db/mongoose');
const validator = require('validator');
const jwt = require('jsonwebtoken');
const _ = require('lodash');

const UserSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    minlength: 1,
    trim: true,
    unique: true,
    validate: {
      validator: validator.isEmail,
      message: '{VALUE} is not an email'
    }
  }, password: {
    type: String,
    minlength: 6,
    required: true
  }, tokens: [{
    access: {
      required: true,
      type: String
    }, token: {
      type: String,
      required: true
    }
  }]
})

UserSchema.statics.findByToken = function(token){
  var User = this;
  var decoded;

  try {
    var decoded = jwt.verify(token, 'abc123');
  } catch(e) {
    // return new Promise((resolve, reject) => {
    //   reject();
    // })
    return Promise.reject();
  }

  return User.findOne({
    '_id': decoded._id,
    'tokens.tokens': token,
    'tokens.access': 'auth'
  })
}

UserSchema.methods.toJSON = function () {
  var user = this;
  var userObj = user.toObject();

  return _.pick(userObj, ['email', '_id']);
}

UserSchema.methods.generateAuthToken = function () {
  var user = this;
  var access = 'auth';
  var token = jwt.sign({_id: user._id.toHexString(), access}, 'abc123').toString();

  user.tokens = user.tokens.concat([{access, token}]);

  return user.save().then(() => {
    return token
  })
}

var User = mongoose.model('User', UserSchema)

module.exports = {User};

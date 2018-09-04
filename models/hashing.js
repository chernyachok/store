const bcrypt = require('bcrypt-nodejs');
const User = require('./user');

module.exports.encryptPassword = function(encryptedPassword){
  return bcrypt.hashSync(encryptedPassword,bcrypt.genSaltSync(5), null);
};

module.exports.validPassword = function( current_email, validPassword, current_pass){
  return bcrypt.compareSync(current_pass, validPassword);
};

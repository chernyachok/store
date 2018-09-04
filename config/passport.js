const passport = require('passport');
var User = require('../models/user');
var LocalStrategy = require('passport-local').Strategy;
var hashed = require('../models/hashing');
const bcrypt = require('bcrypt-nodejs');
//const express_validator = require('express-validator');
 passport.serializeUser(function(user, done){
   done(null,user.id);
 });
 passport.deserializeUser(function(user_id, done){
   User.findById(user_id).then(function(data){
   done(null, data);
 });
 });
 passport.use('localsgn', new LocalStrategy({
   usernameField: 'email',
   passwordField:'password',
   passReqToCallback: true
 },function(req,email,password, done){
   req.checkBody('email', 'invalid email').notEmpty().isEmail();
   req.checkBody('password', 'invalid password').notEmpty().isLength({min:4});
   var errors = req.validationErrors();
   if(errors){
     var msgs = [];
     errors.forEach(function(item){
       msgs.push(item.msg);
     });
    return done(null, false, req.flash('error', msgs));
   }
   User.findOne({'email': email}, function(err, user){
     if(err){
       return done(err);
     }
     if(user ){
       return done(null,false,{ message: 'email is already in use'});
     }
     var newUser = new User();
     newUser.email = email;
     newUser.password = newUser.encryptPassword(password);
     newUser.save(function(err, data){
       if(err){
         return done(err);
       }
       if(data){
         return done(null, newUser );//data check parameter
       }
     })
   })
 }
));


passport.use('local-signin', new LocalStrategy({
  usernameField: 'email',//name field
  passwordField:'password',
  passReqToCallback: true
  },function(req,email,password, done){
    req.checkBody('email', 'enter email').notEmpty().isEmail();
    req.checkBody('password', 'enter password').notEmpty();
    var errors = req.validationErrors();
    if(errors){
      var msgs = [];
      errors.forEach(function(item){
        msgs.push(item.msg);
      });
     return done(null, false, req.flash('error', msgs));
   }
   User.findOne({'email': email}, function(err, user){
     if(user){
      // console.log(hashed.validPassword(user.email, user.password, password));
         if(hashed.validPassword(user.email, user.password, password)){
           return done(null, user);
         }
         else{
          return done(null,false,{ message: 'password not correct'});
        }
     }
     else{
        return done(null, false, { message: 'user not found'});
        }
   });
   
 }));

var express = require('express');
var router = express.Router();
var flash = require('connect-flash');
const passport = require('passport');
var csrf = require('csurf');
var Order = require('../models/order')
var Cart = require('../models/cart');
router.use(csrf());

router.use(flash());

var middleware = function(req,res,next){
  if(req.isAuthenticated()){
    return next();
  }else{
    res.redirect('/');
  }
}
var notloggedin = function(req,res,next){
  if(!req.isAuthenticated()){
    return next();
  }else{
    res.redirect('/');
  }
}

router.get('/',notloggedin ,function(req,res,next){

  res.redirect('/user/signup')// user redirects to /
})

router.get('/logout', middleware,function(req,res,next){
  req.logout();
  res.redirect('/');
})


router.get('/signup', notloggedin, function(req,res, next){
  var messages = req.flash('error');
  console.log(messages);
  res.render('user/signup', {csrfToken: req.csrfToken(), messages: messages, hasErrors: messages.length>0});
});

router.post('/signup',passport.authenticate  ('localsgn', {
  //  successRedirect: '/user/profile',
    failureRedirect:'/user/signup',
    failureFlash: true//try to check using next()
  }), function(req,res,next){
    if(req.session.oldUrl){
      var oldUrl = req.session.oldUrl;
      req.session.oldUrl = null;
      res.redirect(oldUrl);
    }else{
      res.redirect('/user/profile');
    }
    //possible redirect to signin after successfull signup not to return to oldUrl
  });
router.get('/profile',middleware, function(req,res,next){
  Order.find({user: req.user}, function(err,orders){
    if(err){
      return res.write('error');
    }
    var cart;
    orders.forEach(function(item){
      cart = new Cart(item.cart);
      item.items = cart.generateArray()
    })
    res.render('user/profile', {orders: orders} )
  })
  //console.log(req.session);
  //res.render('user/profile');
});
router.get('/signin', notloggedin,function(req,res, next){
  var messages = req.flash('error');
  console.log(messages);
  res.render('user/signin', {csrfToken: req.csrfToken(), messages: messages, hasErrors: messages.length>0});
});
router.post('/signin', passport.authenticate('local-signin', {
    //successRedirect: '/user/profile',
    failureRedirect:'/user/signin',
    failureFlash: true//try to check using next()
  }), function(req,res,next){
    if(req.session.oldUrl){
      var oldUrl = req.session.oldUrl;
      req.session.oldUrl = null;
      res.redirect(oldUrl);
    }else{
      res.redirect('/user/profile');
    }
  });



module.exports = router;

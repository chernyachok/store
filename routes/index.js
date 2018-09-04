 var express = require('express');
var router = express.Router();
var flash = require('connect-flash');
var model = require('../models/model');
var Cart = require('../models/cart.js');
var Order = require('../models/order');

router.use(flash());

/* GET home page. */
router.get('/', function(req, res, next) {
  console.log(req.user);
  var successMsg = req.flash('success')[0];
  model.find(function(err, products){
    var productChunk = [];
    var chunkSize = 3;
    for(var i=0; i<products.length; i+= chunkSize){
    productChunk.push(products.slice(i, i+chunkSize));
    }console.log('--chunk made--');
      res.render('shop/index', { title: 'Shopping Cart', products: productChunk, length: products.length, count: 1, successMsg: successMsg, noMessages: !successMsg });
  });
});

router.get('/to-shop-cart/:id', function(req,res,next){
  var productId = req.params.id;
  var cart = new Cart(req.session.cart || {});
    model.findById(productId, function(err, data){
      if(err){
      return res.redirect('/error');
      }
      //document.querySelector('#sessQty').innerHTML='inner';
      cart.add(data);
      req.session.cart = cart;
      console.log(req.session.cart);
      //res.redirect('/');
      //res.render('user/shopcart', {productId: productId, data: req.session.cart});
      res.render('user/shopcart', {newamount: req.session.cart.totalQty});
    })
})

router.get('/reducebyone/:id', function(req,res,next){
  var productId = req.params.id;
  var cart = new Cart(req.session.cart || {});
    cart.reduceByOne(productId);
    req.session.cart = cart;
    res.redirect('/shopcart');


})

router.get('/reduceall/:id', function(req,res,next){

  var productId = req.params.id;
  var cart = new Cart(req.session.cart || {});
    cart.reduceAll(productId);
    req.session.cart = cart;
    res.redirect('/shopcart');


})

router.get('/shopcart', function(req,res,next){

    if(!req.session.cart){
      return res.render('user/shopcart', {products: null});
    }
    var cart = new Cart(req.session.cart);
    //console.log(cart.generateArray()+'0000000000');
    //console.log(cart.generateArray());
    res.render('user/shopcart', {products: cart.generateArray(), totalPrice: cart.totalPrice});

})
var middleware = function(req,res,next){
  if(req.isAuthenticated()){
    return next();
  }else{
    req.session.oldUrl = req.url;
    //console.log(req.session.oldUrl);
    res.redirect('/user/signin');
  }
}

router.get('/checkout',middleware ,function(req,res ,next){
  if(!req.session.cart){
    return res.redirect('/shopcart');
  }
    var cart = new Cart(req.session.cart);
    var errMsg = req.flash('error')[0];
    res.render('user/checkout', {totalPrice: cart.totalPrice,errMsg: errMsg ,noError: !errMsg})
})

router.post('/checkout' ,function(req,res,next){
  if(!req.session.cart){
    return res.redirect('/shopcart');
  }
  var cart = new Cart(req.session.cart);
  const stripe = require('stripe')('sk_test_aqkeNcZ2WASeTyiWXfqH1Emx');

  stripe.charges.create({
        amount: cart.totalPrice * 100,//price in cents
        currency: "usd",
        source: req.body.stripeToken, // obtained with Stripe.js
        description: "Test Charge"
    }, function(err, charge) {
        if (err) {
            req.flash('error', err.message);
            return res.redirect('/checkout');
        }
        var order = new Order({
            user: req.user,
            cart: cart,
            address: req.body.address,
            name: req.body.name,
            paymentId: charge.id
        });
        order.save(function(err, result) {
            req.flash('success', 'Successfully bought product!');
            req.session.cart = null;
            res.redirect('/');
        });
    });

});


module.exports = router;

var model = require('../models/model');
const mongoose = require('mongoose');
var products = [
/*  new model({
    image:'https://upload.wikimedia.org/wikipedia/commons/thumb/7/7b/Orange-Whole-%26-Split.jpg/1200px-Orange-Whole-%26-Split.jpg',
    title: 'orange',
    description:'very tasty',
    price: 50
  }),new model({
    image:'https://cdn.shopify.com/s/files/1/0206/9470/products/apple-pink-small-done_1024x1024.jpg?v=1496109634',
    title: 'apple',
    description:'green yellow and red',
    price: 122
  }),new model({
    image:'http://www.greatgrubclub.com/domains/greatgrubclub.com/local/media/images/medium/4_1_1_kiwi.jpg',
    title: 'qiwi',
    description:'green and small',
    price: 478
  }),new model({
    image:'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQx1H7EzbgNCxARbZ4phF5TBBVtEntJUohl4IHSLbv7sxX7tuTdcw',
    title: 'vine',
    description:'green ',
    price: 139
  })*/
  new model({
    image:'https://www.schule-und-familie.de/assets/images/wissen/_th7_ST08-Z33_melone.jpg',
    title: 'melon',
    description:'big ',
    price: 199
  }),new model({
    image:'http://natureandnutrition.com/wp-content/uploads/2015/04/Health-Benefits-of-Bananas-600x600.jpg',
    title: 'banana',
    description:'long ',
    price: 89
  })
];

var count = 0;
for(var i=0; i< products.length; i++){
  products[i].save(function(err, data){
    count++;
    if(count=== products.length){
      mongoose.disconnect();
    }
  });
}

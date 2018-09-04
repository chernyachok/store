module.exports = function(oldCart){
  this.items = oldCart.items || {} ;//check ? sign
this.totalQty = oldCart.totalQty || 0;
  this.totalPrice =oldCart.totalPrice || 0;

  this.add = function(item){
    this.totalQty++;
    this.totalPrice += item.price;
    var storedItem = this.items[item._id];
    if(!storedItem){
        storedItem = this.items[item._id] = {product: item.title, qty: 1, price: item.price, item:item};//single item price from data
    }else{
      storedItem.qty++;
      storedItem.price = storedItem.qty* item.price;
    }
  }

  this.reduceByOne = function(id){
    this.items[id].qty --;
    this.items[id].price -= this.items[id].item.price;

    this.totalPrice -= this.items[id].item.price;
    this.totalQty--;
    if(this.items[id].qty ==0){
      delete this.items[id];
    }

  }

  this.reduceAll = function(id){
    this.totalPrice -= this.items[id].qty * this.items[id].item.price;
    this.totalQty -= this.items[id].qty;
    delete this.items[id];
  }


  this.generateArray = function() {
          var arr = [];
          for (var id in this.items) {
              arr.push(this.items[id]);
          }
          return arr;
      };
}

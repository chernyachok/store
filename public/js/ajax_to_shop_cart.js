$(document).ready(function(){

  $(".product").on('click', function(){
  //  console.log('made button clic'+ this.id);
    var currentId = this.id;
      $.ajax({
      url:'/to-shop-cart/'+currentId,
      type: 'GET',
      data: {},
      success: function(data){
        $('.currentQuantity').html(function(i,oldval){
          return ++oldval
        });
      // $('.currentQuantity').html($('#sessQty').html());

      }
    });
  })
});

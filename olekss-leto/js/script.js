var duration = 600;
var visible_popup = '';
var document_scroll;

function stopPropagation(e) {
  var event = e || window.event;
  event.stopPropagation();
} 

function trim(string){
  return string.replace(/(^\s+)|(\s+$)/g, "");
}


function initPopup(popup){
    var close = popup.find('.close');
    close.click(hidePopup);
    $('#back').click(hidePopup);

    $('.popup_holder').hide().removeClass('none');
    $(popup).hide().removeClass('none');
}

function hidePopup(){
    $('.popup_holder').fadeOut(duration,function(){
        $('.popup.act').removeClass('act').hide();
        
        $('body').removeClass('body_popup');
        
    });
}

function showPopup(popup){

    if ( $(popup).hasClass('act') ) return;

    if( $('body').hasClass('body_popup') ){
        // we have active popup
        $('.popup.act')
            .fadeOut(duration,function(){
                $(popup).fadeIn(duration);
                $(popup).addClass('act');
            })
            .removeClass('act');
    } else {
        $('body').addClass('body_popup');

        $(popup).show().addClass('act');
        $('.popup_holder').stop(1,1).fadeIn(duration);
    }
}

function updateFreePlaces() {
  var $freePlaces = $(document).find(".bus__place.free")
  //console.log( $("#leftplaces").text( $freePlaces.length ) )
  $("#leftplaces").text( $freePlaces.length )
}

function placeOrder() {
  var $freePlace = $(document).find(".bus__place.free")
  $($freePlace[0]).removeClass("free").addClass("ocupped")

  updateFreePlaces()
}

$(document).on('ready', function() {

  // reviews init
  $('.bxslider').bxSlider()

  $('.mfp-open-bottom').magnificPopup({
    type:'inline',
    midClick: true // allow opening popup on middle mouse click. Always set it to true if you don't provide alternative source.
  });

  $('.mfp-open-order').magnificPopup({
    type:'inline',
    midClick: true 
  });

  $('.mfp-open-callback').magnificPopup({
    type:'inline',
    midClick: true 
  });

  // if ( $('.popup').length ){
  //   $('.popup').each(function( index, item ) {
        
  //       initPopup($(item))

  //   })
    
  //   if( visible_popup.length ) {
  //     showPopup($('.'+visible_popup));
  //   }

  //   $('[data-popup]').click(function(e){
  //           e.preventDefault();
  //           var popup_class = $(this).data('popup');
  //           showPopup($('.'+popup_class));
  //   });
  // }
  function isPositiveInt(n){
    return Number(n)===n && n%1===0 && n > 0;
  }


  $('.button__callback').on('click',function() {

    var formData = $("#form__callback").serialize()
    $.ajax({
      url: "//formspree.io/hichnik@gmail.com", 
      method: "POST",
      data: formData,
      dataType: "json"
    });
   
    $.magnificPopup.close()

 })

  $('.viewall').on('click', function() {
    
    if ( $('.promo__all').hasClass('hidden_promo') ) {
      $('.viewall').text('Спрятать')
    } else {
      $('.viewall').text('Посмотреть все')
    }

    $('.promo__all').toggleClass('hidden_promo')

  })
  
  $('.popup__quantity').on('keyup', function(){
    
    var value = parseInt($('.popup__quantity').val(),10)
    
    if ( isPositiveInt(value) ) {
      
      var nowSum = 799 * value
      var laterSum = 999 * value
      $(".sum__paynow").text( nowSum )
      $(".sum__paylater").text( laterSum )
      // console.log( value )
    
    } 
    
  })

// Funny client Placement ... :-)
  updateFreePlaces()
  
  setTimeout(function() { 
    placeOrder()
  }, 5000);
  
  setTimeout(function() {
    placeOrder()
  }, 7000);
  
})

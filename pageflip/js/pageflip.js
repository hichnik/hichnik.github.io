var Page = (function() {
var $container = $('#container'),
    $bookblock = $('#bb-bookblock'),
    $items = $bookblock.children(),
    current = 0,
    bb = $('#bb-bookblock').bookblock({
      speed: 800,
      perspective: 2000,
      shadowSides: 0.8,
      shadowFlip: 0.4,
        // after each flip
        onEndFlip : function(old, page, isLimit) {
          
          // update current value
          current = page;
          
          // update the selected item of the table of contents
          updateTOC();
          
          // show or hide navigation arrows 
          updateNavigation( isLimit );

          //initialize the jScrollPane  on the content div for the new item
          setJSP('init');

          // destroy jScrollPane on the content div for the old item
          setJSP('destroy', old);

        }

    }),
    $navNext = $('#bb-nav-next'),
    $navPrev = $('#bb-nav-prev').hide(),

    $menuItems = $container.find('ul.menu-toc > li'),
    $tblcontents = $('#tblcontents'),

    transEndEventNames = {
      'WebkitTransition' : 'webkitTransitionEnd',
      'MozTransition' : 'transitionend',
      'OTransition' : 'oTransitionEnd',
      'msTransition' : 'MSTransitionEnd',
      'transition' : 'transitionend'
    },

    transEndEventName = transEndEventNames[Modernizr.prefixed('transition')],
    supportTransitions = Modernizr.csstransitions;


function init() {
  // initialize jScrollPane on the content div of the first item
  setJSP();
  initEvents();
}

function setJSP(action,idx) {

  var idx = idx === undefined ? current : idx,
      $content = $items.eq( idx ).children('div.content'),
      apiJSP = $content.data('jsp');

  if (action === 'init' && apiJSP === undefined ) {
    $content.jScrollPane({ 
      verticalGutter: 0,
      hideFocus: true
    });
  } else if (action === 'reinit' && apiJSP !== undefined) {
    apiJSP.reinitialize();
  } else if (action === 'destroy' && apiJSP !== undefined) {
    apiJSP.destroy();
  }

}

function initEvents() {

  //add navigation events
  $navNext.on('click', function(){
    bb.next();
    return false;
  })
  $navPrev.on('click', function(){
    bb.prev();
    return false;
  })

  $items.on({
    'swipeleft' : function( event ) {
      if ($container.data('opened')) {
        return false;
      }
      bb.next();
      return false;
    },
    'swiperight' : function( event ) {
      if ($container.data('opened')){
        return false;
      }
      bb.prev();
      return false;
    }
  });

  //show TOC
  $tblcontents.on('click', toggleTOC );

  // click a menu item
  $menuItems.on('click', function() {
    var $el = $(this),
    idx = $el.index(),
    jump = function() {
      bb.jump( idx + 1 );
    };
    current !== idx ? closeTOC( jump ) : closeTOC();

    return false;

  });

  // reinit jScrollPane on window resize
  $( window).on('debouncedresize', function() {
    // reinitialize jScrollPane on the content div
    setJSP('reinit');
  })

}

function updateNavigation( isLastPage ) {

    if (current === 0) {
      $navNext.show();
      $navPrev.hide();
    } else if ( isLastPage ){
      $navNext.hide();
      $navPrev.show();
    }  else {
      $navNext.show();
      $navPrev.show();
    }

}

function updateTOC() {
  $menuItems.removeClass('menu-toc-current').eq( current ).addClass('menu-toc-current');
}

function toggleTOC() {
  var opened = $container.data( 'opened' );
  opened ? closeTOC() : openTOC();
}

function openTOC() {
  $navNext.hide();
  $navPrev.hide();
  $container.addClass('slideRight').data('opened', true);
}

function closeTOC( callback ) {
  $navNext.show();
  $navPrev.show();

  $container.removeClass('slideRight').data('opened', false);

  if( callback ) {
    if( supportTransitions ) {
      $container.on( transEndEventName, function() {
        $( this ).off( transEndEventName );
      });
    } else {
      callback.call();
    }

  }
}

return { init : init }
// page
})();
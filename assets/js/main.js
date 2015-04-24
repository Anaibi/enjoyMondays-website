$(function() {

  // for use in animateHeader 
  var ww = {};
      ww.actual = $(window).width(),
      ww.previous = ww.actual;

  var marks = [];
      marks[0] = 325,
      marks[1] = 480;
    
  var resizeTimer;

  //hide ui-loader, check why appears
  $('.ui-loader').hide();

  $(window).load(function () {
  	doWaypoints();
  });

  // Done Resizing Event
  // https://css-tricks.com/snippets/jquery/done-resizing-event/ 
  $(window).on('resize', function() {

    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(function() {
      // Run code here, resizing has "stopped"
      // get new window sizes
      ww.previous = ww.actual; 
      ww.actual = $(window).width(); 
      
      // refresch waypoints TODO
      Waypoint.refreshAll();
      doWaypoints(); // check if needed

      if (!inSameWidthGap(ww, marks)) { 
        // refresh header
        scrollToPosition('#home');
        refreshHeader(); 
      }
            
    }, 150);

  });

  //////////////////////////////////////// MENU FUNCTIONALITY
  //////////////////////////////////////// 
  //main menu navigation
  $('#header-nav a').click(function(e){     
    e.preventDefault();
	scrollToPosition($(this).attr('href'));
  });			

  // notes link off	
  $('#header-nav a[href="#notes"]').off('click');

  // collapsed menu
  $('#collapsed-menu').hover(function() {
    $(this).hide();
    $('#header-nav').addClass('expanded').show();
  });

  // expanded menu
  $('#header-nav').hover(
  	function() {}, 
    function() {
      if ($(this).hasClass('expanded')) {
      	$(this).hide().removeClass('expanded');
        $('#collapsed-menu').show();
      }   
  });

  //////////////////////////////////////// WAYPOINT PLUGIN implementation
  ////////////////////////////////// http://imakewebthings.com/waypoints/
  function doWaypoints() {  

	var $pages = $('.page');

	var offset = {};

	// needs different offsets for updating home link
	//if (w<350) { 
	offset.down = '100%'; 
	offset.up = 'bottom-in-view'; 
	//} 
	//else if (w<480) { offset.down = '100%'; offset.up = 'bottom-in-view'; } 
	//else { offset.down = '100%'; offset.up = 'bottom-in-view'; } 
    
    // update links direction down
	$pages.each(function() { 
	  new Waypoint({
	  	element: this,
	  	handler: function(direction) {  
	  	  if (direction === 'down') { 
	  	  	$pages.removeClass('.active-link');
	  	  	updateLinks($(this.element).attr('id'));
	  	  	// if scrolling from home
	  	  	if (isActiveSection('work')) { console.log('act work');
	  	  	  animateHeader(direction); 
	  	  	} 
	  	  }
	  	},
	    offset: offset.down,
	    group: 'pages'
	  });
    });
    
    // update links direction down
    $pages.each(function() { 
	  new Waypoint({
	  	element: this,
	  	handler: function(direction) { 	  	  
	  	  if ((direction === 'up')) {
	  	    $pages.removeClass('.active-link'); 
	  	    updateLinks($(this.element).attr('id')); 
	  	    // if scrolling from home
	  	  	if (isActiveSection('home')) { console.log('act home');
	  	  	  animateHeader(direction); 
	  	  	} 
	  	  }	  	 
	  	},
	    offset: offset.up,
	    group: 'pages'
	  });
    });
  }
  //////////////////////////////////// END WAYPOINT PLUGIN implementation
  //////////////////////////////////////////////// END MENU FUNCTIONALITY

  ///////////////////////////////////////////////////////// animateHeader
  function animateHeader(direction) { console.log('ah ' + direction);
  	
  	// logo size only changes over 325px width
  	if (ww.actual > marks[0]) { console.log('switch logo');
      // switch logos
      $('#logo').toggleClass('logo_big logo_small');
    }

  	// menu collapsed/expanded only changes over 480 width
  	if (ww.actual > marks[1]) {
      // switch menus
      if (direction === 'down') {
        $('#header-nav').hide(function() {
          $('#collapsed-menu').css('display', 'inline-block');
        }).addClass('expanded');
      } else {
        $('#collapsed-menu').hide(function() {
  	  	  $('#header-nav').css('display', 'inline-block').removeClass('expanded');
  	    });
      }
    }
    
    if (ww.actual < marks[0] || ww.actual > marks[1]) {
      // switch header heights
	  $('.view-1').toggleClass('header_height_big header_height_small');
	}
  }
  //////////////////////////////////////////////////////END animateHeader
 
  ///////////////////////////////////////////////////////// refreshHeader
  function refreshHeader() { console.log('rh');
    // home menu is always expanded and header big
    $('#collapsed-menu').hide(function() {
  	  $('#header-nav').css('display', 'inline-block').removeClass('expanded');
  	});
    $('.view-1').addClass('header_height_big').removeClass('header_height_small')
  }
  //////////////////////////////////////////////////////END refreshHeader


  ////////////////////////////////////////////////////// HELPER FUNCTIONS
  // scroll to pages position
  function scrollToPosition(page) { 
    if (page === "#contact") { 
      scrollToPosition('footer');
    } else {	
	  $('body, html')
	    .stop()
	    .animate({
	  	  scrollTop: $(page).offset().top - $('.fixed_header_aux').height()
	    }, 750, function(){ 
	    $('html, body').clearQueue();
   	  });
	}
  }

  // update active link on main menu nav
  function updateLinks(id) { 
    $('#header-nav .active-link').removeClass('active-link'); 
    if (id.charAt(0) === '#') {
      $("#header-nav a[href='"+id+"']").parent().addClass('active-link');
    } else {
      $("#header-nav a[href='#"+id+"']").parent().addClass('active-link');
    }
  }

  // check if is active section
  function isActiveSection(id) {
  	return ($('#header-nav .active-link a').attr('href') === '#' + id);
  }
  
  // says if actual width and previous width are in the same interval defined by values in marks
  function inSameWidthGap() { 
    var a = false;
    for (var i = 0; i < (marks.length - 1); i++) {
      if (a) return a;
      if (inSameInterval(ww.actual, ww.previous, marks[i], marks[i+1])) {
        a = true;
      }
    }
    return a;
  }

  // check if two values v1, v2 are in the same interval defined by [i1, i2]
  function inSameInterval(v1, v2, i1, i2) { 
  	var a = false;
    if (v1 <= i2 && v2 <= i2 && v1 >= i1 && v2 >= i1) {
    	a = true;
    }
    console.log('a ' + a);
    return a;
  }
  ////////////////////////////////////////////////// END HELPER FUNCTIONS
});
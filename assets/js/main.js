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

      // if window only changes height, return
      if (ww.previous === ww.actual) {
      	return; 
      }
      
      // refresch waypoints TODO
      Waypoint.refreshAll();
     // doWaypoints(); // check if needed

      if (!inSameWidthGap(ww, marks)) { 
        // refresh header
        scrollToPosition('#home'); 
        setTimeout(function() {
          refreshHeader();
        }, 350); 
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

	  var $sections = $('.section');

	  var offset = {};

	  // needs different offsets for updating home link
	  //if (w<350) { 
	  offset.down = '100%'; 
	  offset.up = 'bottom-in-view'; 
	  //} 
	  //else if (w<480) { offset.down = '100%'; offset.up = 'bottom-in-view'; } 
	  //else { offset.down = '100%'; offset.up = 'bottom-in-view'; } 
    
    // update links direction down
	  $sections.each(function() { 
  	  new Waypoint({
  	  	element: this,
  	  	handler: function(direction) {  
  	  	  if (direction === 'down') { 
  	  	  	$sections.removeClass('.active-link');
  	  	  	updateLinks($(this.element).attr('id'));
  	  	  	// if scrolling from home
  	  	  	if (isActiveSection('work')) { 
  	  	  	  animateHeader(direction); 
  	  	  	} 
  	  	  }
  	  	},
  	    offset: offset.down,
  	    group: 'sections'
  	  });
    });
    
    // update links direction down
    $sections.each(function() { 
  	  new Waypoint({
  	  	element: this,
  	  	handler: function(direction) { 	  	  
  	  	  if ((direction === 'up')) {
  	  	    $sections.removeClass('.active-link'); 
  	  	    updateLinks($(this.element).attr('id')); 
  	  	    // if scrolling from home
  	  	  	if (isActiveSection('home')) { 
  	  	  	  animateHeader(direction); 
  	  	  	} 
  	  	  }	  	 
  	  	},
  	    offset: offset.up,
  	    group: 'sections'
  	  });
    });
  }
  //////////////////////////////////// END WAYPOINT PLUGIN implementation
  //////////////////////////////////////////////// END MENU FUNCTIONALITY

  ///////////////////////////////////////////////////////// animateHeader
  function animateHeader(direction) { 

    // switch headers
	  $('#site').toggleClass('big-header small-header');

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
  }
  //////////////////////////////////////////////////////END animateHeader
 
  ///////////////////////////////////////////////////////// refreshHeader
  function refreshHeader() { 
    // home menu is always expanded and header big
    $('#collapsed-menu').hide(function() {
  	  $('#header-nav').css('display', 'inline-block').removeClass('expanded');
  	});
    $('#site').removeClass('small-header').addClass('big-header');
  }
  //////////////////////////////////////////////////////END refreshHeader


  ////////////////////////////////////////////////////// HELPER FUNCTIONS
  // scroll to pages position
  function scrollToPosition(page) { 	
	  $('body, html')
	    .stop()
	    .animate({
	  	  scrollTop: $(page).offset().top - $('#main-header').height()
	    }, 250, function(){ 
	    $('html, body').clearQueue();
   	  });
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
    return a;
  }
  ////////////////////////////////////////////////// END HELPER FUNCTIONS
});
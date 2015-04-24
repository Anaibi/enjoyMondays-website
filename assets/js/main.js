$(function() {

  // for use in animateHeader 
  var actual_w = $(window).width(),
      previous_w = actual_w;
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
      previous_w = actual_w; 
      actual_w = $(window).width(); 
      
      // refresch waypoints TODO
      Waypoint.refreshAll();
      doWaypoints(); // check if needed

      // refresh header
      //animateHeader('up');
      scrollToPosition('#home');
      // home menu is always expanded and logo big
      $('#collapsed-menu').hide(function() {
  	  	  $('#header-nav').css('display', 'inline-block').removeClass('expanded');
  	  });
            
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
	  	  	if (isActiveSection('work')) { 
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
	  	  	if (isActiveSection('home')) { 
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
  function animateHeader(direction) { 
    var w = actual_w,
        w2 = previous_w;
        console.log(w); console.log(w2);
    var mark1 = 325,
        mark2 = 480;
  	
  	// logo size only changes over mark1 width
  	if (w > mark1) {
      // switch logos
      $('#logo').toggleClass('logo_big logo_small');
    }

  	// menu collapsed/expanded only changes over mark2 width
  	if (w > mark2) {
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
    
    if (w < mark1 || w > mark2) {
      // switch header heights
	  $('.view-1').toggleClass('header_height_big header_height_small');
	}
  }
  //////////////////////////////////////////////////////END animateHeader
 

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
  ////////////////////////////////////////////////// END HELPER FUNCTIONS
});
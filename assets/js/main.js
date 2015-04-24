$(function() {

  // for use in animateHeader 
  var actual_w = $(window).width(),
      previous_w;
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
      previous_w = actual_w; console.log(previous_w);
      actual_w = $(window).width(); console.log(actual_w);
      Waypoint.refreshAll();
      doWaypoints(); // check if needed
      animateHeader('up', actual_w, previous_w);
      scrollToPosition('#home');
      
            
    }, 250);

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
  function animateHeader(direction, actual_w, previous_w) { 
    var w = actual_w,
        w2 = previous_w;
        console.log(actual_w); console.log(previous_w);
    var mark1 = 325,
        mark2 = 480;
  	
  	// casos:
  	// menu type collapsed/expanded only changes over mark2 width
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
        
      // switch logos
      $('#logo').toggleClass('big small');

      // switch header heights
	  $('#main-header, #fixed-header-aux').toggleClass('height_1 height_2');
    }
    
    // under mark2 width only header height varies
    if (w < mark1) {
      // switch header heights
	  $('#main-header, #fixed-header-aux').toggleClass('height_1 height_2');
    }
  }
  //////////////////////////////////////////////////////END animateHeader
 

  ////////////////////////////////////////////////////// HELPER FUNCTIONS
  // scroll to pages position
  function scrollToPosition(page) { 		
	$('body, html')
	  .stop()
	  .animate({
	  	scrollTop: $(page).offset().top - $('#fixed-header-aux').height()
	  }, 750, function(){ 
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
  ////////////////////////////////////////////////// END HELPER FUNCTIONS
});
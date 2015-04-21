$(function() {

  //hide ui-loader, check why appears
  $('.ui-loader').hide();

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
  //////////////////////////////////////// http://imakewebthings.com/waypoints/
  $(window).load(function () {
  	doWaypoints();
  });

  function doWaypoints() {  

	var $pages = $('.page');
    
    // on scroll offset 98%
	$pages.each(function() { 
	  new Waypoint({
	  	element: this,
	  	handler: function(direction) { 
	  	  // only if scroll down update links
	  	  if (direction === 'down') { 
	  	  	$pages.removeClass('.active-link');
	  	  	updateLinks($(this.element).attr('id')); 
	  	  }
	  	},
	    offset: '98%',
	    group: 'pages'
	  });
    });
    
    // on scroll with offset 10%
    $pages.each(function() { 
	  new Waypoint({
	  	element: this,
	  	handler: function(direction) { 
	  	  var previousWaypoint = this.previous();
	  	  // only if scroll up
	  	  if ((direction === 'up') && previousWaypoint) {
	  	    $pages.removeClass('.active-link'); 
	  	  	updateLinks($(previousWaypoint.element).attr('id')); }
	  	  
	  	  // if scrolling to or from home
	  	  if (isActiveSection('home')) { animateHeader(direction); }
	  	},
	    offset: '10%',
	    group: 'pages'
	  });
    });
  }
  //////////////////////////////////////// END WAYPOINT PLUGIN implementation
  //////////////////////////////////////// END MENU FUNCTIONALITY
 
  //////////////////////////////////////// HELPER FUNCTIONS
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
  // HEADER ANIMATION
  // on scroll up, menu collapses, icon at right,
  // logo animates to small,
  // header height animates to small height = 114px
  // on scroll to home, menu expands
  // logo animates to big,
  // header height animates to big height = 139px
  function animateHeader(direction) { 

  	if (direction === 'down') {
    
      $('#header-nav').hide(function() {
        $('#collapsed-menu').show();
      }).addClass('expanded');
  		  
	  $('#logo a').animate({
	  	'margin-top': '19px',
		'width': '111px'
      }, 'fast');

	  $('#main-header, #fixed-header-aux').animate({
		'height': '111px'
	  }, 'fast');

	  $('#logo.big').removeClass('big').addClass('small');

  	} else {

  	  $('#collapsed-menu').hide(function() {
  	  	$('#header-nav').show().removeClass('expanded');
  	  });	

  	  $('#main-header, #fixed-header-aux').animate({
	    'height': '139px'
	  }, 'fast');
		
	  $('#logo a').animate({
	  	'margin-top': '40px',
	    'width': '146px'
	  }, 'fast');
	    
	  $('#logo.small').removeClass('small').addClass('big');
  	}

  	$('#logo a').clearQueue();
  }
 	
  //////////////////////////////////////// END HELPER FUNCTIONS
});
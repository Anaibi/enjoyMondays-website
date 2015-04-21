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
    $('#header-nav').css('margin-top', 0).addClass('centered expanded').show();
  });

  $('#header-nav').hover(
  	function() {
  	  console.log('out');
    }, 
    function() {
      if ($(this).hasClass('expanded')) {
      	$(this).hide().css('margin-top', '85').removeClass('centered expanded');
        $('#collapsed-menu').show();
      }   
  });

  //////////////////////////////////////// WAYPOINT PLUGIN implementation
  //////////////////////////////////////// http://imakewebthings.com/waypoints/
  $(window).load(function () {
  	doWaypoints();
  });

  function doWaypoints() {  
	// PAGES : update nav links
	var $pages = $('.page');

	$pages.each(function() { 
	  new Waypoint({
	  	element: this,
	  	handler: function(direction) { 
	  	  var previousWaypoint = this.previous();
	  	  $pages.removeClass('.active-link');
	  	  if (direction === 'down') { updateLinks($(this.element).attr('id'), direction); }
	  	},
	    offset: '98%',
	    group: 'pages'
	  });
    });

    $pages.each(function() { 
	  new Waypoint({
	  	element: this,
	  	handler: function(direction) { 
	  	  var previousWaypoint = this.previous();
	  	  $pages.removeClass('.active-link');
	  	  if ((direction === 'up') && previousWaypoint) { updateLinks($(previousWaypoint.element).attr('id'), direction); }
	  	  if (isActiveSection('home')) { doHeader(direction); }
	  	},
	    offset: '10%',
	    group: 'pages'
	  });
    });
  }
  //////////////////////////////////////// END WAYPOINT PLUGIN implementation
  //////////////////////////////////////// END MENU FUNCTIONALITY
 
  //////////////////////////////////////// HELPER FUNCTIONS
  //scroll to pages position
  function scrollToPosition(page) { 
	//con overflow-x hidden el scrollTop no funciona
	$('html, body').css('overflow-x', 'visible'); 
		
	$('body, html')
	  .stop()
	  .animate({
	  	scrollTop: $(page).offset().top - $('#fixed-header-aux').height()
	  }, 750, function(){ 
	  $('html, body').clearQueue();
   	});
  }

  //update active link on main menu nav id string 
  function updateLinks(id, direction) { 
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
  function doHeader(direction) { console.log(direction);
  	if (direction === 'down') {
    
      $('#header-nav').hide(function() {
        $('#collapsed-menu').show();
      });
  		  
	  $('#logo a').css('position', 'static').animate({
		height: '75px',
		width: '111px',
      });
	      	
	  $('#logo.big').animate({
		'margin-top': '17px'
	  });
	        
	  $('#logo.big').removeClass('big').addClass('small');

	  $('#main-header, #fixed-header-aux').animate({
		'height': '111px'
	  });

  	} else {

  	  $('#collapsed-menu').hide(function() {
  	  	$('#header-nav').css('margin-top', '85px').show();
  	  });	

  	  $('#main-header, #fixed-header-aux').animate({
	    'height': '139px'
	  });
		
	  $('#logo a').css('position', 'absolute').animate({
	    height: '102px',
	    width: '146px'
	  });
	    
	  $('#logo.small').animate({
	    'margin-top': '0'
	  });
	    
	  $('#logo.small').removeClass('small').addClass('big');
  	}
  }
 	
  //////////////////////////////////////// END HELPER FUNCTIONS
});
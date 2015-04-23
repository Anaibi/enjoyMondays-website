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

  $(window).resize(function() {  
   Waypoint.refreshAll();
   doWaypoints();
   animateHeader('up');
   scrollToPosition('#home');	
  });

  function doWaypoints() {  

	var $pages = $('.page');

	var offset = {}, w = $(window).width();

	// needs different offsets for updating home link
	if (w<350) { offset.down = '100%'; offset.up = 'bottom-in-view'; } else
	if (w<480) { offset.down = '100%'; offset.up = 'bottom-in-view' } else
	           { offset.down = '100%'; offset.up = 'bottom-in-view'; } 
    
    // scroll down 
	$pages.each(function() { 
	  new Waypoint({
	  	element: this,
	  	handler: function(direction) { 
	  	  if (direction === 'down') { 
	  	  	$pages.removeClass('.active-link');
	  	  	updateLinks($(this.element).attr('id')); 
	  	  }
	  	},
	    offset: offset.down,
	    group: 'pages'
	  });
    });
    
    // on scroll with offset 10%
    $pages.each(function() { 
	  new Waypoint({
	  	element: this,
	  	handler: function(direction) { 
	  	  var previousWaypoint = this.previous(); 
	  	  var nextWaypoint = this.next(); 
	  	  // only if scroll up
	  	  if ((direction === 'up') && previousWaypoint) {
	  	    $pages.removeClass('.active-link'); 
	  	    updateLinks($(this.element).attr('id')); 
	  	  }
	  	  // if scrolling to or from home
	  	  if (isActiveSection('home') && direction === 'up') { animateHeader(direction); }
	  	  if (isActiveSection('work') && direction === 'down') { animateHeader(direction); }
	  	},
	    offset: offset.up,
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
    
    var w = $(window).width(); console.log(w);
    var mark1 = 480;
    var mark2 = 325;

  	if (direction === 'down') {
      
      if (w > mark1) {
        // switch menus
        $('#header-nav').hide(function() {
          $('#collapsed-menu').css('display', 'inline-block');
        }).addClass('expanded');
        
        // switch logos
        $('#logo.big').removeClass('big').addClass('small');
      }
     /* // default, width > 1350px 
	  $('#logo a').animate({
	  	  'margin-top': '19px',
		  'width': '111px'
      }, 'fast');
      
      // case under 480px TODO refactor when all cases done
      if (window_w < mark1) {
        $('#logo').slideUp();
      }*/
      if (w < mark2 || w > mark1) {
      	// switch header heights
	    $('#main-header, #fixed-header-aux').animate({
		  'height': '111px'
	    }, 'fast');

      }

  	} else {
      if (w > mark1) { 
        // switch menus
  	    $('#collapsed-menu').hide(function() {
  	  	  $('#header-nav').css('display', 'inline-block').removeClass('expanded');
  	    });	

  	    // switch logos
  	    $('#logo.small').removeClass('small').addClass('big');
  	  }
      
      // switch header heights
  	  $('#main-header, #fixed-header-aux').animate({
	    'height': '139px'
	  }, 'fast');
		
	 /* // default	
	  $('#logo a').animate({
	  	'margin-top': '40px',
	    'width': '146px'
	  }, 'fast');

	  // case under 480px TODO refactor when all cases done
      if (window_w < mark1) {
        $('#logo').slideDown();

        $('#logo.big .img-wrapper').width('100%')
      }*/
	    
	  
  	}

  	//$('#logo a').clearQueue();
  }
 	
  //////////////////////////////////////// END HELPER FUNCTIONS
});
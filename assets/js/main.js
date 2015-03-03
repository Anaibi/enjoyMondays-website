$(function() {

	const HEADER_HEIGHT = 116
	    , WINDOW_WIDTH_MARK = 768	 // layout changes depending on this mark
	    , WINDOW_HEIGHT_MARK = 768;  // layout changes depending on this mark

	// TODO refactor into window ratios instead 

	var windowWidth = function() {
		return $(window).width();
	}; 

	var windowHeight = function() {
		return $(window).height();
	}; 

////////////////////////////////////////
////////////////////////////////////////

	// fit display to window height and set layout according to dimensions/device
	// to calculate heights wait untill all content loaded
	$(window).load(function () { 
    	setLayout(function() {
    		setTimeout(function() {
    			doWaypoints();
    			centerContents();
    		}, 100);
    	});
    	$('html').animate({
    		opacity: 1
    	});		
	});	
	
	$(window).resize(function() {  console.log('resize');
		setLayout();
		Waypoint.refreshAll();
		if (isPage('home')) {
			doHeader('home', 'up');
		} else {
			doHeader($('.active-link').attr('href'), 'up');
		}
		scrollToPosition($('.active-link').attr('href'));	
	});	


//////////////////////////////////////// MENU FUNCTIONALITY
//////////////////////////////////////// 
	
//main menu navigation
$('nav a').click(function(e){  
	e.preventDefault();

	scrollToPosition($(this).attr('href'));
	
});			

// notes link off	
$('nav a[href="#notes"]').off('click');

//////////////////////////////////////// WAYPOINT PLUGIN implementation
//////////////////////////////////////// http://imakewebthings.com/waypoints/

function doWaypoints() { 
	// HOME scrolling UP
	var waypointHomeUp = new Waypoint({
	  element: document.getElementById('home'),
	  handler: function(direction) { 
	  	doHeader('home', direction);
	  },
	  offset: 'bottom-in-view'
	});

	// HOME scrolling DOWN
	var waypointHomeUp = new Waypoint({
	  element: document.getElementById('home'),
	  handler: function(direction) {
	  	doHeader('home', direction)
	  }
	});

	// CONTACT : hide/show footer
	var waypointContact = new Waypoint({
	  element: document.getElementById('contact'),
	  handler: function(direction) { 
		if (direction === 'down') { 
			showFooter();
		} else {
			hideFooter();
		}; 
	  },
	  offset: 'bottom-in-view'
	});

	// PAGES : update nav links and set header height
	var $pages = $('.page');

	$pages.each(function() { 
		new Waypoint({
	    	element: this,
	      	handler: function(direction) { 
	        	
	        	var previousWaypoint = this.previous(); 

	        	$pages.removeClass('.active-link');

	        	if (direction === 'down') { updateLinks($(this.element).attr('id')); } 
	        	
	        	if ((direction === 'up') && previousWaypoint) { updateLinks($(previousWaypoint.element).attr('id')); }

	        	setHeaderHeight();
	      	},
	      	offset: '50%',
	      	group: 'pages'
		})
	})
}


// FUNCTIONS	

//////////////////////////////////////// PAGES / LAYOUT SETTINGS AND HELPER FUNCTIONS

// RESOLVE LAYOUT
function setLayout(callback) {  

	// header can be regular = .header-1, mobile landscape = .header-2 or mobile portrati = .header-3
	setHeaderClass();
		
	// set page height to fill window 
	setPageHeight();

	if (typeof callback == 'function') { callback.call(this); }
}

// SET HEIGHT for PAGES to Fill Window -- fix spaces: header, footer
function setPageHeight(callback) { 

	var main_header_h = $('#main-header').height(),
		window_h = windowHeight(),
		footer_h = $('footer').height(),
		$contact_page = $('#contact');
	
	// simple case just make sure page + header fills window
	$('.page').css('min-height', window_h - main_header_h);

	// CONTACT PAGE: if footer fits into page, set height = h - footer height
	if ((main_header_h + $('#contact header').height() + footer_h) <= window_h) { 
		
		$('#contact').css({
			'height': (window_h - main_header_h - footer_h),
			'min-height': (window_h - main_header_h - footer_h)
		});
	
	} else {
		
		console.log('fit page height')
	}
}

//center home and contact page content
function centerContents() { 
	var window_h = windowHeight(),
		header_h = $('#main-header').height();
	
	// home
	var home_h = $('#home').height(),
		$home_header = $('#home header');

	if (header_h + home_h <= window_h) {
		$home_header.css('margin-top', ((home_h - $home_header.height())/3));
	}

	// contact
	var contact_h= $('#contact').height(),
		footer_h = $('footer').height(),
		$contact_header = $('#contact header');
	
	if (header_h + contact_h + footer_h <= window_h) { 
		$contact_header.css('margin-top', (contact_h - $contact_header.height())/3);
	} else {
		console.log('center contentt')
	}
}


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

// return true if is active page
function isPage(id) {  
	return ($('.active-link').attr('href') === '#' + id);
}

// return true is is class .header-i
function isHeader(i) { 
	return $("html").hasClass('header-' + i);
}

// HEADER FUNCTIONS

// header can be regular = .header-1, mobile landscape = .header-2 or mobile portrati = .header-3
function setHeaderClass() { 
	
	// check caveats described here for further tuning
	// http://alxgbsn.co.uk/2012/08/27/trouble-with-web-browser-orientation/

	if ((windowWidth() >= windowHeight()) && (windowWidth() <= WINDOW_WIDTH_MARK)) { // Landscape .header-2

		$("html").addClass('header-2').removeClass('header-1, header-3'); 

	} else if ((windowWidth() <= windowHeight()) && (windowHeight() <= WINDOW_HEIGHT_MARK)) { // Portrait .header-3

		$("html").removeClass('header-2, header-1').addClass('header-3'); 

	} else {

		$("html").removeClass('header-2, header-3').addClass('header-1'); // regular layout .header-1
	
	}
}

// HEADER ANIMATION
// 1. big logo at left, menu at right --> for home page when width and height allow for it. 
//    on scroll, logo animates to small and menu moves up
// 2. small logo at top, menu under logo, centered --> for home page when width < xx and height > yy 
//    On scroll, header slides up and only small menu bar visible
// 3. small logo at left and menu at right --> for home page when landscape orientation and height > yy
//    on scroll, header slides to left, logo hidden and menu centered
function doHeader(page, direction) { 
 	
 	if (page.charAt(0) === '#') { page = page.trim('#'); }

	if (isHeader(1)) { // home big/small logo left, menu right dowb/up
		if (direction === 'up') {
			bigLogo();
  			moveMenu('down');
		} else {
			showLogo('right');
			smallLogo();
  			moveMenu('up');
		}
	} else if (isHeader(2)) { // 'small' landscape
		if (direction === 'up' && page === 'home') { 
			smallLogo();
			showLogo('right');
			moveMenu('up');
		} else {
			hideLogo('left');
			moveMenu('up');
		}
	} else if (isHeader(3)) { // 'small' portrait
		if (direction === 'up' && page === 'home') { 
			smallLogo();
			showLogo('down');
			moveMenu('up');
		} else {
			hideLogo('up');
			moveMenu('up');
		}
	}

	setHeaderHeight();
}

function setHeaderHeight() { 
	if ((isHeader(2) || isHeader(3)) && !isPage('home')) {
		var $nav = $('nav');
		$('#fixed-header-aux, #main-header').height($nav.height() + parseInt($nav.css('margin-top')) + parseInt($nav.css('margin-bottom')));
	} else {
		$('#fixed-header-aux, #main-header').height(HEADER_HEIGHT);
	}
}



//////////////////////////////////////// LOGO ANIMATION
//animate logo to big
function bigLogo() { 	

	$('#logo').animate({
		'margin-top': '42px'
	});
		
	$('#logo img').animate({
		height: '99px',
		width: '146px'
	});	
}
	
//animate logo to small
function smallLogo() {  
	
	$('#logo').animate({
			'margin-top': '17px'
		});
	$('#logo img').animate({
		height: '75px',
		width: '111px'
	});
}

// 
function hideLogo(direction) {  
	if (direction === 'up') {
		$('#logo').slideUp();
	} else if (direction === 'left') {
		$('#logo').animate({
			'margin-left': '-1000px'
		}, 2000);
	}
}

function showLogo(direction) { 
	if (direction === 'down') {
		$('#logo').slideDown();
	} else if (direction === 'right') { 
		$('#logo').animate({
			'margin-left': '12px'
		}, 'slow');
	}
}

//////////////////////////////////////// MENU ANIMATION and updateLinks
//move main menu
function moveMenu(direction) { 
	if (direction === "up") {
		$('nav').animate({
			'margin-top': '43px'
		});
	} else if (direction === "down") {
		$('nav').animate({
			'margin-top': '77px'
		});
	}
}

//update active link on main menu nav id string 
function updateLinks(id) {  
	$('nav a.active-link').removeClass('active-link'); 
	if (id.charAt(0) === '#') {
		$("nav a[href='"+id+"']").addClass('active-link');
	}
	else {
		$("nav a[href='#"+id+"']").addClass('active-link');
	}
}

	
//////////////////////////////////////// FOOTER
//footer animation
function showFooter() { //se puede pulir mas/mejor 
	$('footer').show();
	$('#bg').animate({
		'height': '0'
	}, '2000');
}
	
function hideFooter() { 
	$('#bg').animate({
		'height': '100'
	});
	$('footer').hide();
}
});

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
    			doHeader('home', 'up');
    		}, 500);
    	});
	});	
	
	// TODO not doing contact page height recalculation 
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

	//get clicked page 
	page = $(this).attr('href'); 

	scrollToPosition(page);
	
});			

// notes link off	
$('nav a[href="#notes"]').off('click');

//////////////////////////////////////// WAYPOINT PLUGIN
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
// small logo and menu up
// TODO refactor into one function deals with all header (logo + nav) animations
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

var $pages = $('.page');

$pages.each(function() { // update nav links
	new Waypoint({
    	element: this,
      	handler: function(direction) { 
        	var previousWaypoint = this.previous(); 

        	$pages.removeClass('.active-link');

        	if (direction === 'down') {
        		updateLinks($(this.element).attr('id'));
        	} 
        	if (previousWaypoint && (direction === 'up')) {
        		updateLinks($(previousWaypoint.element).attr('id'));
        	}
      	},
      	offset: '50%',
      	group: 'page'
	})
})
}

// FUNCTIONS	

//////////////////////////////////////// PAGES / LAYOUT SETTINGS AND HELPER FUNCTIONS
// RESOLVE LAYOUT
function setLayout(callback) {  

	// check if is landscape or fixed header
	setHeaderClass();

	hideFooter(); //was used for slideUp, if not used take out
		
	// set page height to fill window 
	setPageHeight();

	// center page/section contents (y axis)
	centerContents();	

	if (typeof callback == 'function') { 
        callback.call(this); 
    }
}
	
// set header, can be fixed (desktops and portrait mobile) or landscape
function setHeaderClass() { 
	
	// check caveats described here for further tuning
	// http://alxgbsn.co.uk/2012/08/27/trouble-with-web-browser-orientation/

	if ((windowWidth() >= windowHeight()) && (windowWidth() <= WINDOW_WIDTH_MARK)) { // Landscape
		$("html").addClass('landscape, header-2').removeClass('header-1, header-3'); 
	} else  if ((windowWidth() <= windowHeight()) && (windowHeight() <= WINDOW_HEIGHT_MARK)) { // Portrait header-three
		$("html").removeClass('landscape, header-2, header-1').addClass('header-3');  
	} else {
		$("html").removeClass('landscape, header-2, header-3').addClass('header-1'); 
	}
}

// do header, can be fixed or landscape
// TODO 
// * on mobile (google nexus) header height varies depending on browser? device? 
// * on landscape orientation logo stays centered and menu fills all layout
// * case menu doesnt't fit in so shifts down (either css or script)
// possible headers:
// 1. big logo at left, menu at right --> for home page when width and height allow for it. 
//    on scroll, logo animates to small and menu moves up
// 2. small logo at top, menu under logo, centered --> for home page when width < xx and height > yy 
//    On scroll, header slides up and only small menu bar visible
// 3. small logo at left and menu at right --> for home page when landscape orientation and height > yy
//    on scroll, header slides to left, logo hidden and menu centered
function doHeader(page, direction) {
 	if (page.charAt(0) === '#') {
 		page = page.trim('#');
	}
	if (isHeader(1)) { // home big/small logo left, menu right dowb/up
		if (direction === 'up') {
			bigLogo();
  			moveMenu('down');
		} else {
			showLogo('right');
			smallLogo();
  			moveMenu('up');
		}
	} else if (isHeader(2)) { // landscape
		if (direction === 'up') {
			showLogo('right');
		} else {
			hideLogo('left');
		}
	} else if (isHeader(3)) { // portrait
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

function setHeaderHeight() { console.log('doing header height');
	console.log(isPage('home'));
	if ((isHeader(2) || isHeader(3)) && !isPage('home')) {
		var $nav = $('nav');
		console.log($nav.height() + parseInt($nav.css('margin-top')) + parseInt($nav.css('margin-bottom')));
		$('#fixed-header-aux, #main-header').height($nav.height() + parseInt($nav.css('margin-top')) + parseInt($nav.css('margin-bottom')));
	} else {
		$('#fixed-header-aux, #main-header').height(HEADER_HEIGHT);
	}
}
// SET HEIGHT for PAGES to Fill Window
// fix spaces: header, footer
function setPageHeight() { 
	//efective space for content
	var h = windowHeight() - $('#main-header').height(); 
		
	//save contact page height before modifying
	var contactPageHeight = $('#contact.page').height()
		
	//simple case just make sure page + header fills window
	$('.page').css('min-height', h);

	//check if footer fits into page contact, if it does, set height = h - footer height
	if ((HEADER_HEIGHT + contactPageHeight + $('footer').height()) <= windowHeight()){
		$('#contact.page').css('height', (h - $('footer').height()));
		$('#contact.page').css('min-height', (h - $('footer').height()));
	} else {
		$('#contact.page header h1')
	}
	// if it doesn't, min height = h and footer has to deal with that?
}

//center home and contact page content
function centerContents() { 
	//set top margin for each aprox 50% of free space
	var yH = $('#home').height() - $('#home header').height(); 
	var cH = $('#contact').height() - $('#contact header').height() - $('footer').height(); 
	$('#home header').css('margin-top', (yH/3));
	$('#contact header').css('margin-top', (cH/3));
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
function isPage(id) {  console.log(id); console.log($('.active-link').attr('href'));
	return ($('.active-link').attr('href') === '#' + id);
}

function isLandscapeHeader() { 
	return $("html").hasClass('landscape');
}

function isHeader(i) { 
	return $("html").hasClass('header-' + i);
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
		$('#logo').show("slide", { direction: "left" }, 1000);
	}
}

function showLogo(direction) {
	if (direction === 'down') {
		$('#logo').slideDown();
	} else if (direction === 'right') { 
		$('#logo').show("slide", { direction: "right" }, 1000);
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

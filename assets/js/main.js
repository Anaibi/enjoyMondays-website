$(function() {

	const HEADER_HEIGHT = 116
	    , WINDOW_WIDTH_MARK = 768;

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
    		}, 500);
    	});
	});	
	
	// TODO not doing contact page height recalculation 
	$(window).resize(function() {  console.log('resize');
		setLayout();
		Waypoint.refreshAll(); //check if really needed
		scrollToPosition($('.active-link').attr('href'));	
	});	


//////////////////////////////////////// MENU FUNCTIONALITY
//////////////////////////////////////// 
	
//main menu navigation
$('nav a').click(function(e){  
	e.preventDefault();

	//get clicked page 
	page = $(this).attr('href'); 

	updateLinks(page);

	if(!isPage('notes')) { 
		scrollToPosition(page);
	}

	switch (page)	 {
		case '#home':
			bigLogo();
			moveMenu('down');
			hideFooter();
			break;
		case '#contact': 
			smallLogo();
			moveMenu('up');
			showFooter();
			break;
		default: //works, about and notes
			smallLogo();
			moveMenu('up');
			hideFooter();
	}
});			
	
$('nav a[href="#notes"]').off('click');

//////////////////////////////////////// WAYPOINT PLUGIN
//////////////////////////////////////// http://imakewebthings.com/waypoints/

function doWaypoints() { 
// HOME scrolling UP
// TODO refactor into one function deals with all header (logo + nav) animations
var waypointHomeUp = new Waypoint({
  element: document.getElementById('home'),
  handler: function(direction) { 
  	if (direction === 'up') {
  		bigLogo();
  		moveMenu('down');
  	}
  },
  offset: 'bottom-in-view'
});

// HOME scrolling DOWN
// small logo and menu up
// TODO refactor into one function deals with all header (logo + nav) animations
var waypointHomeUp = new Waypoint({
  element: document.getElementById('home'),
  handler: function(direction) {
  	if (direction === 'down') {
  		smallLogo();
  		moveMenu('up');
  	}
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

$pages.each(function() {
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

	doHeader();

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
		$("html").addClass('landscape'); 
	} else { 
		$("html").removeClass('landscape'); // Portrait
	}
}

// do header, can be fixed or landscape
// TODO 
// * on mobile (google nexus) header height varies depending on browser? device? 
// * on landscape orientation logo stays centered and menu fills all layout
// * case menu doesnt't fit in so shifts down (either css or script)
function doHeader() { 
	if (isLandscapeHeader()) {
		var $nav = $('nav');
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
function isPage(id) { 
	return ($('.active-link').attr('href') === '#' + id);
}

function isLandscapeHeader() { 
	return $("html").hasClass('landscape');
}

//////////////////////////////////////// LOGO ANIMATION
//animate logo to big
function bigLogo() { 	 	
	if (isLandscapeHeader()) {
		var marginTop = '17px';
		var height = '75px';
		var width = '111px';
	} else {
		var marginTop = '42px';
		var height = '99px';
		var width = '146px'
	}

	$('#logo').animate({
		'margin-top': marginTop
	});
		
	$('#logo img').animate({
		height: height,
		width: width
	});	
}
	
//animate logo to small
function smallLogo() { 
		
	if (isLandscapeHeader()) {
		var marginTop = 0;
		var height = 0;
	} else {
		var marginTop = '17px';
		var height = '75px';
	}
	
	$('#logo').animate({
			'margin-top': marginTop
		});
	$('#logo img').animate({
		height: height,
		width: '111px'
	});
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
	}, '6000');
}
	
function hideFooter() { 
	$('#bg').animate({
		'height': '100'
	});
	$('footer').hide();
}
});

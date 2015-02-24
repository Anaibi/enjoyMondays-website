$(function() {


	const HEADER_HEIGHT = 116
	    , WINDOW_WIDTH_MARK = 768;

	var windowWidth = function() {
		return $(window).width();
	}();

	var windowHeight = function() {
		return $(window).height();
	};

	var no_of_items = sessionStorage.length;  console.log(no_of_items); 
	var page = 'home'; console.log(page);

	var $firstLoad = $('#firstLoad'); console.log($firstLoad);

////////////////////////////////////////
////////////////////////////////////////

	//first thing, layout: fit display to window height and set layout according to dimensions/device
	$('body').fadeOut("fast", function() {
		setPageHeight();
		setLayout();
		//$firstLoad.text('false'); console.log($firstLoad);
		//callWaypoint();
	}).fadeIn("fast");
	
	//on changing window size, fit again
	$(window).resize(function() { 
		setPageHeight();
		setLayout();	
	});	

//////////////////////////////////////// SCROLL FUNCTIONS
//////////////////////////////////////// WAYPOINT PLUGIN 

	//scroll navigation, calls to WAYPOINT plugin:
	//call when entering new section to update links, special cases home section and footer

	//when scrolling in and out of home section, and offset HEADER_HEIGHT - 1 
	//$firstLoad.change(function() { console.log('firstLoad changed'); //this doesn't work
	//function callWaypoint() { //this makes a mess
		$('#home header').waypoint(function(direction) {		
		//scrolling out
		if (direction === 'down') { //running this on page reload, it shouldn't
			if (isLandscapeHeader() && !isPage('home')) {  console.log('in waypoint home down with offset, hide logo ' + page);
				hideLogo();
			} else { console.log('in waypoint home, down, small logo ' + page);
				smallLogo(); 
			};
			moveMenu('moveUp');
		} 
		//scrolling in
		else if (direction === 'up') {
			if (isLandscapeHeader()) {
				showLogo();
				smallLogo(); console.log('in waypoing direction up, offset, ' + page);	
			} else { console.log('in waypoint home, up, big logo ' + page);
				bigLogo();
			};		
			moveMenu('moveDown');
		}
	}, {offset: HEADER_HEIGHT-1});

	//when scrolling into home section from works section, and no offset
	$('#home header').waypoint(function(direction) {
		if (direction === 'up') {
			console.log('in waypoint called from home header, direction up, page ' + page);
			updateLinks('#home');
		}
	});
		
	//when scrolling down into new section, at the middle of the section
	//for pages #work, #about, #contact	
	$('.page header').waypoint(function(direction) { 	 
		if (direction === 'down') {
			console.log('in waypoint function, direction down, from .page header ' + page);
			//var page = '#' + $(this).parent().attr('id');
			page = '#' + $(this).parent().attr('id');
			updateLinks(page);
			console.log('in waypoint direction down, from .page header, after update links called, page ' + page);
		}
	}, {offset: '50%'});
	
	//when scrolling up into new section, once the bottom is in view
	//for pages #work and #about
	$('.page').waypoint(function(direction) {
		if (direction == 'up') {
		console.log('in waypoint function, direction up, from .page ' + page);
			//var page = '#' + $(this).attr('id');
			page = '#' + $(this).attr('id');
			updateLinks(page);
			console.log('in waypoint direction up, from .page, after update links called, page ' + page);
		}
	}, {offset: 'bottom-in-view'});	

	//when scrolling in or out of last section, show or hide footer
	$('#contact .sub-header').waypoint(function(direction) { 
		if (direction === 'down') {
		console.log('in waypoint function, direction down, from #contact sub-header ' + page);
			showFooter();
		} 
		else if (direction === 'up') {
			hideFooter();
			console.log('in waypoint direction up, from #contact sub-header, after update links called, page ' + page);
		}
	}, {offset: 'bottom-in-view'});	

//};
//////////////////////////////////////// MENU FUNCTIONALITY
////////////////////////////////////////
	
	//main menu navigation
	$('nav a').click(function(e){ 
		e.preventDefault();
		//var page = $(this).attr('href'); 
		page = $(this).attr('href'); 
		updateLinks(page);
		
		if(!isPage('notes')) scrollToPosition(page);								
	});			
		
////////////////////////////////////////
////////////////////////////////////////

//functions		

	//////////////////////////////////////// LOGO ANIMATION
	//animate logo to big
	function bigLogo() {	 	
		$('#logo')
			.animate({
				'margin-top': '42px'
			});
		
		$('#logo img').animate({
			height: '99px',
			width: '146px'});	
	};
	
	//animate logo to small
	function smallLogo() { 
		$('#logo').animate({
			'margin-top': '17px'});
		$('#logo img').animate({
			height: '75px',
			width: '111px'});
	};

	function landscapeLogo() {

	}

	function hideLogo() { 
		$('#logo').slideUp();
	}

	function showLogo() { 
		$('#logo').slideDown();
	}
	
	//////////////////////////////////////// MENU ANIMATION AND HELPER FUNCTIONS
	//move main menu
	function moveMenu(direction) { 
		if (direction === "moveUp") {
			$('nav').animate({
				'margin-top': '43px'
			});
		}
		if (direction === "moveDown") {
			$('nav').animate({
				'margin-top': '77px'
			});
		}
	}

	//update active link on main menu nav id string 
	function updateLinks(id) {  
		$('nav a.active-link').removeClass('active-link');
		$("nav a[href='"+id+"']").addClass('active-link');
	};

	//////////////////////////////////////// PAGES / LAYOUT SETTINGS AND HELPER FUNCTIONS
	//set height for pages
	function setPageHeight() { console.log($firstLoad);
		//efective space for content
		var h = windowHeight() - HEADER_HEIGHT; 
		
		//save contact page height before modifying
		var contactPageHeight = $('#contact.page').height()
		
		//simple case just make sure page + header fills window
		$('.page').css('min-height', h);
		
		//check if footer fits into page contact, if it does, set height = h - footer height
		if ((HEADER_HEIGHT + contactPageHeight + $('footer').height()) <= windowHeight()) {
			$('#contact.page').css('height', (h - $('footer').height()));
			$('#contact.page').css('min-height', (h - $('footer').height()));
		}
		// if it doesn't, min height = h and footer has to deal with that?
	};
	
	
	
	// resolve layout
	function setLayout() {  console.log($firstLoad);

		// check if is landscape or fixed header
		setHeaderClass();

		//var page = $('.active-link').attr('href'); 
		page = $('.active-link').attr('href');
		
		// unless on contact page, FOOTER is hidden untill contact page reached
		if (!isPage('contact')) hideFooter(); //was used for slideUp, if not used take out
		
		// center seccion contents (y axis)
		centerContents();

		// set HEADER and PAGE position 
		//if (!isLandscapeHeader()) {
		setTimeout(function() { 
			fixHeader(); 
			scrollToPosition(page);	
	   	}, 600);
		
	};
	
	// set header, can be fixed (desktops and portrait mobile) --> do collapsed menu for landscape mobile?
	function setHeaderClass() { 
	
		// check caveats described here for further tuning
		// http://alxgbsn.co.uk/2012/08/27/trouble-with-web-browser-orientation/

		if ((windowWidth >= windowHeight()) && (windowWidth <= WINDOW_WIDTH_MARK)) { // Portrait
			$("html").addClass('landscape'); 
		} else { 
			$("html").removeClass('landscape'); // Landscape
		}
	}

	// set fixed header
	function fixHeader() { 
		if (isLandscapeHeader()) {
			var $nav = $('nav');
			$('#fixed-header-aux').height($nav.height() + parseInt($nav.css('margin-top')) + parseInt($nav.css('margin-bottom')));
		} else {
			$('#fixed-header-aux').height($('#main-header').height());
		}
	};
	

	//center home and contact page content
	function centerContents() { 
		//set top margin for each aprox 50% of free space
		var yH = $('#home').height() - $('#home header').height(); 
		var cH = $('#contact').height() - $('#contact header').height(); 
		$('#home header').css('margin-top', (yH/3));
		$('#contact header').css('margin-top', (cH/3));
	}

	//scroll to pages position
	function scrollToPosition(page) {	console.log('scroll to position called ' + page);	
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
	};

	function isLandscapeHeader() {
		return $("html").hasClass('landscape');
	}

	function isFixedHeader() {
		return $('#main-header').hasClass('fixed');
	}

	//////////////////////////////////////// FOOTER
	//footer animation
	function showFooter() { 

		//se puede pulir mas/mejor 
		$('footer').show();
		$('#bg').animate({
			'height': '0'
		}, 'slow');
	};
	
	function hideFooter() { 
		$('#bg').animate({
			'height': '100'
		});
		$('footer').hide();
	};

	

	//return true if device mobile 
	//function mobileDevice() {
	//	if (navigator.userAgent.match(/(iPod|iPhone|iPad|Android)/)) return true;		
	//	else return false;
	//}


	// study if necessary add to mobileLayout
	//	http://www.abeautifulsite.net/detecting-mobile-devices-with-javascript/	
	/*var isMobile = {
    	Android: function() {
        	return navigator.userAgent.match(/Android/i);
    	},
	    BlackBerry: function() {
	        return navigator.userAgent.match(/BlackBerry/i);
	    },
	    iOS: function() {
	        return navigator.userAgent.match(/iPhone|iPad|iPod/i);
	    },
	    Opera: function() {
	        return navigator.userAgent.match(/Opera Mini/i);
	    },
	    Windows: function() {
	        return navigator.userAgent.match(/IEMobile/i);
	    },
	    any: function() {
	        return (isMobile.Android() || isMobile.BlackBerry() || isMobile.iOS() || isMobile.Opera() || isMobile.Windows());
	    }
	};*/

	// study plugin option for css transition hover effects
	// http://ianlunn.github.io/Hover/
	
	// or flip effect:
	// http://css3.bradshawenterprises.com/flip/
	
	// also css animatable
	//http://www.w3schools.com/cssref/css_animatable.asp

});

$(function() {

	const HEADER_HEIGHT = 116
	    , WINDOW_WIDTH_MARK = 768;

	var windowWidth = function() {
		return $(window).width();
	}();

	var windowHeight = function() {
		return $(window).height();
	};

////////////////////////////////////////
////////////////////////////////////////

	//first thing, layout: fit display to window height and set layout according to dimensions/device
	setPageHeight();
	setLayout();
	
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
	$('#home header').waypoint(function(direction) {		
		//scrolling out
		if (direction === 'down') {
			if (isLandscapeHeader() && !isPage('home')) {
				hideLogo();
			} else {
				smallLogo();
			};
			moveMenu('moveUp');
		} 
		//scrolling in
		else if (direction === 'up') {
			if (isLandscapeHeader()) {
				smallLogo();
				showLogo();	
			} else {
				bigLogo();
			};		
			moveMenu('moveDown');
		}
	}, {offset: HEADER_HEIGHT-1});

	//when scrolling into home section from works section, and no offset
	$('#home header').waypoint(function(direction) {
		if (direction === 'up')
			updateLinks('#home');
	});
		
	//when scrolling down into new section, at the middle of the section
	//for sections #work, #about, #contact	
	$('.page header').waypoint(function(direction) { 		 
		if (direction === 'down') {
			var page = '#' + $(this).parent().attr('id');
			updateLinks(page);
		}
	}, {offset: '50%'});
	
	//when scrolling up into new section, once the bottom is in view
	//for sections #work and #about
	$('.page').waypoint(function(direction) {
		if (direction == 'up') {
			var page = '#' + $(this).attr('id');
			updateLinks(page);
		}
	}, {offset: 'bottom-in-view'});	

	//when scrolling in or out of last section, show or hide footer
	$('#contact .sub-header').waypoint(function(direction) { 
		if (direction === 'down') {
			showFooter();
		} 
		else if (direction === 'up') {
			hideFooter();
		}
	}, {offset: 'bottom-in-view'});	


//////////////////////////////////////// MENU FUNCTIONALITY
////////////////////////////////////////
	
	//main menu navigation
	$('.main-menu a').click(function(e){ 
		e.preventDefault();
		var page = $(this).attr('href'); 

		updateLinks(page);
		
		if(!isPage('notes')) scrollToPosition(page);								
	});			
		
////////////////////////////////////////
////////////////////////////////////////

//functions		

	//////////////////////////////////////// LOGO ANIMATION
	//animate logo to big
	function bigLogo() {		
		$('.logo')
			.animate({
				'margin-top': '42px'
			});
		
		$('.logo img').animate({
			height: '99px',
			width: '146px'});	
	};
	
	//animate logo to small
	function smallLogo() {
		$('.logo').animate({
			'margin-top': '17px'});
		$('.logo img').animate({
			height: '75px',
			width: '111px'});
	};

	function landscapeLogo() {

	}

	function hideLogo() { 
		$('.logo').slideUp();
	}

	function showLogo() {
		$('.logo').slideDown();
	}
	
	//////////////////////////////////////// MENU ANIMATION AND HELPER FUNCTIONS
	//move main menu
	function moveMenu(direction) {
		if (direction === "moveUp") $('.main-menu').animate({
			'margin-top': '43px'
		});
		if (direction === "moveDown") $('.main-menu').animate({
			'margin-top': '77px'
		});
	}

	//update active link on main menu nav id string 
	function updateLinks(id) { 
		$('.main-menu a.active-link').removeClass('active-link');
		$(".main-menu a[href='"+id+"']").addClass('active-link');
	};

	//////////////////////////////////////// PAGES / LAYOUT SETTINGS AND HELPER FUNCTIONS
	//set height for pages/sections
	function setPageHeight() { 
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
	function setLayout() {  
		// check if is landscape or fixed header
		setHeaderClass();

		var page = $('.active-link').attr('href'); 

		
		// unless on contact page, FOOTER is hidden untill contact page reached
		if (!isPage('contact')) hideFooter(); //was used for slideUp, if not used take out
		
		// center seccion contents (y axis)
		centerContents();

		// set HEADER and PAGE position 
		//if (!isLandscapeHeader()) {
			setTimeout(function() { 
				fixHeader(); 
				scrollToPosition(page);
	   		}, 400);
		//}	
	};
	
	// set fixed header or landscape header 
	function setHeaderClass() { console.log('checking or')
		/*$(window).on("orientationchange", "load" ,function(){ console.log('checking or p');
  			if(window.orientation == 0) { //PORTRAIT --> always fixed
    			$("html").removeClass('landscape');
  			}
  			else { // LANDSCAPE 
    			$("html").addClass('landscape'); console.log('checking or l');
  			}
  			// if window width / height ratio xx, set to landscape TODO maybe
		});

		$(window).on("load",function(event){
    		alert("Orientation changed to: " + window.orientation);
  		});*/ //this doesn't work
	
		// check caveats described here for further tuning
		// http://alxgbsn.co.uk/2012/08/27/trouble-with-web-browser-orientation/

		if ((windowWidth >= windowHeight()) && (windowWidth <= WINDOW_WIDTH_MARK)) { // Portrait
			$("html").addClass('landscape'); console.log('not landscape for mobile');
		} else { console.log('landscape for mobile');
			$("html").removeClass('landscape'); // Landscape
		}
	}

	// set fixed header
	function fixHeader() {
		var header = $('#main-header header');	
		var h;
		if (isLandscapeHeader()) {
			h = $('#main-header nav').height() + parseInt(header.css('padding-bottom'));
		} else {
			h = header.height() + parseInt(header.css('padding-bottom'));
		}
		$('.fixed-fixed').height(h);
	};
	

	//center home and contact page content
	function centerContents() {
		//set top margin for each aprox 50% of free space
		var yH = $('#home').height() - $('#home .wrapper').height(); 
		var cH = $('#contact').height() - $('#contact .wrapper').height(); 
		$('#home .wrapper').css('margin-top', (yH/3));
		$('#contact .wrapper').css('margin-top', (cH/3));
	}

	//scroll to pages position
	function scrollToPosition(page) {		
		//con overflow-x hidden el scrollTop no funciona
		$('html, body').css('overflow-x', 'visible'); 

		$('body, html')
			.stop()
			.animate({
	   			scrollTop: $(page).offset().top - $('.fixed-fixed').height()
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
		return $('#main-header header').hasClass('fixed');
	}

	//////////////////////////////////////// FOOTER
	//footer animation
	function showFooter() { //se puede pulir mas/mejor 
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

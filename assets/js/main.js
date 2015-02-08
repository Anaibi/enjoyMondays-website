$(function() {

	var headerHeight = 116;

	//first thing, layout: fit display to window height
	pageHeight();
	setLayout();
	
	//on changing window size, fit section again
	$(window).resize(function() {
		pageHeight();
		setLayout();	
	});	

	//scroll navigation, calls to WAYPOINT plugin:
	//call when entering new section to update links, special case home section.

	//when scrolling in and out of home section, and offset headerHeight - 1 
	$('#home header').waypoint(function(direction) {		
		//scrolling out
		if (direction === 'up') {
			smallLogo();
			moveMenu('moveUp');
		} 
		//scrolling in
		else if (direction === 'up') {
			bigLogo();			
			moveMenu('moveDown');
		}
	}, {offset: headerHeight-1});

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
	
	//main menu navigation
	$('.main-menu a').click(function(e){ 
		
		e.preventDefault();
		
		var page = $(this).attr('href'); 
		
		//update links class active link
		updateLinks(page);
		
		//scroll to position if not NOTES clicked
		if(!isPage('notes')) scrollToPosition(page);								
	});			
	
	
//functions		

	//animate logo to big
	function bigLogo() {		
		$('.logo').animate({
			'margin-top': '42px'});
		
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
	
	//set min height for pages/sections
	function pageHeight() { 
		var h = $(window).height() - headerHeight;
		$('.page').css('min-height', h);
	};
	
	//return true if is active page
	function isPage(id) {
		return ($('.active-link').attr('href') === '#' + id);
	};
	
	//set layout class
	function setLayout() {  
		var w = $(window).width(); 
		var page = $('.active-link').attr('href'); 
		if (w<768) { 	
			showMenu();
			smallLogo();
			fixMenu();
			$('body').addClass('mobile').removeClass('wide');												
		}
		if (w>768) {	 	
			$('body').removeClass('mobile').addClass('wide');	
			if (isPage('home'))	{ 
				bigLogo();
			} else {
				smallLogo();
			}
		}
		setTimeout(function() { 
			fixedGhost(); 
			scrollToPosition(page);
	   	}, 400);
	};
	
	function fixedGhost() {		
		h = $('header.header-nav').height() + parseInt($('header.header-nav').css('padding-bottom'));
		$('.fixed-ghost').height(h);
	};
	
	//footer animation
	function showFooter() {
		$('footer').animate({
			'height': '100'
		});
	};
	
	function hideFooter() {
		$('footer').animate({
			'height': '0'
		});
	};

	//scroll to pages position
	function scrollToPosition(page) {

		var newTop = $(page).offset().top - $('.fixed-ghost').height(); 

		if (navigator.userAgent.match(/(iPod|iPhone|iPad|Android)/)) {        //check in devices  
            window.scrollTo(0, newTop) // first value for left offset, second value for top offset
		} else { 
			$('html, body').css('overflow-x', 'visible'); //con overflow-x hidden el scrollTop no funciona
			$('body, html')
				.stop()
				.animate({
	    			scrollTop: newTop
	     		}, 750, function(){ console.log('in callback animate');
	     			//$('html, body').css('overflow-x', 'hidden');//volver a poner hidden el fix para mac de scroll-x
                	$('html, body').clearQueue();
            });
		}
	}
		
});

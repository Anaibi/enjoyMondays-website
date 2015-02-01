$(function() {

//layout: fit section to window height
	pageHeight();
	setLayout();
	
	$(window).resize(function() {
		pageHeight();
		setLayout();	
	});	
//scroll navigation 
	//scrolling down from home
	$('#home header').waypoint(function(direction) {console.log('in waypoing call home/down');
		if (direction === 'down') {
			smallLogo();
			//hideMenu(); no hide menu except mobile TODO
			//moveMenu to new position
			moveMenu('moveUp');
		}
	}, {offset: 115});
	//scrolling up from work
	$('#home header').waypoint(function(direction) {console.log('in waypoint call home/up');
		if (direction === 'up') {
			bigLogo();			
			//showMenu(); no hide menu except mobile TODO
			//moveMenu to new position
			moveMenu('moveDown');
		}
	}, {offset: 115});
	
	$('#home header').waypoint(function(direction) {console.log('in waypoint call home/up2');
		if (direction === 'up')
			updateLinks('#home');
	});
		
	$('#work header').waypoint(function(direction) {console.log('in waypoint call work/down');
		if (direction === 'down')
			updateLinks('#work');
	}, {offset: '50%'});
	
	$('#work').waypoint(function(direction) {console.log('in waypoint call work/up');
		if (direction == 'up') {
			updateLinks('#work');
		}
	}, {offset: 'bottom-in-view'});	
	
	$('#about header').waypoint(function(direction) {console.log('in waypoint call work/down');
		if (direction === 'down')
			updateLinks('#about');
	}, {offset: '50%'});
		
	$('#about').waypoint(function(direction) {console.log('in waypoint call work/up');
		if (direction == 'up') {
			updateLinks('#about');
		}
	}, {offset: 'bottom-in-view'});	
	
	$('#contact header').waypoint(function(direction) {console.log('in waypoint call contact/down');
		if (direction === 'down')
			updateLinks('#contact');
	}, {offset: '50%'});
	
	$('#contact .sub-header').waypoint(function(direction) {
		if (direction === 'down')
			showFooter();
	}, {offset: 'bottom-in-view'});
	$('#contact .sub-header').waypoint(function(direction) {
		if (direction === 'up')
			hideFooter();
	}, {offset: 'bottom-in-view'});
	
	
//main menu navigation
	$('.main-menu a').click(function(e){ 
		
		e.preventDefault();
		
		var $link = $(this); //clicked link 		
		var page = $link.attr('href');  //called page id
		var $actual = $link.parent().find('.active-link');  //actual page -- borrar?
		
		//update links class active link
		updateLinks(page);

		console.log('page: ' + page);
		
		//scroll to position if not NOTES clicked
		if(!isPage('notes')) scrollToPosition(page);								
	});			
	
//no hover on menu all commented out	
//main menu animation 
	// on header
	//$('.header-nav').hover(
	//	function() {
	//		if (!$('body').hasClass('mobile')) {
	//			showMenu();				
	//		}
	//	},
	//	function() {
	//		if (!$('body').hasClass('mobile')) {
	//			if (!isPage('home')) 			
	//				hideMenu();
	//		}		
	//	}
	//);	
	
	//on collapsed menu
	$('.mobile .collapsed-menu').hover(function() {
		showMenu();
	});
	$('.collapsed-menu').click(function(event) {
		 event.stopPropagation();
		 showMenu();
	});
	// on scroll
	//TODO
	
//functions		

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
	     		}, 750, function(){
	     			$('htmll body').css('overflow-x', 'hidden'); //volver a poner hidden el fix para mac de scroll-x
                	$('html, body').clearQueue();
            });
		}
	}

	//show expanded menu
	function showMenu() { 
	//	$('.wide .collapsed-menu')
		$('.collapsed-menu')
			.fadeOut('fast', function() {
				$('.main-menu')
				.show()
				.animate({
					'right': '0',
				}, 300, function() {
					if (isPage('home')) {
						$('.main-menu').animate({
							'margin-top': '77px'
						}, 300);
						fixMenu();
					}
				});	
			})
			.hide();			
	};
	
	//hide expanded menu
	function hideMenu() { 
	//	$('.wide .main-menu')
		$('.main-menu')
		.animate({
			'margin-top': '47px',
		}, 300, function(){ 
			$('.main-menu').animate({ 
				'right': '-1000px'
			}, 300, function(){
				collapseMenu();				
				$('.main-menu').hide();
				$('.collapsed-menu').fadeIn();	 });				
		});	
	};
	
	//fix expanded menu if at home
	function fixMenu() {
		if (isPage('home'))
			$('.main-menu').removeClass('is-collapsed');
	};
	
	//collapse expanded menu if not at home
	function collapseMenu() {  
		$('.main-menu').addClass('is-collapsed');	
	};	
	
	//animate logo to big
	function bigLogo() {		
	//	$('.wide .logo').animate({
		$('.logo').animate({
			'margin-top': '42px'
		});
	//	$('.wide .logo img').animate({
		$('.logo img').animate({
			height: '99px',
			width: '146px'});	
	};
	
	//animate logo to small
	function smallLogo() {
	//	$('.wide .logo').animate({
		$('.logo').animate({
			'margin-top': '17px'});
	//	$('.wide .logo img').animate({
		$('.logo img').animate({
			height: '75px',
			width: '111px'});
	};

	//move main menu
	function moveMenu(direction) {
		if (direction == "moveUp") $('.main-menu').animate({
			'margin-top': '43px'
		});
		if (direction == "moveDown") $('.main-menu').animate({
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
		var h = $(window).height() - 116;
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
		
});

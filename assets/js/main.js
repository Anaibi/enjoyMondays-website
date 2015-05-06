$(function() {

  // for use in animateHeader 
  var ww = {'actual' : $(window).width()};
      ww.previous = ww.actual;

  var smallHeaderH = 111;

  var marks = [325, 480];
    
  var resizeTimer;

  $(window).load(function () {
  	doWaypoints();
  });

  // Done Resizing Event
  // https://css-tricks.com/snippets/jquery/done-resizing-event/ 
  $(window).on('resize', function() {

    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(function() {
      // Run code here, resizing has "stopped"
      // get new window sizes
      ww.previous = ww.actual; 
      ww.actual = $(window).width(); 

      // if window only changes height, return
      if (ww.previous === ww.actual) {
      	return; 
      }
      
      // refresh waypoints TODO
      Waypoint.refreshAll();

      if (!inSameWidthGap(ww, marks)) { 
        // refresh header
        scrollToPosition('#home'); 
        setTimeout(function() {
          refreshHeader();
        }, 350); 
      }     
    }, 150);

  });

  //-------------------------------------- MENU FUNCTIONALITY
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

  //----------------------------------------- WAYPOINTS
  //-------------- http://imakewebthings.com/waypoints/
  function doWaypoints() {  

	  var $sections = $('.section'); 
    
    // update links direction down
	  $sections.each(function() { 
  	  new Waypoint({
  	  	element: this,
  	  	handler: function(direction) {  
  	  	  if (direction === 'down') { 
  	  	  	$sections.removeClass('.active-link');
  	  	  	updateLinks($(this.element).attr('id'));
  	  	  	// if scrolling from home
  	  	  	if (isActiveSection('work')) { 
  	  	  	  animateHeader(direction); 
  	  	  	} 
  	  	  }
  	  	},
  	    offset: '100%',
  	    group: 'sections'
  	  });
    });
    
    // update links direction up
    $sections.each(function() { 
  	  new Waypoint({
  	  	element: this,
  	  	handler: function(direction) { 	  	  
  	  	  if ((direction === 'up')) {
  	  	    $sections.removeClass('.active-link'); 
  	  	    updateLinks($(this.element).attr('id')); 
  	  	    // if scrolling from home
  	  	  	if (isActiveSection('home')) { 
  	  	  	  animateHeader(direction); 
  	  	  	} 
  	  	  }	  	 
  	  	},
  	    offset: 'bottom-in-view',
  	    group: 'sections'
  	  });
    });
  }

  //------------------------------------------- animateHeader
  function animateHeader(direction) { 

    // switch headers
	  $('#site').toggleClass('big-header small-header');

  	// menu collapsed/expanded only changes over 480 width
  	if (ww.actual > marks[1]) {
      // switch menus
      if (direction === 'down') {
        $('#header-nav').hide(function() {
          $('#collapsed-menu').css('display', 'inline-block');
        }).addClass('expanded');
      } else {
        $('#collapsed-menu').hide(function() {
  	  	  $('#header-nav').css('display', 'inline-block').removeClass('expanded');
  	    });
      }
    }
  }

  //------------------------------------------- refreshHeader
  function refreshHeader() { 
    // home menu is always expanded and header big
    $('#collapsed-menu').hide(function() {
  	  $('#header-nav').css('display', 'inline-block').removeClass('expanded');
  	});
    $('#site').removeClass('small-header').addClass('big-header');
  }

  //---------------------------------------- scrollToPosition
  function scrollToPosition(section) { 
    // clicking from home, get small header height
    var h = (isActiveSection('home')) ? smallHeaderH : $('#main-header').height();

	  $('body, html')
	    .stop()
	    .animate({
	  	  scrollTop: $(section).offset().top - h
	    }, 250, function(){ 
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

  //----------------------------------------- isActiveSection
  function isActiveSection(id) {
  	return ($('#header-nav .active-link a').attr('href') === '#' + id);
  }
  
  //------------------------------------------ inSameWidthGap
  // says if actual width and previous width
  // are in the same interval defined by values in marks
  function inSameWidthGap() { 
    var a = false;
    for (var i = 0; i < (marks.length - 1); i++) {
      if (a) return a;
      if (inSameInterval(ww.actual, ww.previous, marks[i], marks[i+1])) {
        a = true;
      }
    }
    return a;
  }

  //------------------------------------------ inSameInterval
  // check if two values v1, v2 
  // are in the same interval defined by [i1, i2]
  function inSameInterval(v1, v2, i1, i2) { 
  	var a = false;
    if (v1 <= i2 && v2 <= i2 && v1 >= i1 && v2 >= i1) {
    	a = true;
    } 
    return a;
  }


  $(document).ready(function () {
    //------------------------------------------------- fitText
    $("#home .fittextjs").fitText(.43, { minFontSize: '70px', maxFontSize: '150px' });
    $("#work .fittextjs").fitText(.29, { minFontSize: '60px', maxFontSize: '150px' });
    $("#about .fittextjs").fitText(.38, { minFontSize: '60px', maxFontSize: '150px' });
    $("#contact .fittextjs").fitText(1.179, { minFontSize: '23px', maxFontSize: '150px' });
  
    
    //---------------------------------------------- supersized
    var slides = [];
    var projects = [
      {p:'enjoy-mondays.com' ,i:3, t:"",e:true}
      ,{p:'promotionpictures.com' ,i:4, t:"Promotion Pictures", d:"Personalized wordpress site."}
      ,{p:'goliatone.com' ,i:8, t:"Goliatone", d:"Website with portfolio and downloadable items. With Ember."}
      ,{p:'fat-man-collective.com' ,i:9, t:"Fat-man collective", d:"Company website. Interaction implemented with Flash. Server settup."}
      ,{p:'darknessmap.com' ,i:6, t:"DarknessMap", d:"Mobile and web App. Server settup." }
      ,{p:'thisismorrison.com' ,i:4, t:"This is Morrison", d:"Website update for portfolio gallery slider and portfolio item scrollable."}
      ,{p:'reigcapital.com' ,i:10, t:"ReigCapital", d:"Company website with database admin and registration + game implementation. Flash."}
    ];
    
    var project,
        pi = 0,
        holder, url, link;

    for (project in projects) {
      pi++;
      project = projects[project];
      holder = {};
      holder.slides = [];

      for (var i = 1; i < project.i; i++) {
        ind = i < 10 ? '0'+i : i;
        url = 'assets/projects/'+project.p+'/screenshots/image'+ind+'.jpg';
        holder.slides.push({
          image : url,
          title : project.t,
        });
      }

      // attach project preview and description to page ready onload:
      if (project.e != true) {
        link = '<li class="tile"><a href="#"><img src="assets/projects/'+project.p+'/preview/preview.jpg" alt="'+project.t+'" rel="'+pi+'"/><div class="details-wrapper"><div class="details"><h3 class="title">'+project.t+'</h3><p>'+project.d+'</p></div></div></a></li>';
        $('#gallery').append(link);
      }
      //insert into slides array
      slides.push(holder.slides);
    }

    ///////////////////////////
    //SUPERSIZED options///////
    ///////////////////////////
    $.supersized({
      // Functionality
      slideshow               : 1,        // Slideshow on/off
      autoplay                : 0,        // Slideshow starts playing automatically
      start_slide             : 1,        // Start slide (0 is random)
      stop_loop               : 0,        // Pauses slideshow on last slide
      random                  : 0,        // Randomize slide order (Ignores start slide)
      slide_interval          : 6000,     // Length between transitions
      transition              : 6,        // 0-None, 1-Fade, 2-Slide Top, 3-Slide Right, 4-Slide Bottom, 5-Slide Left, 6-Carousel Right, 7-Carousel Left
      transition_speed        : 1000,     // Speed of transition
      new_window              : 1,        // Image links open in new window/tab
      pause_hover             : 1,        // Pause slideshow on hover
      keyboard_nav            : 0,        // Keyboard navigation on/off
      performance             : 1,        // 0-Normal, 1-Hybrid speed/quality, 2-Optimizes image quality, 3-Optimizes transition speed // (Only works for Firefox/IE, not Webkit)
      image_protect           : 1,        // Disables image dragging and right click with Javascript
      
      // Size & Position
      min_width               : 0,        // Min width allowed (in pixels)
      min_height              : 0,        // Min height allowed (in pixels)
      vertical_center         : 1,        // Vertically center background
      horizontal_center       : 1,        // Horizontally center background
      fit_always              : 0,        // Image will never exceed browser width or height (Ignores min. dimensions)
      fit_portrait            : 0,        // Portrait images will not exceed browser height
      fit_landscape           : 1,        // Landscape images will not exceed browser width
      slide_links             : 'blank',  // Individual links for each slide (Options: false, 'num', 'name', 'blank')
      thumb_links             : 0,        // Individual thumb links for each slide
      thumbnail_navigation    : 0,        // Thumbnail navigation
      slides                  : slides,   // Slideshow Images
      
      // Theme Options
      progress_bar            : 0,        // Timer for each slide
      mouse_scrub             : 0
    });
    ///////////////////////////////////////////
      
    $tiles = $('#gallery').find('.tile');
        
    $tiles.find('img').each( function(i) {
      
      var $img  = $(this);
      var index = $img.attr('rel');
      
      // bind click to detail container   
      $img.next().bind('click',function(event) {
        
        //show slideshow navigation
        $('#slideshow').show();
        $('#supersized').show();
       
        // hide content
        $('#site').hide();
        
        // supersized config
        api.setGallery(index - 1);
        $.supersized.api.options.slideshow = true;
        $.supersized.api.playToggle();
        
        theme.show();
      });
    });
    ///////////////////////////////////////////

    $('#closeGallery a').bind('click',function(event){

      //hide slideshow navigation
      $('#slideshow').hide();
      $('#supersized').hide();

      // show content set to works section
      $('#site').fadeIn("fast", function() {
        $("#header-nav a[href|='#work']").trigger('click');
      });
      
      // supersized config
      api.setGallery(0);
      $.supersized.api.options.slideshow = false;
      $.supersized.api.playToggle();

      theme.hide();
    });
  });
});
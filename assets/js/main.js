$(function() {

  var ww = {'actual' : $(window).width()};
      ww.previous = ww.actual;

  var wh = {'actual' : $(window).height()};
      wh.previous = wh.actual;

  var header_h = [139, 111, 100, 80, 60];

  var marks = [325, 480, 600];
    
  var resizeTimer;

  $(window).load(function () {
  	doWaypoints();
  });

  // Done Resizing Event
  $(window).on('resize', function() {

    var actualSection = $('#header-nav').find('.active-link a').attr('href');

    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(function() {

      // get new window sizes
      ww.previous = ww.actual; 
      ww.actual = $(window).width(); 

      wh.previous = wh.actual;
      wh.actual = $(window).height();


      // center contents again
      centerContents('#home');
      centerContents('#contact');


      setTimeout(function() {
        refreshHeader(actualSection);
        Waypoint.refreshAll();
        scrollToPosition(actualSection);
      }, 150);      
    
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
    $('#header-nav').addClass('expanded');
  });

  // expanded menu
  $('#header-nav').hover(
    function() {},
    function() {
      if ($(this).hasClass('expanded')) {
        $(this).removeClass('expanded');
     }   
  });

  //----------------------------------------- WAYPOINTS
  function doWaypoints() {

    var $sections = $('.section'); 

    $sections.each(function() {

      new Waypoint({
        element: this,
        handler: function(direction) {

          var next = this.next();
          var section;

          $sections.removeClass('.active-link');

          var section = (direction === 'up') ? $(this.element).attr('id') : $(next.element).attr('id');

          updateState(direction, section);
          updateLinks(section);
        },
        offset: function() {
          return -(this.element.clientHeight - header_h[0]);
        },
        group: 'sections'
      });
    });
  }


  //--------------------------------------------- updateState
  function updateState(direction, section) {

    if (direction === 'up' && section === 'home') {
      $('#site').addClass('state1').removeClass('state2');
    } else if (direction === 'down' && section === 'work') {
      $('#site').addClass('state2').removeClass('state1');
    }
  }

  //------------------------------------------- refreshHeader
  function refreshHeader(section) { 
    if (section === '#home') { 
      updateState('up', '#home');
    } 
  }

  //----------------------------------------- centerContainer
  function centerContents(section) {
    var $section = $(section),
        $header = $section.find('.header'),
        h = ($section.height() - $header.height())/2;

    $header.css('transform', 'none');
    $header.animate({'top': h}, 'slow');
  };

  //---------------------------------------- scrollToPosition
  function scrollToPosition(section) { 
    // clicking from home, get small header height (unless section is home)
    var h = (isActiveSection('home') && section !== '#home') ? header_h[1] : $('#main-header').height();

    // if under 480px, header height is 100px always
    if (ww.actual < marks[1]) { h = header_h[2]; }

    // if under 350px, header height is 80px always
    if (ww.actual < marks[0]) { h = header_h[3]; }

    // landscape has side menu
    if ($('html').css('content') === 'isLandscape') {
      if (section === '#home') { h = header_h[2]; }
      else { h = 0; }
    }
console.log(h);
console.log(section);
console.log($(section).offset().top);

    $('body, html')
      .stop()
      .animate({
        scrollTop: $(section).offset().top - h
      }, 250, function(){
        $('html, body').clearQueue();
      });
  }

  //--------------------------------------------- updateLinks
  function updateLinks(id) { 
    var $header_nav = $('#header-nav');

    $header_nav.find('li').removeClass('active-link').addClass('no-touch'); 
    
    if (id.charAt(0) !== '#') { id = '#' + id; }

    $header_nav.find('a[href="'+id+'"]').parent().addClass('active-link').removeClass('no-touch');
  }

  //----------------------------------------- isActiveSection
  function isActiveSection(id) {
    return ($('#header-nav .active-link a').attr('href') === '#' + id);
  }
  

  $(document).ready(function () {
    //------------------------------------------------- fitText
    $("#home .fittextjs").fitText(.43, { minFontSize: '70px', maxFontSize: '150px' });
    centerContents('#home');
    $("#work .fittextjs").fitText(.29, { minFontSize: '60px', maxFontSize: '150px' });
    $("#about .fittextjs").fitText(.38, { minFontSize: '60px', maxFontSize: '150px' });
    $("#contact .fittextjs").fitText(1.179, { minFontSize: '23px', maxFontSize: '150px' });
    centerContents('#contact');    
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

    //checking theme working -> can't see what this is doing. TODO check
    theme.hide();
    $('#supersized').hide();

  });
});
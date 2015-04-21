$(document).ready(function () {
  ///////////
  var slides = [];
  var projects = [
    {p:'enjoy-mondays.com' ,i:3, t:"",e:true}
    //,{p:'yourlostmemories.com' ,i:12, t:"Your Lost Memories", d:"Complete website and database implementation. Moovie uploader, admin panel. Dedicated server configuration and codification", tech: "red5,"}
    ,{p:'promotionpictures.com' ,i:4, t:"Promotion Pictures", d:"Personalized wordpress site"}
    //,{p:'old.com' ,i:7, t:"Open Luxury Days", d:"Website for campaig with registration and admin panel. Server settup."}
    ,{p:'goliatone.com' ,i:8, t:"Goliatone", d:"Website with portfolio and downloadable items. Hand coded."}
    //,{p:'cristinacostales.cat' ,i:8, t:"Cristina Costales", d:"Personalized wordpress site. Integration and personalization of plugins. Domain and hosting settings."}
    ,{p:'fat-man-collective.com' ,i:9, t:"Fat-man collective", d:"Company website. Interaction implemented with Flash. Server settup."}
    ,{p:'darknessmap.com' ,i:6, t:"DarknessMap", d:"Mobile and web App. Server settup." }
    //,{p:'corinnek.com' ,i:6, t:"CorinneK", d:"Personal website"}
    ,{p:'thisismorrison.com' ,i:4, t:"This is Morrison", d:"Website update for portfolio gallery slider and portfolio item scrollable."}
    //,{p:'jocdelamobilitat.cat' ,i:13, t:"El Joc de la Mobilitat", d:"Flash application. Game with registrations and database implementation. Admin panel."}
    ,{p:'reigcapital.com' ,i:10, t:"ReigCapital", d:"Company website with database admin and registration + game implementation. Flash"}
    //,{p:'25retos.com' ,i:26,t:"Chocapic: 25 retos", d:"Campaign Flash game, with registration and database admin"}
    //,{p:'custo-tu-nos-inspiras.com' ,i:13, t:"Custo: Tú nos inspiras", d:"Facebook campaign with registration and database implementation. Flash"}
    //,{p:'custo-xmas.com' ,i:8, t:"Custo: X-mas", d:"Facebook campaign with registration and database implementation. Flash"}
    //,{p:'dalmau.com' ,i:8, t:"Dalmau"}
    //,{p:'malibu.com' ,i:18, t:"Malibu: La isla de los Brothers"}
    //,{p:'nueces-california.com' ,i:17, t:"California Nuts"}
    //,{p:'roca-20-suites.com' ,i:8, t:"Roca: 20 suites"}
    //,{p:'vueling-memory.com' ,i:10, t:"Vueling: 7 aniversario"}
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
		  link = '<li class="thumb"><a href="#"><img src="assets/projects/'+project.p+'/preview/preview.jpg" alt="'+project.t+'" rel="'+pi+'"/><div class="he-second"><div><h3>'+project.t+'</h3><p>'+project.d+'</p><span class=".he-link">view project</span></div></div></a></li>';
		  $('#emb_container ul.emb_gallery').append(link);
    }
    //insert into slides array
    slides.push(holder.slides);
  }

  $('#emb_container ul.emb_gallery').append('<div class="clearfix"></div>');

  ///////////////////////////
  //SUPERSIZED options///////
  ///////////////////////////
  $.supersized({
    // Functionality
    slideshow               :   1,			// Slideshow on/off
    autoplay				:	0,			// Slideshow starts playing automatically
    start_slide             :   1,			// Start slide (0 is random)
    stop_loop				:	0,			// Pauses slideshow on last slide
    random					: 	0,			// Randomize slide order (Ignores start slide)
    slide_interval          :   6000,		// Length between transitions
    transition              :   6, 			// 0-None, 1-Fade, 2-Slide Top, 3-Slide Right, 4-Slide Bottom, 5-Slide Left, 6-Carousel Right, 7-Carousel Left
    transition_speed		:	1000,		// Speed of transition
    new_window				:	1,			// Image links open in new window/tab
    pause_hover             :   1,			// Pause slideshow on hover
    keyboard_nav            :   0,			// Keyboard navigation on/off
    performance				:	1,			// 0-Normal, 1-Hybrid speed/quality, 2-Optimizes image quality, 3-Optimizes transition speed // (Only works for Firefox/IE, not Webkit)
    image_protect			:	1,			// Disables image dragging and right click with Javascript
    // Size & Position
    min_width		        :   0,			// Min width allowed (in pixels)
    min_height		        :   0,			// Min height allowed (in pixels)
    vertical_center         :   1,			// Vertically center background
    horizontal_center       :   1,			// Horizontally center background
    fit_always				:	0,			// Image will never exceed browser width or height (Ignores min. dimensions)
    fit_portrait         	:   0,			// Portrait images will not exceed browser height
    fit_landscape			:   1,			// Landscape images will not exceed browser width
    slide_links				:	'blank',	// Individual links for each slide (Options: false, 'num', 'name', 'blank')
    thumb_links				:	0,			// Individual thumb links for each slide
    thumbnail_navigation    :   0,			// Thumbnail navigation
    slides 					:  	slides,		// Slideshow Images
    // Theme Options
    progress_bar			:	0,			// Timer for each slide
    mouse_scrub				:	0
  });
  ///////////////////////////////////////////
		  
	$thumbs = $('ul.emb_gallery').children('li');
		  
	var $img, index;
		  
	$thumbs.find('img').each( function(i) {
	  $img  = $(this);
	  index = $img.attr('rel');
		  	
	  $img.next().bind('click',function(event) {
		  //show slideshow div
		  $('#slideshow').show();
		  api.setGallery(index - 1);
		  $('#front-page').hide();
		  //$('#emb_container').css('display','none');
		  $('#closeGallery a').fadeTo("fast", 1).css({'display':'visible'});
			  
		  $.supersized.api.options.slideshow = true;
		  $.supersized.api.playToggle();
		  $.supersized.api.$el.bind('supersizedLaunchEvent',function(event) {
		    $('#pauseplay').trigger('click');
		  });
		  //checking theme working
      theme.show();
    });
  });
  ///////////////////////////////////////////

	$('#closeGallery a').bind('click',function(event){

	  $('#closeGallery a').fadeTo("fast", 0).css({'display':'none'});

	  //hide slideshow div to make sure scroll-x keeps working!
	  $('#slideshow').hide();
	  api.setGallery(0);

	  $('.container').fadeIn("fast", function() {
	    $("a[href|='#work']").trigger('click');
	  });

	  $.supersized.api.options.slideshow = false;
	  $.supersized.api.playToggle();
	  theme.hide();
  });

  //checking theme working -> can't see what this is doing. TODO check
  //theme.hide();
	$('#closeGallery a').fadeTo(0, 0).css({'display':'none'});
});
$(function() {
	
	//set layout depending on device + viewport dimensions
	setLayout(); //TODO
	
	$(window).resize(function() {
		setLayout();
	});
	
	//FUNCTIONS //////////////////////////////////////////////////////
	
	function setLayout() {
		
		var wH = $(window).height();
		
		//set min-height for sections to fill window
		$('section').css('min-height', (wH - $('fixed-ghost').height())); 
		
		//set height for hidden-scroll area
		$('hidden-scroll').css('height', (wH - $('fixed-ghost').height())); 
		
	}
			
});
$(document).ready(function() {
	if($('.main-nav').length) {
		$('.main-nav').affix({
	  		offset : {
		  			top: $("header").height()
		  		}
	 	 	});	

		$( window ).on('scroll resize', function() { 
		 	 placeMenu(); 			
		});
	}
});

function placeMenu() {	
	var headerHeight = $("header").height();

	console.log("Resize executé avant" + headerHeight);
  	$('.main-nav').data('bs.affix').options.offset = headerHeight;
 	 $(".main-nav").data('bs.affix').checkPosition();

	console.log("Resize executé après" + headerHeight);

}
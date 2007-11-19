$(function(){
  // On focus, light the focused input
  $(".required").focus(function() {
		$(this).css("background", "white");
  });  

  // On blur, unlight the focused input
  $(".required").blur(function() {
		$(this).css("background", "#E6E6E6");
  });  
	$("#id_username").focus();
});

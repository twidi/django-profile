$(function(){
  // On focus, light the focused input
  $("input[@type=password]").focus(function() {
		$(this).css("background", "white");
  });  

  // On blur, unlight the focused input
  $("input[@type=password]").blur(function() {
		$(this).css("background", "#E6E6E6");
  });  

	$("#id_newpass1").focus();
});

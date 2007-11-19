$(function() {
  // On focus, light the focused input
  $("#id_email").focus(function() {
    $(this).css("background", "white");
  });

	$("#id_email").focus();
});

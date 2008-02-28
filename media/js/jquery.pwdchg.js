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

	// Check passwords function
  function passwordFn() {

		this.check = function() {
			var msgbox = $("#passmsg2");
			var pass1 = $("#id_newpass1").val();
			var pass2 = $("#id_newpass2").val();

      if (pass1.length > 0 && pass2.length > 0) {
        $("#password_img").show();
        if (pass1 != pass2 || pass1.length < 6) {
          $("#password_img").attr("src", "/site_media/images/error.png");
          $("#password_img").attr("alt", "The passwords are not equal:");
        } else {
          $("#password_img").attr("src", "/site_media/images/good.png");
        }
      } else if (pass1.length > 0 || pass2.length > 0) {
        $("#password_img").hide();
      }
    }
  }

	var pass = new passwordFn();
	$("#id_newpass1").blur(pass.check);
	$("#id_newpass2").blur(pass.check);

});

$(function(){

	// Check user function
  function emailFn() {

		this.email = '';

		this.check = function() {
			var val = $("#id_email").val();
			if (val.length == 0) {
				$("#email_img").hide();
				return;
			}

      if (this.user != val) {
				$("#email_img").attr("src", "/site_media/images/loading.gif");
        $("#email_img").show();

   			$.getJSON("/accounts/check_email_unused/" + val + "/", function(data) {
          if (data.success) {
            $("#email_img").attr("src", "/site_media/images/good.png");
          } else {
            $("#email_img").attr("src", "/site_media/images/error.png");
            $("#email_img").attr("alt", data.error_message);
          }
				});

				this.user = val;
      }
		}

  }

	// Check user function
  function userFn() {

		this.user = '';

		this.check = function() {
			var val = $("#id_username").val();
			if (val.length == 0) {
				$("#username_img").hide();
				return;
			}

      if (this.user != val) {
				$("#username_img").attr("src", "/site_media/images/loading.gif");
        $("#username_img").show();

   			$.getJSON("/accounts/check_user/" + val + "/", function(data) {
          if (data.success) {
            $("#username_img").attr("src", "/site_media/images/good.png");
          } else {
            $("#username_img").attr("src", "/site_media/images/error.png");
            $("#username_img").attr("alt", data.error_message);
          }
				});

				this.user = val;
      }
		}

  }

	// Check passwords function
  function passwordFn() {

		this.check = function() {
			var pass1 = $("#id_password1").val();
			var pass2 = $("#id_password2").val();

			if (pass1.length > 0 && pass2.length > 0) {
				$("#password_img").show();
				if (pass1.lenght < 6 || pass2.length < 6) {
          $("#password_img").attr("src", "/site_media/images/error.png");
          $("#password_img").attr("alt", "The passwords are too short.");
				} else if (pass1 != pass2) {
          $("#password_img").attr("src", "/site_media/images/error.png");
          $("#password_img").attr("alt", "The passwords are not equal.");
				} else {
          $("#password_img").attr("src", "/site_media/images/good.png");
				}
			} else if (pass1.length > 0 || pass2.length > 0) {
				$("#password_img").hide();
			}
		}
  }

  // On focus, light the focused input
  $(".required").focus(function() {
		$(this).css("background", "white");
  });  

  // On blur, unlight the focused input
  $(".required").blur(function() {
		$(this).css("background", "#E6E6E6");
  });  

	var user = new userFn();
	var email = new emailFn();
	var pass = new passwordFn();
	$("#id_username").blur(user.check);
	$("#id_email").blur(email.check);
	$("#id_password1").blur(pass.check);
	$("#id_password2").blur(pass.check);

  $("#id_username").focus();

});

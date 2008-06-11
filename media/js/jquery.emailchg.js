$(function() {
  // On focus, light the focused input
  $("input[@type=text]").focus(function() {
    $(this).css("background", "white");
  });

  // On blur, unlight the focused input
  $("input[@type=text]").blur(function() {
  	$(this).css("background", "#E6E6E6");
  });

	$("#id_email").focus();

  function emailFn() {

    this.email = '';

    this.check = function() {
      var val = $("#id_email").val();
      if (val.length == 0) {
        $("#email_img").hide();
        return;
      }

      if (this.email != val) {
        $("#email_img").attr("src", "/site_media/images/loading.gif");
        $("#email_img").show();
        if (!/^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/i.test(val)) {
            $("#email_img").attr("src", "/site_media/images/error.png");
            $("#email_img").attr("alt", "Invalid e-mail");
        } else {
          $.getJSON("/accounts/check_email_unused/" + val + "/", function(data) {
            if (data.success) {
              $("#email_img").attr("src", "/site_media/images/good.png");
            } else {
              $("#email_img").attr("src", "/site_media/images/error.png");
              $("#email_img").attr("alt", data.error_message);
            }
          });
        }
        this.email = val;
      }
    }
  };

	var email = new emailFn();
	$("#id_email").blur(email.check);
});

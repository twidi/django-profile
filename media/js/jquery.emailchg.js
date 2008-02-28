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

	// Check email function
  function emailFn() {

		this.email = '';
		this.status = false;

		this.check = function() {
			var val = $("#id_email").val();
			if (val.length == 0) return;
			var msgbox = $("#emailmsg");

      if (this.email != val) {
        msgbox.html('<img src="/site_media/images/loading.gif" />');
        msgbox.show();
        setTimeout(function() { checkemail(val) }, 500);
				this.email = val;
      }
		}

		function checkemail(val) {
			if (!/^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/i.test(val)) {
				$("#emailmsg").css("color", "red");
				$("#emailmsg").text("Invalid e-mail");
			} else {
   			$.getJSON("/accounts/check_email_unused/" + val + "/", function(data) {
					if (data.success) {
						$("#emailmsg").css("color", "red");
						$("#emailmsg").text(data["error_message"]);
					} else {
						$("#emailmsg").css("color", "green");
						$("#emailmsg").text("Ok");
						this.status = true;
					}
				});
			}

		}
  };

	var email = new emailFn();
	$("#id_email").blur(email.check);
});

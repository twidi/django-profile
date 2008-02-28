$(function(){
  // On focus, light the focused input
  $("input[@type=text],textarea").focus(function() {
		$(this).css("background", "white");
  });  

	$("a.location").click(function() {
		$("div.changelocation").toggle();	
	});

  // On blur, unlight the focused input
  $("input[@type=text],textarea").blur(function() {
		$(this).css("background", "#E6E6E6");
  });  

  function updateInline(date) {
			var arrdate = date.split("/");
      $("#id_birthdate").val(arrdate[2] + "-" + arrdate[0] + "-" + arrdate[1]);
  }

  $("#id_firstname").focus();
	if ($("#id_gender").val() == "M") {
			$("#gender a.male").css("background-color", "yellow");
	} else if ($("#id_gender").val() == "F") {
			$("#gender a.female").css("background-color", "yellow");
	}

	$("#clearLocation").click(function() {
		$("#id_location").val('');
	});

	var date = $("#id_birthdate").val().split("-");
  $("div.calendar").datepicker({ onSelect: updateInline, hideIfNoPrevNext: true, yearRange: "1940:2010", defaultDate: "01/02/2005", defaultDate: new Date(date[0],date[1] -1, date[2]) });
  $("a.newavatar").click(function() {
		window.open($(this).attr("href"), "Avatar", "width=500, height=150,resizable=yes").moveTo(100,100);
		return false;
  });

	// Click on the save button
	$("input[@type=button].save").click(function() {
		$("p.savedmsg").show("slow");
		$.post("/profile/save/", $("form").serialize(), function() {
			setTimeout('$("p.savedmsg").hide("slow");', 3000);		
		});
	});

	// Adds the Google Map
  $("#jmap").jmap();
	if ($("#id_latitude").val() && $("#id_longitude").val()) {
		$("#jmap").addPoint( $("#id_latitude").val(), $("#id_longitude").val() );
	}

  $("#id_location").keypress(function(e) {
    if (e.which == 13) {
      $("#searchAddress").trigger('click');
      e.preventDefault();
    }
  });

	// Gender select
	$("a.male").click(function() {
		if ($("#id_gender").val() == "M") {
			$("#id_gender").val("");	
			$(this).css("background-color", "#E6E6E6");
		} else {
			$("#id_gender").val("M");	
			$(this).css("background-color", "yellow");
			$("a.female").css("background-color", "#E6E6E6");
		}
		return false;
	});

	$("a.female").click(function() {
		if ($("#id_gender").val() == "F") {
			$("#id_gender").val("");	
			$(this).css("background-color", "#E6E6E6");
		} else {
			$("#id_gender").val("F");	
			$(this).css("background-color", "yellow");
			$("a.male").css("background-color", "#E6E6E6");
		}
		return false;
	});

  $("#id_country").change(function() {
    $("#id_location").val('');
    if ($("#id_country").val()) {
      $("#jmap").searchAddress({ 'address': $("#id_country option:selected").text() });
    } else {
      $("#id_latitude").val(0);
      $("#id_longitude").val(0);
    }
  });

  $("#searchAddress").click(function() {
    $("#jmap").searchAddress({ 'address': $("#id_location").val() + ", " + $("#id_country").val() });
  });

	//avatar
  $("a.delavatar").click(function() {
    $.getJSON("/profile/avatar/delete/", function(data) {
			if (data.success) {
				$("img#avatarimg").attr("src", "/site_media/images/default.gif");
			}
    });

    return false;
  });

});

$(function(){
  // On focus, light the focused input
  $("input[@type=text],textarea").focus(function() {
		$(this).css("background", "white");
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
  $("div.calendar").datePicker({ inline: true, onSelect: updateInline, hideIfNoPrevNext: true, startDate: "01/01/1940", month: date[1] -1, year: date[2], day: date[0]});
  $("a.avatar").click(function() {
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
  $("#jmap").jmap({ 'zoom': 2, 'maptype': 'map' });
	if ($("#id_latitude").val() != "-100" && $("#id_longitude").val() != "-100") {
  	$("#jmap").addPoint($("#id_latitude").val(), $("#id_longitude").val());
	}

  $("#id_location").keypress(function(e) {
    if (e.which == 13) {
      $("#searchAddress").trigger('click');
      e.preventDefault();
    }
  });

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
      $("#jmap").searchAddress($("#id_country option:selected").text());
    } else {
      $("#id_latitude").val(0);
      $("#id_longitude").val(0);
    }
  });

  $("#searchAddress").click(function() {
    $("#jmap").searchAddress($("#id_location").val() + ", " + $("#id_country").val());
  });

	//avatar
  $("a.delavatar").click(function() {
    $.getJSON("/profile/avatar/delete/", function(data) {
			if (data.success) {
				$(".avatar img").attr("src", "/site_media/images/default.gif");
			}
    });

    return false;
  });

});

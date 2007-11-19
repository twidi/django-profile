$(function(){
  function formatDate(date) {
	var day = date.getDate();
	var month = date.getMonth() + 1;
	return date.getFullYear() + '-' +
	       (month < 10 ? '0' : '') + month + '-' +
	       (day < 10 ? '0' : '') + day; 
  }

  // On focus, light the focused input
  $("input[@type=text],textarea").focus(function() {
		$(this).css("background", "white");
  });  

  // On blur, unlight the focused input
  $("input[@type=text],textarea").blur(function() {
		$(this).css("background", "#E6E6E6");
  });  

  function updateInline() {
      date = popUpCal.getDateFor($("span.calendarInline")[0]);
      $("#id_birthdate").val(formatDate(date));
  }

  $("#id_firstname").focus();
	if ($("#id_gender").val() == "M") {
			$("#gender a.male").css("background-color", "yellow");
	} else if ($("#id_gender").val() == "F") {
			$("#gender a.female").css("background-color", "yellow");
	}
	
	popUpCal.setDefaults({hideIfNoPrevNext: true, yearRange: "1940:2007"});
  //$(".calendarInline").calendar(popUpCal.regional['es'], {onSelect: updateInline});
  $(".calendarInline").calendar({onSelect: updateInline});

  $("a.avatar").click(function() {
		window.open($(this).attr("href"), "Avatar", "width=500, height=150,resizable=yes").moveTo(100,100);
		return false;
  });

  $("#jmap").jmap({ 'zoom': 2, 'maptype': 'map' });
  $("#jmap").addPoint($("#id_latitude").val(), $("#id_longitude").val());
  $("#id_city").keypress(function(e) {
    if (e.which == 13) {
      $("#searchAddress").trigger('click');
      e.preventDefault();
    }
  });

	$("#gender a.male").click(function() {
		if ($("#id_gender").val() == "M") {
			$("#id_gender").val("");	
			$(this).css("background-color", "#E6E6E6");
		} else {
			$("#id_gender").val("M");	
			$(this).css("background-color", "yellow");
			$("#gender a.female").css("background-color", "#E6E6E6");
		}
		return false;
	});

	$("#gender a.female").click(function() {
		if ($("#id_gender").val() == "F") {
			$("#id_gender").val("");	
			$(this).css("background-color", "#E6E6E6");
		} else {
			$("#id_gender").val("F");	
			$(this).css("background-color", "yellow");
			$("#gender a.male").css("background-color", "#E6E6E6");
		}
		return false;
	});

  $("#id_country").change(function() {
    $("#id_city").val('');
    if ($("#id_country").val()) {
      $("#jmap").searchAddress($("#id_country option:selected").text());
    } else {
      $("#id_latitude").val(0);
      $("#id_longitude").val(0);
    }
  });

  $("#searchAddress").click(function() {
    $("#jmap").searchAddress($("#id_city").val() + ", " + $("#id_country").val());
  });

	//avatar
  $("a.delavatar").click(function() {
    $.post("/avatar/delete/", function(data) {
			data = $.parseJSON(data);
			if (data['success']) {
				$(".avatar img").attr("src", "/site_media/avatars/default.gif");
			}
    });

    return false;
  });

});

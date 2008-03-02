function mapFramework() {
	var map;
	var marker;

	if (GBrowserIsCompatible()) {
		$("div.mapinfo").show();
   	map = new GMap2(document.getElementById("map"));
		map.addControl(new GLargeMapControl());
		map.addControl(new GOverviewMapControl())
		map.addControl(new GMapTypeControl())
		map.enableContinuousZoom();

		$("#id_location").keypress(function(e) {
 			if (e.which == 13) {
  			$("#searchAddress").trigger('click');
  			e.preventDefault();
 			}
 		});

		function searchLocation() {
			if (!$("#id_country option:selected").text() && !$("#id_location").val()) {
				return;
			} else if ($("#id_country option:selected").text() && !$("#id_location").val()) {
				address = $("#id_country option:selected").text();
			} else {
				address = $("#id_location").val() + ", " + $("#id_country").val()
			}

			$("#id_country option:selected").text()
    	$("img.loading").show();
    	geocoder = new GClientGeocoder();
    	geocoder.getLatLng(address, function(point){
      	if (point) {
        	map.setCenter(point);
        	marker.setLatLng(point);
        	$("#id_latitude").val(point.lat().toFixed(6));
        	$("#id_longitude").val(point.lng().toFixed(6));
        	$.getJSON("/profile/getcountry_info/" + point.lat() + "/" +  point.lng() + "/", function(data) {
          	$("#id_country").val(data['country']);
          	$("img.loading").hide();
        	});
      	}
    	});
 		}

		$("#searchAddress").click(searchLocation);
 		$("#id_country").change(function() {
			$("#id_location").empty();
			searchLocation();
		});
 	}

  map.setCenter(new GLatLng($("#id_latitude").val(), $("#id_longitude").val()), 4);
  marker = new GMarker(new GLatLng($("#id_latitude").val(), $("#id_longitude").val()), {clickable: false, bouncy: true, draggable: true});
  marker.hide();
  GEvent.addListener(marker, "dragend", function(){
    $("img.loading").show();
    point = marker.getLatLng();
    $("#id_latitude").val(point.lat().toFixed(6));
    $("#id_longitude").val(point.lng().toFixed(6));
    $.getJSON("/profile/getcountry_info/" + point.lat() + "/" +  point.lng() + "/", function(data) {
      $("#id_country").val(data['country']);
      $("#id_location").val(data['region']);
      $("img.loading").hide();
    });
  });
  map.addOverlay(marker);
}

$(function(){
  // On focus, light the focused input
  $("input[@type=text],textarea").focus(function() {
		$(this).css("background", "white");
  });  

	// Google maps code
	$("a.location").click(function() {
		$.getScript("http://maps.google.com/maps?file=api&v=2.x&key=" + $("#apikey").text() + "&async=2&callback=mapFramework");
		return false;
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
		window.open($(this).attr("href"), "Avatar", "width=410, height=160,resizable=yes").moveTo(100,100);
		return false;
  });

	// Click on the save button
	$("input[@type=button].save").click(function() {
		$("p.savedmsg").show("slow");
		$.post("/profile/save/", $("form").serialize(), function() {
			setTimeout('$("p.savedmsg").hide("slow");', 3000);		
		});
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

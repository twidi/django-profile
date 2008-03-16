function mapFramework() {

	if (GBrowserIsCompatible()) {

   	this.map = new GMap2(document.getElementById("map"));
		this.map.addControl(new GLargeMapControl());
		this.map.addControl(new GOverviewMapControl())
		this.map.addControl(new GMapTypeControl())
		this.map.enableContinuousZoom();

		var lat = lng = 0;
		if ($("#id_latitude").val()) lat = $("#id_latitude").val();
		if ($("#id_longitude").val()) lng = $("#id_longitude").val();

  	this.map.setCenter(new GLatLng(lat, lng), 4);
		this.marker = new GMarker(new GLatLng(lat, lng), {clickable: false, bouncy: true, draggable: true}); 
  	this.map.addOverlay(this.marker);

		GEvent.addListener(this.marker, "dragend", function(){
    	$("img.loading").show();
    	var point = this.getLatLng();
    	$("#id_latitude").val(point.lat().toFixed(6));
    	$("#id_longitude").val(point.lng().toFixed(6));
    	$.getJSON("/profile/getcountry_info/" + point.lat() + "/" +  point.lng() + "/", function(data) {
      	$("#id_country").val(data['country']);
      	$("#id_location").val(data['region']);
      	$("img.loading").hide();
    	});
  	});
	}
}

mapFramework.prototype.searchLocation = function() {
	if (!$("#id_country option:selected").text()) {
		return;
	} 

	address = $("#id_country option:selected").text();
	$("img.loading").show();
 	geocoder = new GClientGeocoder();

	var g = this;
 	geocoder.getLatLng(address, function(point){
 		if (point) {
 			g.map.setCenter(point);
 			g.marker.setLatLng(point);
 			$("#id_latitude").val(point.lat().toFixed(6));
 			$("#id_longitude").val(point.lng().toFixed(6));
 			$.getJSON("/profile/getcountry_info/" + point.lat() + "/" +  point.lng() + "/", function(data) {
 				$("#id_country").val(data['country']);
 				$("img.loading").hide();
 			});
 		}
 	}); 
}

var googlemaps;

function initMap() {
	googlemaps = new mapFramework();
	googlemaps.searchLocation();
}

function updateInline(date) {
	var arrdate = date.split("/");
  $("#id_birthdate").val(arrdate[2] + "-" + arrdate[0] + "-" + arrdate[1]);
}

$(function(){

  $("#id_firstname").focus();

  // On focus, light the focused input
  $("input[@type=text],textarea").focus(function() {
		$(this).css("background", "white");
  });  

  // On blur, unlight the focused input
  $("input[@type=text],textarea").blur(function() {
		$(this).css("background", "#E6E6E6");
  });  

	var date = $("#id_birthdate").val().split("-");
  $("div.calendar").datepicker({ onSelect: updateInline, hideIfNoPrevNext: true, yearRange: "1940:2010", defaultDate: new Date(date[0],date[1] -1, date[2]) });
  $("a.newavatar").click(function() {
		window.open($(this).attr("href"), "Avatar", "width=410, height=160,resizable=yes").moveTo(100,100);
		return false;
  });

	// Click on the save button
	$("input[@type=button].save").click(function() {
		$("img.saving").show();
		$.post("/profile/save/", $("form").serialize(), function() {
			$("img.saving").hide();
		});
	});


	$("#id_country").change(function() {
		$("#id_location").val("Drag the marker on the map to establish a more precise location.");
		if (!$("#id_country option:selected").val()) {
			$("div.mapinfo").hide();
			return;
		}
		if ($("div.mapinfo").css("display") == "none") {
			$("div.mapinfo").show();
			$.getScript("http://maps.google.com/maps?file=api&v=2.x&key=" + $("#apikey").text() + "&async=2&callback=initMap")
		} else {
			googlemaps.searchLocation();
		}
	});

	if ($("#id_country option:selected").val()) {
      $("div.mapinfo").show();
      $.getScript("http://maps.google.com/maps?file=api&v=2.x&key=" + $("#apikey").text() + "&async=2&callback=initMap")
	}

	// Gender select
	if ($("#id_gender").val() == "M") {
			$("a.male").css("background-color", "yellow");
	} else if ($("#id_gender").val() == "F") {
			$("a.female").css("background-color", "yellow");
	}

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

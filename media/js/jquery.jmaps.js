(function($) {
  google.load("maps", "2");

	$.fn.extend({
	jmap: function(settings) {
		var version = "1.4";
		var marker;

		/* Default Settings*/	
		var settings = jQuery.extend({
			maptype: "hybrid",		// can be "map", "sat" or "hybrid"
			center: [40.416706, -3.703269],	// G + Y
			zoom: 15,				// G + Y
			controlsize: "medium",	// G + Y
			showtype: false,			// G + Y
			showoverview: true,		// G
			dragging: true,			// G + Y
			clickmarker: true,		// G
			showmarker: false
		},settings);
		
		return this.each(function(){
			var jmap = this.jMap = new google.maps.Map2(this);
			jmap.enableContinuousZoom();

			switch(settings.maptype) {
				case "map":
					var loadmap = G_NORMAL_MAP;
					break;
				case "sat":
					var loadmap = G_SATELLITE_MAP;
					break;
				default:
					var loadmap = G_HYBRID_MAP;
					break;
			}
			jmap.setCenter(new google.maps.LatLng(settings.center[0],settings.center[1]),settings.zoom,loadmap);
			self.marker = new google.maps.Marker(new google.maps.LatLng(settings.center[0],settings.center[1]), {clickable: false, bouncy: true, draggable: true});
			self.marker.hide();
			google.maps.Event.addListener(self.marker, "dragend", function(){
				$("#country_loading").show();
				point = self.marker.getLatLng();
				$("#id_latitude").val(point.lat().toFixed(6));
				$("#id_longitude").val(point.lng().toFixed(6));
				$.getJSON("/profile/getcountry_info/" + point.lat() + "/" +  point.lng() + "/", function(data) {
					$("#id_country").val(data['country']);
					$("#id_location").val(data['region']);
					$("img.loading").hide();
				});
			});
			jmap.addOverlay(self.marker);
			if (!settings.showmarker) { self.marker.hide(); }
			switch(settings.controlsize)
			{
				case "small":
					jmap.addControl(new google.maps.SmallMapControl());
					break;
				case "large":
					jmap.addControl(new google.maps.LargeMapControl());
					break;
				case "none":
					break;
				default:
					jmap.addControl(new google.maps.SmallMapControl());
			}
			if (settings.showtype == true){
				jmap.addControl(new google.maps.MapTypeControl());// Type of map Control
			}
			if (settings.showoverview == true){
				jmap.addControl(new google.maps.OverviewMapControl());//Overview Map
			}
			//jmap.enableScrollWheelZoom();
			jmap.enableContinuousZoom();
			if (settings.clickmarker == true){
				google.maps.Event.addListener(jmap, "click", function(marker, point){
          $("#country_loading").show();
					self.marker.show();
					self.marker.setLatLng(point);
					$("#id_latitude").val(point.lat().toFixed(6));
					$("#id_longitude").val(point.lng().toFixed(6));
				  $.getJSON("/profile/getcountry_info/" + point.lat() + "/" +  point.lng() + "/", function(data) {
          	$("#id_country").val(data['country']);
					  $("#id_location").val(data['region']);
          	$("#country_loading").hide();
        	});
				});
			}
			/* On document unload, clean unload Google API*/
			jQuery(document).unload(function(){ GUnload(); });
		});
	},
	addPoint: function(pointlat, pointlng) {
		var jmap = this[0].jMap;
		point = new google.maps.LatLng(pointlat, pointlng);
		jmap.setCenter(point);
    self.marker.show();
    self.marker.setLatLng(point);
		return true;
	},
	searchAddress: function (address, settings, callback) {

		var settings = jQuery.extend({
			returntype: "map"	//Return as Map or a Object
		},settings);

		var jmap = this[0].jMap;
		Geocoder = new google.maps.ClientGeocoder();
		Geocoder.getLatLng(address, function(point){
			if (point) {
				jmap.setCenter(point);
 				self.marker.show();
 				self.marker.setLatLng(point);
				$("#id_latitude").val(point.lat().toFixed(6));
				$("#id_longitude").val(point.lng().toFixed(6));
				$.getJSON("/profile/getcountry_info/" + point.lat() + "/" +  point.lng() + "/", function(data) {
          $("#country_loading").show();
          $("#id_country").val(data['country']);
					$("#id_location").val(data['region']);
          $("#country_loading").hide();
        });
			}
		});
	}
});
})(jQuery);

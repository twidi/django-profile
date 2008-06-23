function updateInline(date) {
	var arrdate = date.split("/");
  $("#id_birthdate").val(arrdate[2] + "-" + arrdate[0] + "-" + arrdate[1]);
}

$(function(){
	var date = $("#id_birthdate").val().split("-");
  $("div.calendar").datepicker({ onSelect: updateInline, hideIfNoPrevNext: true, yearRange: "1940:2010", defaultDate: new Date(date[0],date[1] -1, date[2]) });
  $("a.newavatar").click(function() {
		window.open($(this).attr("href"), "Avatar", "width=640, height=480,resizable=yes").moveTo(100,100);
		return false;
  });

	// Gender select
	if ($("#id_gender").val() == "M") {
			$("a.male").addClass("highlight");
	} else if ($("#id_gender").val() == "F") {
			$("a.female").addClass("highlight");
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
});

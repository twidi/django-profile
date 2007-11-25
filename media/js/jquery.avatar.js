$(function() {

  $("input[@type=submit].buttoncancel").click(function() {
		if ($("#avatar_id").val()) {
    	$.post("/profile/avatar/delete/" + $("#avatar_id").val() + "/", function(data) {
				window.close();
			});
		} else {
			window.close();
		}
		return false;
  });

	$("#id_photo").change(function() {
		$("form").submit();
		$("#loading").show();
	});

  $("input[@type=submit].buttonanother").click(function() {
    $.post("/profile/avatar/delete/" + $("#avatar_id").val() + "/", function(data) {
			window.location = "/avatar/one/";
			window.resizeTo(500, 220);
    });
		return false;
  });

	$("input[@type=submit].buttondone").click(function() {
		var a = $("#child").position();
		$("#id_top").val(a.top);
		$("#id_left").val(a.left);
		$("#id_size").val($("#child").height());
  });

  function bgmove() {
    var pos = $("#child").position();
    $("#child").css("background-position", "-" + pos.left + "px -" + pos.top + "px");
  }

	function imgclick(e) {
		offset = $("#avatarzone").position();
		$("#child").css( { left: e.clientX - offset.left-16, top: e.clientY - offset.top-16, width: '32px', height: '32px' });
		$("#child").css( "background-position", "-" + (e.clientX - offset.left-16) + "px -" + (e.clientY - offset.top-16) + "px" );
  }

	$("#avatarzone").mousedown(imgclick);
	$("#child").click(function(e) {
		e.stopPropagation();
		e.preventDefault();
	});

  $("#child").draggable({ 'containment': '#avatarzone', 'drag': bgmove }).resizable( { 'containment': '#avatarzone', 'minWidth': 32, 'minHeight': 32, 'resize': bgmove });

});

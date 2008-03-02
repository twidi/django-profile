$(function() {

  $("input[@type=button].cancel").click(function() {
		window.close();
  });

	$("a.cancel").click(function() {
   	$.post($(this).attr("href"), function(data) {
			window.close();
		});
		return false;
	});

	$("#id_photo").change(function() {
		$("div.loading").show();
		$("form").submit();
	});

  $("a.another").click(function() {
    $.post($(this).attr("href"), function(data) {
			window.resizeTo(410, 160);
			window.location = "/profile/avatar/choose/";
    });
		return false;
  });

	$("input[@type=submit].buttondone").click(function() {
		var a = $("#child").position();
		$("#id_top").val(a.top);
		$("#id_left").val(a.left);
		$("#id_size").val($("#child").height());
  });
});

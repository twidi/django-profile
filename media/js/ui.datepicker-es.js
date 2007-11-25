/* Inicialización en español para la extensión 'UI date picker' para jQuery. */
/* Traducido por Vester (xvester@gmail.com). */
$(document).ready(function(){
	$.datepicker.regional['es'] = {clearText: 'Limpiar', closeText: 'Cerrar',
		prevText: '&lt;Ant', nextText: 'Sig&gt;', 
		currentText: 'Hoy', weekHeader: 'Sm', 
		dayNamesMin: ['Do','Lu','Ma','Mi','Ju','Vi','S&aacute;'],
		dayNamesShort: ['Dom','Lun','Mar','Mi&eacute;','Juv','Vie','S&aacute;b'],
		dayNames: ['Domingo','Lunes','Martes','Mi&eacute;rcoles','Jueves','Viernes','S&aacute;dabo'],
		monthNamesShort: ['Ene','Feb','Mar','Abr','May','Jun',
		'Jul','Ago','Sep','Oct','Nov','Dic'],
		monthNames: ['Enero','Febrero','Marzo','Abril','Mayo','Junio',
		'Julio','Agosto','Septiembre','Octubre','Noviembre','Diciembre'],
		dateFormat: 'dd/mm/yy', firstDay: 0};
	$.datepicker.setDefaults($.datepicker.regional['es']);
});
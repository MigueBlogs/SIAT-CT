
var texto = {"numero":"1"};
//var autores = [{"nombre":"Alí","id_autor":"1"},{"nombre":"Beto","id_autor":"2"}]

var ultimo = '0';
var guardadoGlobal;
window.guardadoGlobal=false;

$('#no').click(function(){
	ultimo = '0';
});

$('#yes').click(function(){
	ultimo = '1';
});

var output = document.getElementById('Number');
output.innerHTML = texto.numero;

var dataArr = [];
$("#guardarInfo").click(function(){
	if($('#textEvent').is(":visible") || $('#time').is(":visible") || $('#tablaEditar').is(":visible") || $('#GuardaInfo').is(":visible")  ){
		alert("Completa los datos antes de guardar el reporte.");
		return;
	}

	const reg = get_regiones();  // devuelve un objeto con los estados, tipo de alerta, nivel de alerta y regiones del estado por nivel de alerta
	var efectos = readEfects();
	var autores = readAutores();
	var archivos = readFiles();

	var data = {
		nombreEvento : $('#name').text(),
		idCategoriaEvento : parseInt($('#type').attr("data-typeId")),
		fecha: $('#datetime').attr("data-date"),
		fechaParse: $('#datetime').attr("data-dateParse"),
		oceano : $('#sea').attr("data-ocean"),
		latitud : $('#coords').text().split(",")[0].trim(),
		longitud: $('#coords').text().split(",")[1].trim(),
		zonasVigilancia : $('#zonas').val(),
		final : $("#finalSIAT").is(":checked") ? '1' : '0',
		comentarios: $("#comments").val(),
		infoGeneral: $('#subtitle').val() + " | " + 
			$('#hora').text() + " | " + 
			$('#coords').text() + " | " +
			$('#loc').text() + " | " +
			$('#despl').text() + " | " +
			$('#viento').text() + " | " +
			$('#racha').text() + " | " + 
			$('#presion').text() + " | " +
			$("#more-info").text(),
		autores : autores,
		regiones: reg,
		efectos : efectos,
		archivos: archivos
	};

	var idBoletin = data["nombreEvento"].substr(0,3).toUpperCase() + data["fecha"] + $('#type').attr("data-typeId") + data["oceano"];
	if(idBoletinSeguimiento) data["idSeguimiento"] = idBoletinSeguimiento;
	dataArr.push(data);
        
	$.ajax({
		type: 'POST',
		url:'./siat_fns.php',
		data: {
			idBoletin: idBoletin,
			propiedades: JSON.stringify(data)
		},
		dataType: "json",
		success: function(nuevoDato) {
			alert("Se han guardado los datos de: "+nuevoDato.NombreEvento);
		},
		error: function(error) {
			console.log(error);
		}
	});

	window.guardadoGlobal=true;
	console.log(captured);

	$("#lastOne").show();
	if(captured){
		$("#pdf").show();
		$('#old-pdf').show();
		$('#vistaPrevia').show();
	} else{
		$('#vistaPrevia').show();
		$("#pdfError").show();
	}   
});
/*
function loadJSON(callback) {   

    var xobj = new XMLHttpRequest();
        xobj.overrideMimeType("application/json");
	    xobj.open('GET', 'JS/info.json', true); // Replace 'my_data' with the path to your file
	    xobj.onreadystatechange = function () {
          if (xobj.readyState == 4 && xobj.status == "200") {
            // Required use of an anonymous callback as .open will NOT return a value but simply returns undefined in asynchronous mode
            callback(xobj.responseText);
          }
    };
    xobj.send(null);  
 }

function readJSON(path) {
    var xhr = new XMLHttpRequest();
    xhr.open('GET', path, true);
    xhr.responseType = 'blob';
    xhr.onload = function(e) { 
      if (this.status == 200) {
          var file = new File([this.response], 'temp');
          var fileReader = new FileReader();
          fileReader.addEventListener('load', function(){
               //do stuff with fileReader.result
          });
          fileReader.readAsText(file);
      } 
    }
    xhr.send();
}*/

$("#SeleccionaEvento").click(function() {
	//console.log(this);
    if(this.value=="1") {
        //Carga del evento
        $.getJSON('JS/info.json',function(data){
			$("#name").text(data.NombreEvento);
			$("#sea").text(data.oceano);
			$("#type").text(data.cat_evento);
			$("#subtitle").text(data.subtitulo);
			$("#comentarios").text(data.comentarios);
			$("#zonas").text(data.zonas);
			$("#hora").text(data.hora);
			$("#coords").text(data.coords);
			$("#loc").text(data.loc);
			$("#despl").text(data.despl);
			$("#viento").text(data.viento);
			$("#racha").text(data.racha);
			$("#autores").text(data.autores);
		});
    }else{
    	$("#name").text('');
		$("#sea").text('');
		$("#type").text('');
		$("#subtitle").text('');
		$("#comentarios").text('');
		$("#zonas").text('');
		$("#hora").text('');
		$("#coords").text('');
		$("#loc").text('');
		$("#despl").text('');
		$("#viento").text('');
		$("#racha").text('');
		$("#autores").text('');
		$("#filesUploaded").html('');
		$("#media").val('');
    }
});

function readEfects(){
	var id_efecto=1, coment;
	var efectos=[];
	$('#efectos').find('textarea').each(function(){
		id_efecto = $(this).attr('data-efectoId');
		coment = $(this).val();
		efectos.push({
			idEfecto: id_efecto,
			detalle: coment
		});
	});
	return efectos;
}

function readAutores() {
	var autores = [];
	$("#autores .autor").each(function(idx, elm){ autores.push($(elm).attr("data-autorId")); });

	return autores;
}

function readFiles() {
	var files = [];
	$("#filesUploaded .file-item span").each(function(idx, elm) { 
		files.push({
			url: $(elm).attr("data-fileUrl"),
			tipo: $(elm).attr("data-fileExt")
		});
	});

	return files;
}
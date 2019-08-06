
var texto = {"numero":"1"};
//var autores = [{"nombre":"Alí","id_autor":"1"},{"nombre":"Beto","id_autor":"2"}]

var ultimo = 'falso';
var guardadoGlobal;
window.guardadoGlobal=false;

$('#no').click(function(){
	ultimo = 'falso';
});

$('#yes').click(function(){
	ultimo = 'verdadero';
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
		var data = JSON.stringify({
			NombreEvento : $('#NombreEvento').text(),
			cat_evento : $('#tipo').text(),
			fecha : $('#datetime').text(),
			oceano : $('#sea').text(),
			hora : $('#hora').text(),
			coords : $('#coords').text(),
			loc : $('#loc').text(),
			despl : $('#despl').text(),
			viento : $('#viento').text(),
			racha : $('#racha').text(),
			subtitulo : $('#subtitle').val(),
			comentarios : $('#comentarios').text(),
			zonas : $('#zonas').text(),
			autores : autores,
			archivos : $('#media').val(),
			regiones: reg,
			efectos : efectos,
			ultimo_boletin : ultimo
		});
		dataArr.push(data);
        
        console.log(dataArr);

        $.ajax({
        	type: 'POST',
        	headers: {
	          "Content-Type": "application/json",
	        },
        	url:'http://rest.learncode.academy/api/SIAT-CT/boletines',
        	data: data,
        	success: function(nuevoDato){
        		alert("Se han guardado los datos de: "+nuevoDato.NombreEvento);
        	}
        });
        window.guardadoGlobal=true;
        console.log(captured);
        $("#lastOne").show();
        if(captured){
 			$("#pdf").show();
        }else{
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
    }
  });

//Upload
$('form').on('submit', function(event) {

		event.preventDefault();

		var formData = new FormData($('form')[0]);

		$.ajax({
			xhr : function() {
				var xhr = new window.XMLHttpRequest();

				xhr.upload.addEventListener('progress', function(e) {

					if (e.lengthComputable) {

						console.log('Bytes Loaded: ' + e.loaded);
						console.log('Total Size: ' + e.total);
						console.log('Percentage Uploaded: ' + (e.loaded / e.total))

						var percent = Math.round((e.loaded / e.total) * 100);

						$('#progressBar').attr('aria-valuenow', percent).css('width', percent + '%').text(percent + '%');

					}

				});

				return xhr;
			},
			type : 'POST',
			//este post falla en la URL
			url : '/upload',
			data : formData,
			processData : false,
			contentType : false,
			success : function() {
				alert('File uploaded!');
			}
		});

	});

function readEfects(){
	var id_efecto=1, coment;
	var efectos=[];
	$('#efectos').find('textarea').each(function(){
		id_efecto = $(this).attr('id');
		coment = $(this).val();
		efectos.push({id_efecto,coment});
	});
	return efectos;
}

var texto = {"numero":"1"};
//var autores = [{"nombre":"Alí","id_autor":"1"},{"nombre":"Beto","id_autor":"2"}]

var ultimo = 'falso';

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
		var near = readTables();
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
			regiones: near,
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
        $("#lastOne").show();
        $("#pdf").show();
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
		var output = document.getElementById('NombreEvento');
		output.innerHTML = data.NombreEvento;
		
		$.getJSON('JS/info.json',function(data){
			var output = document.getElementById('sea');
			output.innerHTML = data.oceano;
			$('#sea').hide();
		});

		$.getJSON('JS/info.json',function(data){
			var output = document.getElementById('tipo');
			output.innerHTML = data.cat_evento;
		});

		//Cargando datos del Subtítulo
		$.getJSON('JS/info.json',function(data){
			//var output = document.getElementById('subtitle');
			//output.innerHTML = data.texto;
			document.getElementById("subtitle").value = data.subtitulo;
		});

		/// cargando comentarios
		$.getJSON('JS/info.json',function(data){
			var output = document.getElementById('comentarios');
			output.innerHTML = data.comentarios;
		});

		/// cargando zonas
		$.getJSON('JS/info.json',function(data){
			var output = document.getElementById('zonas');
			output.innerHTML = data.zonas;
		});

		//Cargando datos en zona de Información Gneral
		$.getJSON('JS/info.json',function(data){
			var output = document.getElementById('hora');
			output.innerHTML = data.hora;
		});

		$.getJSON('JS/info.json',function(data){
			var output = document.getElementById('coords');
			output.innerHTML = data.coords;
		});

		$.getJSON('JS/info.json',function(data){
			var output = document.getElementById('loc');
			output.innerHTML = data.loc;
		});

		$.getJSON('JS/info.json',function(data){
			var output = document.getElementById('despl');
			output.innerHTML = data.despl;
		});

		$.getJSON('JS/info.json',function(data){
			var output = document.getElementById('viento');
			output.innerHTML = data.viento;
		});

		$.getJSON('JS/info.json',function(data){
			var output = document.getElementById('racha');
			output.innerHTML = data.racha;
		});

		$.getJSON('JS/info.json',function(data){
			var output = document.getElementById('autores');
			output.innerHTML = data.autores;
		});

	});
    }else{
    	var output = document.getElementById('NombreEvento');
		output.innerHTML = '';
		var output = document.getElementById('tipo');
		output.innerHTML = '';
		document.getElementById("subtitle").value = '';
		var output = document.getElementById('comentarios');
		output.innerHTML = '';
		var output = document.getElementById('zonas');
		output.innerHTML = '';
		var output = document.getElementById('hora');
		output.innerHTML = '';
		var output = document.getElementById('coords');
		output.innerHTML = '';
		var output = document.getElementById('loc');
		output.innerHTML = '';
		var output = document.getElementById('despl');
		output.innerHTML = '';
		var output = document.getElementById('viento');
		output.innerHTML = '';
		var output = document.getElementById('racha');
		output.innerHTML = '';
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


function readTables(){
	var id_edo,id_reg,reg,id_nivel_alerta;
	var tipo_alerta;
	var regiones=[];
	var cuenta=1;
	$('#tablaEdos1').find('tr').each(function(){
		
				//console.log("Esta es la vuelta: " +cuenta)
				var find1 = $(this).find('#NivelDeAlerta');
					id_nivel_alerta = $('option:selected',find1).val();
					tipo_alerta = 'acercándose';	

				var find2 = $(this).find('#Estado');
					//id_edo = $('option:selected',find2).val(); Para el valor 
					id_edo = $('option:selected',find2).text();

				var find3 = $(this).find('#Region');
					id_reg = $('option:selected',find3).val();
					//console.log("Este es el array de id_reg: ",id_reg);
					if(id_reg=='-1'){
						reg = $('option:selected',find3).attr("data-arrayedos");
						//console.log("Este es el array de "+id_edo+": "+id_reg);
					}else{
						reg=$('option:selected',find3).text();
					}
				
				regiones.push({id_nivel_alerta,id_edo,id_reg,reg,tipo_alerta});
				if(find1["prevObject"].attr("id") == 'Encabezado'){
						regiones.pop();
					}
				cuenta++;
			});
	//regiones.shift();
	$('#tablaEdos2').find('tr').each(function(){
		
				var find1 = $(this).find('#NivelDeAlerta');
					id_nivel_alerta = $('option:selected',find1).val();
					tipo_alerta = 'alejandose';	
										
				var find2 = $(this).find('#Estado');
					id_edo = $('option:selected',find2).text();

				var find3 = $(this).find('#Region');
					id_reg = $('option:selected',find3).val();
					//console.log("Este es el array de id_reg: ",id_reg);
					if(id_reg=='-1'){
						reg = $('option:selected',find3).attr("data-arrayedos");
						//console.log("Este es el array de "+id_edo+": "+id_reg);
					}else{
						reg=$('option:selected',find3).text();
					}
				
				regiones.push({id_nivel_alerta,id_edo,id_reg,reg,tipo_alerta});
				if(find1["prevObject"].attr("id") == 'Encabezado'){
						regiones.pop();
					}
				
			});
	//console.log(regiones);
	return regiones;
}

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
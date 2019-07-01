//la base de datos va a calcular e valor del numero de boletín?
var texto = {"numero":"1"};


var output = document.getElementById('Number');
output.innerHTML = texto.numero;
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
        $.getJSON('JS/info.json',function(data){
		var output = document.getElementById('NombreEvento');
		output.innerHTML = data.NombreEvento;
		//Carga del evento
		$.getJSON('JS/info.json',function(data){
			var output = document.getElementById('tipo');
			output.innerHTML = data.tipo;
		});

		//Cargando datos del Subtítulo
		$.getJSON('JS/info.json',function(data){
			//var output = document.getElementById('subtitle');
			//output.innerHTML = data.texto;
			document.getElementById("subtitle").value = data.texto;
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

	});
    }else{
    	var output = document.getElementById('NombreEvento');
		output.innerHTML = '';
    }
  });


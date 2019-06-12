var dt = new Date();
var fecha = {weekday: 'long', year: 'numeric', month: 'long', day: 'numeric'}
var hora2 = {hour:'2-digit', minute:'2-digit'}
var hora = {hour:'2-digit'}
document.getElementById("datetime").innerHTML = dt.toLocaleString("es-MX",fecha)+' / '+dt.toLocaleString("es-MX",hora)+':00 h';


var swiped = false;
function swipe(){
	if(swiped){
		document.getElementById("map").innerHTML = '<a onclick="swipe()"  onmouseover="" style="cursor: pointer;"><img style="height: 100%; width: 100%;" src="img/mapaTest.jpg" ></a>'
		swiped= !swiped;
//		console.log("nuevo valor de SWIPED: "+swiped);
	}else{
		document.getElementById("map").innerHTML = '<a onclick="swipe()"  onmouseover="" style="cursor: pointer;"><img style="height: 100%; width: 100%;" src="img/mapaTest2.gif" ></a>'
		swiped= !swiped
;	}
}

function editarF(){
document.getElementById("datetime").innerHTML = '<div class="well">	Fecha: <input type="text" name="date" class="datepicker" placeholder="Selecciona la fecha"/> '+
												'Hora: <input type="text" id="time" placeholder="Selecciona la Hora"/> '+
												'<button type="button" onclick="saveDate()" class="btn btn-outline-success">Guardar</button></div>'
	
	  $(function(){
				newDate=$('.datepicker').datepicker({
					language: "es",
					days: true,
					autoclose: true,
					format: 'dd/mm/yyyy',
					startDate: '-3d',
					todayBtn: "linked",
				    autoclose: true,
				    todayHighlight: true
				});
			});
	
	 var nerHour;
	 $(document).ready(function(){
				$('#time').timepicker({
					timeFormat: 'HH:mm',
    				interval: 60,
    				scrollbar: true,
				});
			});
}
function editarE(){
	document.getElementById("NombreEvento").innerHTML = '<input type="Text" name="nameEvent" size="5" value="Andrea" >'
}

function secretI(){
	document.getElementById("secretButton").innerHTML = '<button type="button" class="btn btn-primary" onclick="editarF()"><span class="glyphicon glyphicon-edit"></span> <ion-icon name="create"></ion-icon> Editar Fecha</button>'
	document.getElementById("secretButton2").innerHTML = '<button type="button" class="btn btn-primary" onclick="editarE()"><span class="glyphicon glyphicon-edit"></span> <ion-icon name="create"></ion-icon> Editar Evento</button>'
}
function secretO(){
	document.getElementById("secretButton").innerHTML = ' '
	document.getElementById("secretButton2").innerHTML = ' '
}

function saveDate(){
	 var newDate = new Date();
	 newDate= $(".datepicker").datepicker("getDate");
	 newDate.setHours($('#time').timepicker("getTime").getHours());
	 //console.log(newDate);
	 document.getElementById("datetime").innerHTML = newDate.toLocaleString("es-MX",fecha)+' / '+newDate.toLocaleString("es-MX",hora2)+' h';
}

//FUNCION PARA AUTOAJUSTAR CAJA DE TEXTO 
var autoExpand = function (field) {

	// Reset field height
	field.style.height = 'inherit';

	// Get the computed styles for the element
	var computed = window.getComputedStyle(field);

	// Calculate the height
	var height = parseInt(computed.getPropertyValue('border-top-width'), 10)
	             + parseInt(computed.getPropertyValue('padding-top'), 10)
	             + field.scrollHeight
	             + parseInt(computed.getPropertyValue('padding-bottom'), 10)
	             + parseInt(computed.getPropertyValue('border-bottom-width'), 10);
	
	field.style.height = height  + 'px';
};

document.addEventListener('input', function (event) {
	if (event.target.tagName.toLowerCase() !== 'textarea') return;
	autoExpand(event.target);
}, false);


document.addEventListener("DOMContentLoaded", function(event) {
	//carga una vez para acomodar texto
	autoExpand(document.getElementById("subtitle"));
  });

var dt = new Date();
var fecha = {weekday: 'long', year: 'numeric', month: 'long', day: 'numeric'}
var hora = {hour:'2-digit', minute:'2-digit'}
document.getElementById("datetime").innerHTML = dt.toLocaleString("es-MX",fecha)+' / '+dt.toLocaleString("es-MX",hora)+' h';


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

function editar(){
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

function secretI(){
	document.getElementById("secretButton").innerHTML = '<button type="button" class="btn btn-primary" onclick="editar()"><span class="glyphicon glyphicon-edit"></span> <ion-icon name="create"></ion-icon> Editar </button>'
}
function secretO(){
	document.getElementById("secretButton").innerHTML = ' '
}

function saveDate(){
	 var newDate = new Date();
	 newDate= $(".datepicker").datepicker("getDate");
	 newDate.setHours($('#time').timepicker("getTime").getHours());
	 //console.log(newDate);
	 document.getElementById("datetime").innerHTML = newDate.toLocaleString("es-MX",fecha)+' / '+newDate.toLocaleString("es-MX",hora)+' h';
}
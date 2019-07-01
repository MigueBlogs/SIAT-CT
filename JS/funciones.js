$(function() {
	var dt = new Date();
	var fecha = {weekday: 'long', year: 'numeric', month: 'long', day: 'numeric'}
	var hora2 = {hour:'2-digit', minute:'2-digit'}
	var hora = {hour:'2-digit'}
	document.getElementById("datetime").innerHTML = dt.toLocaleString("es-MX",fecha)+' / '+dt.toLocaleString("es-MX",hora)+':00 h';




	function generaPdf() {
			
	      	/*Cambios para imprimir correctamente el documento*/
	      	$(".titulo").css("font-size", "15px");
	      	//30 px es el tamaño final del letrero (el pdf duplica el Pixelaje del texto)
	      	$(".encabezado").css("font-size", "30px");
	      	autoExpand(document.getElementById("subtitle"));
	        
	        if(parseInt(document.getElementById("subtitle").style.height) > 0 && parseInt(document.getElementById("subtitle").style.height) <=55 ){
	        	document.getElementById("subtitle").rows = 1;
	        	
	        }if(parseInt(document.getElementById("subtitle").style.height) > 55 && parseInt(document.getElementById("subtitle").style.height) <=100 ){
	        	document.getElementById("subtitle").rows = 2;
	        	
	        }if(parseInt(document.getElementById("subtitle").style.height) > 100 && parseInt(document.getElementById("subtitle").style.height) <=235 ){
	        	document.getElementById("subtitle").rows = 3;
	        	
	        }
	        $(".regularTxt").css("font-size", "10px");
	        $("#regiones").css("font-size", "10px");
			$(".tituloTable").css("font-size", "12px");
	        $(".fecha").css("font-size", "14px");
	        $(".encabezado").css("font-size", "15px");
	        autoExpand(document.getElementById("subtitle"));
	        $("textarea").css( "border", "none");
	        $(".dataH").css("font-size", "11px");
			
	        /* Get the element.*/
	        var element = document.getElementById('root');
	        // Generate the PDF.
	        html2pdf().from(element).set({
	          margin: [-0.3,-0.65],
	          filename: 'boletin.pdf',
	          mode: 'avoid-all',
	          html2canvas: { scale: 3 },
	          letterRendering: true,
	          jsPDF: {orientation: 'portrait', unit: 'in', format: 'letter', compressPDF: true}
	        }).save();

	        $("#map-container").css("width","100%");
            $("#map-container").css("height","300px"); 
	      }

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
	var editandoF = false;
	var editandoE = false;

	function editarF(){
	editandoF = true;
	document.getElementById("secretButton").innerHTML = ''
	document.getElementById("datetime").innerHTML = '<div class="well">	Fecha: <input type="text" name="date" class="datepicker" placeholder="Selecciona la fecha"/> '+
													'Hora: <input type="text" id="time" placeholder="Selecciona la Hora"/></div>'
	document.getElementById("saveButton").innerHTML ='<button type="button" id="saveDate" class="btn btn-outline-success">Guardar</button>'									
		
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
		editandoE = true;
		document.getElementById("secretButton2").innerHTML = ''
		document.getElementById("NombreEvento").innerHTML = '<input type="Text" id="textEvent" name="nameEvent" size="15" placeholder="Nombre del evento" >'
		document.getElementById("saveButton").innerHTML ='<button type="button" onclick="saveDate()" class="btn btn-outline-success">Guardar</button>'
		document.getElementById("tipo").innerHTML = '<select id="opt">			<option>DT</option>			<option>TT</option>			<option>Huracán</option>		</select>'

	}

	function secretI(){
		if(editandoF){
			//nada
		}else{
		document.getElementById("secretButton").innerHTML = '<button type="button" class="btn btn-primary" ><span class="glyphicon glyphicon-edit"></span> <ion-icon name="create"></ion-icon> Editar Fecha</button>'
		}
		if(editandoE){
			//nada
		}else{
		document.getElementById("secretButton2").innerHTML = '<button type="button" class="btn btn-primary" ><span class="glyphicon glyphicon-edit"></span> <ion-icon name="create"></ion-icon> Editar Evento</button>'
		}
	}
	function secretO(){
		document.getElementById("secretButton").innerHTML = ' '
		document.getElementById("secretButton2").innerHTML = ' '
	}

	function secretoI(){
		document.getElementById("tabla").innerHTML = '<button id="mostrar" type="button" class="btn btn-primary"><span class="glyphicon glyphicon-edit"></span> <ion-icon name="create"></ion-icon> Editar regiones</button>'
	}
	function secretoO(){
		document.getElementById("tabla").innerHTML = ''
	}

	function saveDate(){
		if(editandoF){
		//document.getElementById("saveButton").innerHTML =''
		var newDate = new Date();
		newDate= $(".datepicker").datepicker("getDate");
		newDate.setHours($('#time').timepicker("getTime").getHours());
		//console.log(newDate);
		document.getElementById("datetime").innerHTML = newDate.toLocaleString("es-MX",fecha)+' / '+newDate.toLocaleString("es-MX",hora2)+' h';
		editandoF=false;
		}
		if(editandoE){
		//document.getElementById("saveButton").innerHTML =''
			if((document.getElementById("textEvent").value) != ''){
				document.getElementById("NombreEvento").innerHTML = document.getElementById("textEvent").value;
				document.getElementById("tipo").innerHTML = document.getElementById("opt").value;
				editandoE=false;
			}else{
				alert("Ingresa el nombre y categoría del evento");
				editarF();
				editarE();
			}
		}
		if((editandoE && editandoF) == false){
			document.getElementById("saveButton").innerHTML =''
		}
	}

	function guardaInfo(){
		document.getElementById("hora").innerHTML = document.getElementById("hour").value;
		document.getElementById("coords").innerHTML = document.getElementById("coordinates").value;
		document.getElementById("loc").innerHTML = document.getElementById("location").value;
		document.getElementById("despl").innerHTML = document.getElementById("displacement").value;
		document.getElementById("viento").innerHTML = document.getElementById("max-winds-s").value;
		document.getElementById("racha").innerHTML = document.getElementById("max-wind").value;
		document.getElementById("mas-info").innerHTML = document.getElementById("more-info").value;
//		console.log("Saved info!");
		$('#entradaInfo').hide();
		$('#cargaInfo').show();
	}

	function autoFillInfo(){
	 //console.log("Esta es la hora: "+document.getElementById("hora").textContent);
		document.getElementById("hour").value = document.getElementById("hora").textContent;
		document.getElementById("coordinates").value = document.getElementById("coords").textContent;
		document.getElementById("location").value = document.getElementById("loc").textContent;
		 document.getElementById("displacement").value = document.getElementById("despl").textContent;
		document.getElementById("max-winds-s").value =document.getElementById("viento").textContent;
		document.getElementById("max-wind").value = document.getElementById("racha").textContent;
		document.getElementById("more-info").value = document.getElementById("mas-info").textContent;
	}


	//FUNCION PARA AUTOAJUSTAR CAJA DE TEXTO 
	var autoExpand = function (field) {
		//console.log(field);
		// Reset field height
		field.style.height = 'auto';
		

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

	document.addEventListener('mouseover', function (event) {
		if (event.target.tagName.toLowerCase() !== 'textarea') return;
		autoExpand(event.target);
	}, false);


	document.addEventListener('input', function (event) {
		if (event.target.tagName.toLowerCase() !== 'textarea') return;
		autoExpand(event.target);
	}, false);

	//funciones para agregar y eliminar elementos de la tabla de Regiones Afectadas
	$(document).ready(function(){
		$('#tabla').click(function(){
			$('#regiones').hide();
			$('#tablaEditar').show();
		});
		$('#GuardaTabla').click(function(){
			$('#regiones').show();
			$('#tablaEditar').hide();
		});
	});
	var cont=0;
	function agregar(nameTable){
		cont++;
		var fila='<tr id="fila'+cont+'"><th class="solid">\
											<select id="NivelDeAlerta"> \
												<option value="1" style="background-color: red; ">ROJA</option>\
												<option value="2" style="background-color: orange;">NARANJA</option>\
												<option value="3" style="background-color: yellow;">AMARILLA</option>\
												<option value="4" style="background-color: #38BF34;">VERDE</option>\
												<option value="5" style="background-color: #4F81BC">AZUL</option>\
											</select>\
									</th>\
										<th class="solid">\
											<select id="Estado"> \
												<option value="">Baja California Norte</option>\
												<option value="">Baja California Sur</option>\
												<option value="">Sinaloa</option>\
											</select>\
											<select id="Region"> \
												<option value="">Todo el Edo</option> \
												<option value="">Norte</option>\
												<option value="">Centro</option>\
												<option value="">Sur</option>\
											</select>\
											<button id="fila'+cont+'" type="button" class="btn btn-outline-danger btn-sm" onclick="eliminar(this.id);" title="Elimina una por una las filas"><ion-icon name="close"></ion-icon></button>\
									</th>';
		
		$('#'+nameTable).append(fila);
	};

	function eliminar(id_fila){
		$('#'+id_fila).remove();
	}
	

	function ImprimeDatos(Param,a,b){
				$(Param).find('#NivelDeAlerta').each(function(){
	//			console.log($('option:selected',Param).text());
				switch(parseInt($('option:selected',Param).val())){
					case 1:
						document.getElementById("NearR").innerHTML += b+a;
						break;
					case 2:
						break;
					default:
						console.log('Error al guardar');
				}
			});
	}


	var a,b;
	function guardarDatos(){
	var elementos = $('#tablaEdos1').find('tr').length - 1;

	console.log("PRIMERA CUENTA: "+elementos);
	if(elementos == 0){
		var unico = true;
	}
	// limpieza de campos
	document.getElementById("NearR").innerHTML = '';
		$('#tablaEdos1').find('tr').each(function(){
			//console.log(this);
			$(this).find('#Estado').each(function(){
				//console.log($('option:selected',this).text());
				a = $('option:selected',this).text();
			});
			$(this).find('#Region').each(function(){
				console.log(elementos);
				//console.log($('option:selected',this).text());
				b = $('option:selected',this).text();
				/* En esta sección se aplica el formato de texto*/
				if(elementos == 0 && !unico){
					if(b=='Todo el Edo'){
						
					}else{
						
					}
				}

			});
			
			ImprimeDatos(this,a,b);
			elementos--;
		});
	}
	

	function generaArreglo(afectados,size){
	var lista = new Array();
	var temp;
	var contador=0;
		afectados.forEach(function(item, index, array){
			console.log(item.reg, index);
			console.log("Valor a copiar: ",afectados[index].reg);
			temp = afectados[index].reg;
			console.log("Valor copiado: ",temp);
			//lista.splice(0,1);
			//con esto si funciona 
			lista[index] = temp;
			//lista.push(temp);
			console.log("Tamaño de lista: ",lista.length);
			console.log("Valor guardado a la lista[0]: ",lista);
			afectados[index].reg = lista;
			lista.shift();
			lista.pop();
			//afectados[index].reg.splice(1);
			console.log("Result hasta el momento---> ",afectados);
		});
	/*
		for (var k=0; k<size; k++){
			//afectados[0].reg.splice(1,0);
			console.log("Valor a copiar: ",afectados[k].reg);
			temp = afectados[k].reg;
			console.log("Valor copiado: ",temp);
			lista[0] = temp;
			console.log("Valor guardado a la lista[0]: ",lista);
			afectados[k].reg = lista;
			console.log("Valor hasta el final ",afectados[k].reg);
			console.log("Result hasta el momento---> ",afectados[k]);
			console.log("A ver si dice lo mismo :v ",afectados[k].reg);
			if(k==2){
				break;
			}
		}*/
		console.log("Resultado de la funcion: ",afectados);
		return afectados;
	}

	function busquedaRecursiva(afectados,size){
	var res;

		for (var i=0; i<size; i++){
				//console.log("afectado iesimo: ",afectados);
				var edoAct = afectados[i].edo;
				var colorAct = afectados[i].na;
				//console.log("Edo Actual: ",edoAct);
				for (var j=0; j<size; j++){
					//console.log("Edo a comparar: ",afectados[j].edo);
					if(i!=j && afectados[j].edo == edoAct && afectados[j].na == colorAct){
						//console.log("hay un repetido: "+afectados[j].edo+" (J:"+j+") con: "+edoAct+" (I: "+i+") Con las regiones siguientes: "+afectados[i].reg+" y "+afectados[j].reg);
						afectados[i].reg = afectados[j].reg.concat(", "+afectados[i].reg);
						res = afectados[i].reg.split(", ");
						afectados[i].regArray.push(res);
						afectados.splice(j,1);
						size = afectados.length;	
						//console.log("llamada Iterativa");
						afectados = busquedaRecursiva(afectados,size);
						size = afectados.length;
					}
				}
			}
		if(i==size){
			return afectados;
		}
	}

	function guardaData(){
	var edo,reg,na;
	var afectados = [];
		$('#tablaEdos1').find('tr').each(function(){
		
			var find = $(this).find('#NivelDeAlerta');
				//console.log($('option:selected',find).text());
				na = $('option:selected',find).text();
				

			var find = $(this).find('#Estado');
				//console.log($('option:selected',find).text());
				edo = $('option:selected',find).text();

			

			var find = $(this).find('#Region');
				//console.log($('option:selected',find).text());
				reg = $('option:selected',find).text();
				/*if(reg == 'Todo el Edo'){
						var reg = '';
						console.log("nuevo valor de reg",reg);
					}*/
			
			var regArray=[];
			afectados.push({na,edo,reg,regArray});
			
		});

		afectados.shift();
		var size = afectados.length;
		//afectados= generaArreglo(afectados,size);
		//Encontrando repetidos y unificando
		afectados=busquedaRecursiva(afectados,size);
		
		
		//console.log("Valor retornado: ",afectados);
		imprimeTabla(afectados,size)

	var edo,reg,na;
	var afecta2 = [];
		$('#tablaEdos2').find('tr').each(function(){
		
			var find = $(this).find('#NivelDeAlerta');
				//console.log($('option:selected',find).text());
				na = $('option:selected',find).text();
				

			var find = $(this).find('#Estado');
				//console.log($('option:selected',find).text());
				edo = $('option:selected',find).text();
			

			var find = $(this).find('#Region');
				//console.log($('option:selected',find).text());
				if($('option:selected',find).text() != ''){
				reg = $('option:selected',find).text();
				}
			var regArray=[];
			afecta2.push({na,edo,reg,regArray});
			
		});

		afecta2.shift();
		var size = afecta2.length;
		//afectados= generaArreglo(afectados,size);
		//Encontrando repetidos y unificando
		afecta2=busquedaRecursiva(afecta2,size);
		
		
		console.log("Valor retornado: ",afecta2);
		imprimeTabla1(afecta2,size)

	$('#regiones').find('tr').each(function(){
			$(this).find('th').each(function(){
			if(this.textContent == ''){
				this.innerHTML = '--';
			}
			});
		});


	}

	String.prototype.replaceAt=function(index, replacement) {
		return this.substr(0, index) + replacement + this.substr(index + replacement.length);
	}
	String.prototype.insert_at=function(index, string)
	{   
	return this.substr(0, index) + string + this.substr(index);
	}

	function imprimeTabla(afectados,size){
		//imprime y da formato al texto de la tabla
		document.getElementById("NearR").innerHTML = "";
		document.getElementById("NearO").innerHTML = "";
		document.getElementById("NearY").innerHTML = "";
		document.getElementById("NearG").innerHTML = "";
		document.getElementById("NearB").innerHTML = "";

		//puntos, comas y finales
		afectados.forEach(function(item, index, array){
		
		if(afectados[index].reg.lastIndexOf(",") > 0){
			//console.log("valor del index: ",index);
			//console.log("Valor en index: ",afectados[index].regArray[0]);
			afectados[index].reg=afectados[index].reg.replaceAt(afectados[index].reg.lastIndexOf(","),"y");
			afectados[index].reg=afectados[index].reg.insert_at(afectados[index].reg.lastIndexOf("y")," ");
		}
		
		if(afectados[index].reg.includes('Todo el Edo')){
			switch(afectados[index].na){
				case "ROJA":
						document.getElementById("NearR").innerHTML += afectados[index].edo+"; ";
					break;
				case "NARANJA":
						document.getElementById("NearO").innerHTML += afectados[index].edo+"; ";
					break;
				case "AMARILLA":
						document.getElementById("NearY").innerHTML += afectados[index].edo+"; ";
					break;
				case "VERDE":
						document.getElementById("NearG").innerHTML += afectados[index].edo+"; ";
					break;
				case "AZUL":
						document.getElementById("NearB").innerHTML += afectados[index].edo+"; ";
					break;
				default:
					alert('Error al guardar');
			}
		}else{
			switch(afectados[index].na){
				case "ROJA":
						document.getElementById("NearR").innerHTML += afectados[index].reg +" de "+ afectados[index].edo+"; ";
					break;
				case "NARANJA":
						document.getElementById("NearO").innerHTML += afectados[index].reg +" de "+ afectados[index].edo+"; ";
					break;
				case "AMARILLA":
						document.getElementById("NearY").innerHTML += afectados[index].reg +" de "+ afectados[index].edo+"; ";
					break;
				case "VERDE":
						document.getElementById("NearG").innerHTML += afectados[index].reg +" de "+ afectados[index].edo+"; ";
					break;
				case "AZUL":
						document.getElementById("NearB").innerHTML += afectados[index].reg +" de "+ afectados[index].edo+"; ";
					break;
				default:
					alert('Error al guardar');
			}
		}

		
		});
	}

	function imprimeTabla1(afectados,size){
		//imprime y da formato al texto de la tabla

		document.getElementById("FarR").innerHTML = "";
		document.getElementById("FarO").innerHTML = "";
		document.getElementById("FarY").innerHTML = "";
		document.getElementById("FarG").innerHTML = "";
		document.getElementById("FarB").innerHTML = "";

		//puntos, comas y finales
		afectados.forEach(function(item, index, array){
		
		if(afectados[index].reg.lastIndexOf(",") > 0){
			//console.log("valor del index: ",index);
			//console.log("Valor en index: ",afectados[index].regArray[0]);
			afectados[index].reg=afectados[index].reg.replaceAt(afectados[index].reg.lastIndexOf(","),"y");
			afectados[index].reg=afectados[index].reg.insert_at(afectados[index].reg.lastIndexOf("y")," ");
		}

		if(afectados[index].reg.includes('Todo el Edo')){
			switch(afectados[index].na){
				case "ROJA":
						document.getElementById("FarR").innerHTML +=  afectados[index].edo+"; ";
					break;
				case "NARANJA":
						document.getElementById("FarO").innerHTML += afectados[index].edo+"; ";
					break;
				case "AMARILLA":
						document.getElementById("FarY").innerHTML += afectados[index].edo+"; ";
					break;
				case "VERDE":
						document.getElementById("FarG").innerHTML += afectados[index].edo+"; ";
					break;
				case "AZUL":
						document.getElementById("FarB").innerHTML += afectados[index].edo+"; ";
					break;
				default:
					alert('Error al guardar');
			}
		}else{
			switch(afectados[index].na){
				case "ROJA":
						document.getElementById("FarR").innerHTML += afectados[index].reg +" de "+ afectados[index].edo+"; ";
					break;
				case "NARANJA":
						document.getElementById("FarO").innerHTML += afectados[index].reg +" de "+ afectados[index].edo+"; ";
					break;
				case "AMARILLA":
						document.getElementById("FarY").innerHTML += afectados[index].reg +" de "+ afectados[index].edo+"; ";
					break;
				case "VERDE":
						document.getElementById("FarG").innerHTML += afectados[index].reg +" de "+ afectados[index].edo+"; ";
					break;
				case "AZUL":
						document.getElementById("FarB").innerHTML += afectados[index].reg +" de "+ afectados[index].edo+"; ";
					break;
				default:
					alert('Error al guardar');
			}
		}

		
		});
	}
	$(".EditInfo").on("mouseenter", function() { $('#ButtonInfo').show() });
	$(".EditInfo").on("mouseleave", function() { $('#ButtonInfo').hide() });
	$(".EditTable").on("mouseenter", function() { secretoI(); });
	$(".EditTable").on("mouseleave", function() { secretoO(); });
	$(".fecha").on("mouseenter", function() { secretI(); });
	$(".fecha").on("mouseleave", function() { secretO(); });
	$("#secretButton").click(function() { editarF(); });
	$("#secretButton2").click(function() { editarE(); });
	$("#saveButton").click(function() { saveDate(); });
	$("#pdf").click(function() {generaPdf();});
	

	$(".botoncito").click(function() { eliminar(this.id); });
	$("#bt_add1").click(function(){ agregar('tablaEdos1'); });
	$("#bt_add2").click(function(){ agregar('tablaEdos2'); });
	$("#GuardaTabla").click(function() { guardaData(); });
	$("#GuardaInfo").click(function() {guardaInfo()})
	
	$('#ButtonInfo').hide();
	$('#entradaInfo').hide();
	$('#Select-Event').hide();
	$('#tablaEditar').hide();
	$('.js-screenshot-image').hide();
	autoExpand(document.getElementById("subtitle"));
	$('#exampleModal').modal('show');
	$("#ButtonInfo").click(function(){ 
		$('#entradaInfo').show(); 
		$('#cargaInfo').hide(); 
		//autoExpand(document.getElementById("info"));
		autoFillInfo();
	});

	

	$(".form-check-input").click(function() {
    if(this.checked && this.value=="option2") {
        $('#Select-Event').show();
    }else{
    	$('#Select-Event').hide();
    }
});
   
});

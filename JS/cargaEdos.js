var cont=1;
var EdosJson;
$.getJSON('JS/estados.json', function(data){
	EdosJson = data;
	//console.log(EdosJson);
});

function loadEdo(estados){
	$('#tablaEdos1').html("");
	for(var i in estados){
		var numRegiones = Object.keys(estados[i]).length;
		var busqueda = EdosJson.filter(function(EdosJson){ 
			return EdosJson.nombre.toUpperCase() == i;
		});
		if(busqueda.length != 0){
			//(Si num regiones del MAPA es mayor o igual al numero de regiones ESTABLECIDAS)
			if(numRegiones >= busqueda[0].num_reg){
				//obtener meta datos
				var datosEdos=[];
				for(var j in estados[i]){
						datosEdos.push(j);
						}
				var fila='<tr id="fila'+cont+'">\
								<th class="solid">\
										<select id="NivelDeAlerta"> \
											<option value="1" style="background-color: red; ">ROJA</option>\
											<option value="2" style="background-color: orange;">NARANJA</option>\
											<option value="3" style="background-color: yellow;">AMARILLA</option>\
											<option value="4" style="background-color: #38BF34;">VERDE</option>\
											<option value="5" style="background-color: #4F81BC">AZUL</option>\
										</select>\
								</th>\
								<th class="solid">\
									<select id="Estado" class="edosFila'+cont+'">\
									</select>\
										<select id="Region" class="regFila'+cont+'">\
											<option data-arrayEdos="'+datosEdos+'" select="" value="-1">Todo el Edo</option>\
											<option value="0">Centro</option>\
											<option value="1">Norte</option>\
											<option value="2">Noreste</option>\
											<option value="3">Este</option>\
											<option value="4">Sureste</option>\
											<option value="5">Sur</option>\
											<option value="6">Suroeste</option>\
											<option value="7">Oeste</option>\
											<option value="8">Noroeste</option>\
										</select>\
										<button id="fila'+cont+'" type="button" class="btn btn-outline-danger btn-sm botoncito" title="Elimina una por una las filas"><ion-icon name="close"></ion-icon></button>\
										<button id="fila'+cont+'" type="button" class="btn btn-outline-info btn-sm rotate-90 switch"><ion-icon name="swap"></ion-icon></button>\
								</th>\
							</tr>'
					$('#tablaEdos1').append(fila);
					//Este segmento carga los estados en la lista
				    $.each(EdosJson,function(key, value){
				    	if(value.nombre.toUpperCase() != i){
				    		$('.edosFila'+cont).append('<option value=' + key.clave + '>' + value.nombre + '</option>');
							}else{
							$('.edosFila'+cont).append('<option selected="" value=' + key.clave + '>' + value.nombre + '</option>');	
							}
				    	});			
				cont++;
			}else{
				for(var j in estados[i]){
					var value = j;
					//console.log("este es el valor de j en "+i+": "+j); 	
					j = convierteRegion(j);
					var fila='<tr id="fila'+cont+'">\
								<th class="solid">\
										<select id="NivelDeAlerta"> \
											<option value="1" style="background-color: red; ">ROJA</option>\
											<option value="2" style="background-color: orange;">NARANJA</option>\
											<option value="3" style="background-color: yellow;">AMARILLA</option>\
											<option value="4" style="background-color: #38BF34;">VERDE</option>\
											<option value="5" style="background-color: #4F81BC">AZUL</option>\
										</select>\
								</th>\
								<th class="solid">\
									<select id="Estado" class="edosFila'+cont+'">\
									</select>\
									<select id="Region" class="regFila'+cont+'">\
										<option value="-1">Todo el Edo</option>\
										<option value="0">Centro</option>\
										<option value="1">Norte</option>\
										<option value="2">Noreste</option>\
										<option value="3">Este</option>\
										<option value="4">Sureste</option>\
										<option value="5">Sur</option>\
										<option value="6">Suroeste</option>\
										<option value="7">Oeste</option>\
										<option value="8">Noroeste</option>\
									</select>\
									<button id="fila'+cont+'" type="button" class="btn btn-outline-danger btn-sm botoncito" title="Elimina una por una las filas"><ion-icon name="close"></ion-icon></button>\
									<button id="fila'+cont+'" type="button" class="btn btn-outline-info btn-sm rotate-90 switch"><ion-icon name="swap"></ion-icon></button>\
								</th>\
							</tr>'
				    $('#tablaEdos1').append(fila);
					$('.regFila'+cont+' option:contains('+j+')').prop({selected: true});
				    $.each(EdosJson,function(key, value){
				    	//console.log("Este es el valor de i: "+i+" Este es el valor de value: "+value.nombre);
				    	if(value.nombre.toUpperCase() != i){
				    		$('.edosFila'+cont).append('<option value=' + key.clave + '>' + value.nombre + '</option>');
							}else{
							$('.edosFila'+cont).append('<option selected="" value=' + key.clave + '>' + value.nombre + '</option>');	
							}
				    });			
					cont++;
				}
			}

		}else{
			console.log("No se encuentra "+i+" en la lista");		
		}

		/*for(var j in estados[i]){
			var value = j;
			//console.log("este es el valor de j en "+i+": "+j); 	
			j = convierteRegion(j);
			var fila='<tr id="fila'+cont+'">\
						<th class="solid">\
						<p>Fila: '+cont+'</p>\
								<select id="NivelDeAlerta"> \
									<option value="1" style="background-color: red; ">ROJA</option>\
									<option value="2" style="background-color: orange;">NARANJA</option>\
									<option value="3" style="background-color: yellow;">AMARILLA</option>\
									<option value="4" style="background-color: #38BF34;">VERDE</option>\
									<option value="5" style="background-color: #4F81BC">AZUL</option>\
								</select>\
						</th>\
						<th class="solid">\
							<select id="Estado" class="edosFila'+cont+'">\
							<option value="'+i+'">'+i+'</option>\
							</select>\
								<select id="Region" class="regFila'+cont+'">\
									'+optionTodos+'\
									<option value="'+value+'">'+j+'</option>\
								</select>\
								<button id="fila'+cont+'" type="button" class="btn btn-outline-danger btn-sm botoncito" title="Elimina una por una las filas"><ion-icon name="close"></ion-icon></button>\
						</th>\
					</tr>'

			
			$('#tablaEdos1').append(fila);
			
		    $.each(EdosJson,function(key, value){
		    	//console.log("Este es el valor de i: "+i+" Este es el valor de value: "+value.nombre);
		    	if(value.nombre != i){
		    		$('.edosFila'+cont).append('<option value=' + key.clave + '>' + value.nombre + '</option>');
					}
		    	});			
			cont++;
		}*/

		$(".botoncito").click(function(event){
			//console.log("elemento a eliminar: "+this.id);
			event.stopPropagation();
			event.stopImmediatePropagation();
			eliminar(this.id); 
		});
		$(".switch").click(function(event){
			event.stopPropagation();
			event.stopImmediatePropagation();
			change(this.id)})
		//muestra botones de añadir estados hasta terminar la carga de estados
		$("#bt_add1").show();
		$("#bt_add2").show();
	}
	
		
}


function convierteRegion(regAct){
	var newRegion;
	switch(regAct){
		case "C":
				newRegion = 'Centro';
			break;
		case "N":
				newRegion = 'Norte';
			break;
		case "NE":
				newRegion = 'Noreste';
			break;
		case "E":
				newRegion = 'Este';
			break;
		case "SE":
				newRegion = 'Sureste';
			break;
		case "S":
				newRegion = 'Sur';
			break;
		case "SW":
				newRegion = 'Suroeste';
			break;
		case "W":
				newRegion = 'Oeste';
			break;
		case "NW":
				newRegion = 'Noroeste';
			break;
		default:
			alert('Coord No existe');
	}
	return newRegion;
}
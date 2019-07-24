var cont=1;

function loadEdo(estados){
	for(var i in estados){
		for(var j in estados[i]){

			console.log("este es el valor de j en "+i+": "+j);
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
							<option value="">'+i+'</option>\
							</select>\
								<select id="Region" class="regFila'+cont+'">\
									<option value="">'+j+'</option>\
								</select>\
								<button id="fila'+cont+'" type="button" class="btn btn-outline-danger btn-sm botoncito" title="Elimina una por una las filas"><ion-icon name="close"></ion-icon></button>\
						</th>\
					</tr>'
			$('#tablaEdos1').append(fila);
			$('#regFila'+cont)
					.append($("<option></option>")
					//.attr("value",key)
	                .text(j)); 		
		cont++;
		}

		$(".botoncito").click(function(event){
			//console.log("elemento a eliminar: "+this.id);
			event.stopPropagation();
			event.stopImmediatePropagation();
			eliminar(this.id); 
		});
		
	}
	
		
}
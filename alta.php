<?php
	session_start();
	require_once("pagina_fns.php");

	/* if(!isset($_SESSION["username"])) {
		$_SESSION['username'] = $ar["username"];
		$host  = $_SERVER['HTTP_HOST'];
		$uri   = rtrim(dirname($_SERVER['PHP_SELF']), '/\\');
		$extra = 'index.php';
		header("Location: http://$host$uri/$extra");
	} */
?>
<!DOCTYPE html>
<html lang="es">
<head>
	<!--ICON PAGE CNPC-->
	<link rel="shortcut icon" href="http://www.atlasnacionalderiesgos.gob.mx/Imagenes/Logos/cenapred_icon.ico"/>
	<meta charset="UTF-8" name="viewport" content="width=device-width, initial-scale=1.0">
	<link rel="shortcut icon" href="">
	<!--JS IONICON-->
	<script src="https://unpkg.com/ionicons@4.5.5/dist/ionicons.js"></script>
	<!--CSS BOOTSTRAP-->
	<link rel="stylesheet" href="https://stackpath.bootstrapcdn.com/bootstrap/4.3.1/css/bootstrap.min.css" integrity="sha384-ggOyR0iXCbMQv3Xipma34MD+dH/1fQ784/j6cY/iJTQUOhcWr7x9JvoRxT2MZw1T" crossorigin="anonymous">
	<!--JS BOOTSTRAP & JQUERY-->
	<script src="http://code.jquery.com/jquery-3.3.1.min.js"  integrity="sha256-FgpCb/KJQlLNfOu91ta32o/NMZxltwRo8QtmkMRdAu8="  crossorigin="anonymous"></script>
	<script src="https://cdnjs.cloudflare.com/ajax/libs/popper.js/1.14.7/umd/popper.min.js" integrity="sha384-UO2eT0CpHqdSJQ6hJty5KVphtPhzWj9WO1clHTMGa3JDZwrnQq4sF86dIHNDz0W1" crossorigin="anonymous"></script>
	<script src="https://stackpath.bootstrapcdn.com/bootstrap/4.3.1/js/bootstrap.min.js" integrity="sha384-JjSmVgyd0p3pXB1rRibZUAYoIIy6OrQ6VrjIEaFf/nJGzIxFDsf4x0xIM+B07jRM" crossorigin="anonymous"></script>
	<!--DATE PICKER AND TIME PICKER-->
	<link rel="stylesheet" href="css/bootstrap-datepicker.css">
	<link rel="stylesheet" href="css/jquery.timepicker.min.css">
	<script src="JS/bootstrap-datepicker.js"></script>
	<script src="JS/bootstrap-datepicker.es.min.js" charset="UTF-8"></script>
	<script src="JS/jquery.timepicker.min.js"></script>
	<!-- PDF's html2pdf -->
	<script src="dist/html2pdf.bundle.js"></script>
	<!-- Handlebars -->
	<script src="./lib/handlebars.js"></script>
	<!-- ARCGIS MAP's -->
	<link rel="stylesheet" href="https://js.arcgis.com/4.11/esri/css/main.css">
	<script src="https://js.arcgis.com/4.11/"></script>
	<!-- Styles -->
	<link rel="stylesheet" href="./css/styles.css">
	<link rel="stylesheet" href="./pdf/styles.css">
	<!-- se tuvo que agregar este elemento de CSS para modificar las propiedades de bootstrap 4.3.1 y que el sub Nav Bar tenga una vista correcta -->
	<link rel="stylesheet" href="./css/initialNav.css">
	<title>SIAT-CT</title>
</head>
<body>
	<iframe id="iFrame-nav-gob" src="/nav.html" frameborder="0" style="width: 100%;height: 60px;margin-bottom: -7px;"></iframe>
	<?php includeNav(); ?>
	<div class="box" id="root">
		<!-- Menú del Modal -->
		<div class="modal fade" id="exampleModal" tabindex="-1" role="dialog" aria-labelledby="exampleModalLabel" aria-hidden="true" data-backdrop="static" data-keyboard="false">
		  <div class="modal-dialog" role="document">
		    <div class="modal-content">
		      <div style="background-color: #35695D; color:white" class="modal-header">
		        <h5 class="modal-title"  id="exampleModalLabel">Menú de Inicio</h5>
		        <!-- <button type="button" class="close" data-dismiss="modal" aria-label="Close" title="Al cerrar esta ventana editarás un nuevo boletín">
		          <span aria-hidden="true">&times;</span>
		        </button> hasta aqui comentario-->
		      </div>
		      <div class="modal-body">
		        Elige la opción deseada:
		        <div class="form-check">
				  <input  class="form-check-input" type="radio" name="exampleRadios" id="exampleRadios1" value="option1" checked>
				  <label class="form-check-label" for="exampleRadios1">
				    Generar nuevo boletín
				  </label>
				</div>
				<div class="form-check">
				  <input class="form-check-input" type="radio" name="exampleRadios" id="seguimientoOption" value="seguimiento">
				  <label class="form-check-label" for="seguimientoOption">
				    Dar continuidad a un evento
				  </label>
				</div>
				<br>
				<div id="years"></div>
				<div id="activeEvents"></div>
		      	</div>
		      <div class="modal-footer">
		        <button id="next" type="button" class="btn btn-primary" data-dismiss="modal">Continuar</button>
		      </div>
		    </div>
		  </div>
		</div>
		<!-- Menu de confirmación -->
		<div class="modal fade" id="confirm" tabindex="-1" role="dialog" aria-labelledby="exampleModalLabel" aria-hidden="true">
		  <div class="modal-dialog" role="document">
		    <div class="modal-content">
		      <div style="background-color: #35695D; color:white" class="modal-header">
		        <h5 class="modal-title" id="exampleModalLabel">Ventana de confirmación</h5>
		        <button type="button" class="close" data-dismiss="modal" aria-label="Close">
		          <span aria-hidden="true">&times;</span>
		        </button>
		      </div>
		      <div class="modal-body">
		        ¿Estás seguro que éste será el último boletín?
		        <br><center>
		        	<button id="yes" type="button" class="btn btn-success" data-dismiss="modal">SI</button>
					<button id="no" type="button" class="btn btn-danger" data-dismiss="modal">NO</button>
		        </center>
		      </div>
		      <div class="modal-footer">
		        <button type="button" class="btn btn-secondary" data-dismiss="modal">Cancelar</button>
		      </div>
		    </div>
		  </div>
		</div>
		<!-- Logo printing -->
		<div class="modal fade" id="printing" tabindex="-1" role="dialog" aria-labelledby="exampleModalLabel" aria-hidden="true">
		  <div class="modal-dialog" role="document">
		    <center>
		  	<img src="img/loading.gif">
		 	</center>
		  </div>
		</div>
		<div class="logos disable_on_print">
			<div align="left">
				<img src="img/head1.png">
			</div>
			<div align="center">
				<img src="img/head2.png">
			</div>
			<div align="right">
				<img src="img/Sinaprocsolo.png">
			</div>
		<br>
		</div>

		<div class="titulo">
			BOLETÍN DEL SISTEMA DE ALERTA TEMPRANA PARA CICLONES TROPICALES SIAT-CT
		</div>
		
		<div align="center" class="fecha" >Generado el <span id="datetime"></span>
						<span class="card border-info mb-3" id="datePicker">
							<div class="well">
								Fecha: <input type="text" name="date" class="datepicker" placeholder="Selecciona la fecha" autocomplete="off"/>
								Hora: <input type="text" id="time" placeholder="Selecciona la Hora" autocomplete="off"/>
								<button  type="button" id="saveDate" class="btn btn-outline-success  btn-sm">Guardar</button>
							</div>
						</span>
						<button id="ButtonFecha"type="button" class="btn btn-primary">
							<span class="glyphicon glyphicon-edit"></span> 
							<ion-icon name="create"></ion-icon> 
							Editar Fecha
						</button>
						<span id="cicloneDescription">
								<span id="type"></span>
								<span id="name"></span>
								<span id="sea"></span>
						</span>
						<div id="EditPreviousEvent">
							<span id="insertDataEvent">
								<select id="opt">
									<option>CTP</option>	
									<option>TT</option>
									<option>DT</option>
									<option>H1</option>
									<option>H2</option>
									<option>H3</option>
									<option>H4</option>
									<option>H5</option>
									<option>BP</option>
									<option>BPR</option>
									<option>CPT</option>
								</select>
								<select id="oceano">			
										<option data-ocean="P" value="EP">PACÍFICO</option>			
										<option data-ocean="A" value="AT">ATLÁNTICO</option>	
								</select> 
								<input type="Text" id="textEvent" name="nameEvent" size="15" placeholder="Nombre del evento">
								<span id="saveEvent"><button type="button" class="btn btn-outline-success">Guardar</button></span>
								<span id="CancelSaveEvent"><button type="button" class="btn btn-outline-danger">Cancelar</button></span>
							</span>
					    </div>
						</span>No. <span id="Number"></span>
						<button id="ButtonEvento" type="button" class="btn btn-primary">
								<span class="glyphicon glyphicon-edit"></span> 
								<ion-icon name="create"></ion-icon> Editar Evento
						</button>
			<!--<input type="Number" name="numberOfPublish" size="0.5" min="1" max="100" value="1" >-->
		</div>
		<div>
			<textarea id="subtitle" rows="1" class='autoExpand encabezado' placeholder='Encabezado del boletín'></textarea>
		</div>
		<div class="tableData">
			<div class="tableDataL">
				<div class="solid">
						<div class="segment-table" style="height: 100%">
						<div class="tituloTable EditTable">NIVEL DE ALERTA SIAT - CT
							<button id="mostrar" type="button" class="btn btn-primary"><span class="glyphicon glyphicon-edit"></span> <ion-icon name="create"></ion-icon> Editar regiones</button>
						</div>
							<div id="regiones" style="height: calc(100% - 43px)">
								<table style=" border-collapse: collapse; width: 100%; height: 100%; text-align: center;">
									<tr>
										<th class="adjust" style="background-color: #D9D9D9">CICLÓN ACERCÁNDOSE</th>
										<th class="adjust" style="background-color: #D9D9D9">CICLÓN ALEJÁNDOSE</th>
									</tr>
									<tr>
										<th class="" style="background-color: red; ">ROJA</th>
										<th class="" style="background-color: red; ">ROJA</th>
									</tr>
									<tr>
										<th id="NearR" class="adjust regularTxt">--</th>
										<th id="FarR" class="adjust regularTxt">--</th>
									</tr>
									<tr>
										<th class="adjust" style="background-color: orange;">NARANJA</th>
										<th class="adjust" style="background-color: orange;">NARANJA</th>
									</tr>
									<tr>
										<th id="NearO" class="adjust regularTxt">--</th>
										<th id="FarO" class="adjust regularTxt">--</th>
									</tr>
									<tr>
										<th class="adjust" style="background-color: yellow;">AMARILLA</th>
										<th class="adjust" style="background-color: yellow;">AMARILLA</th>
									</tr>
									<tr>
										<th id="NearY" class="adjust regularTxt">--</th>
										<th id="FarY" class="adjust regularTxt">--</th>
									</tr>
									<tr>
										<th class="adjust" style="background-color: #38BF34;">VERDE</th>
										<th class="adjust" style="background-color: #38BF34;">VERDE</th>
									</tr>
									<tr><th id="NearG" class="adjust regularTxt">--</th>
										<th id="FarG" class="adjust regularTxt">--</th>
									</tr>
									<tr>
										<th class="adjust" style="background-color: #4F81BC">AZUL</th>
										<th class="adjust" style="background-color: #4F81BC">AZUL</th>
									</tr>
									<tr>
										<th id="NearB" class="adjust regularTxt">--</th>
										<th id="FarB" class="adjust regularTxt">--</th>
									</tr>
								</table>
							</div>
							<div id="loading_table" class="text-center">
								  	<img src="img/loading.gif"  >
							</div>
							<div id="tablaEditar" class="tableRegiones solid">
						 		<div class="solid" style="background-color: #DBBE99">CICLÓN ACERCÁNDOSE</div>
									<div class="solid">
										<table id="tablaEdos1" style=" border-collapse: collapse; width: 100%; text-align: center;">
											<thead>
												<tr id="Encabezado">
													<th class="solid" style="background-color: #D9D9D9">Nivel de Alerta</th>
													<th class="solid" style="background-color: #D9D9D9">Región afectada</th>	
												</tr>
											</thead>
											<tbody></tbody>
											<!--<tr id="filatest">
													<th class="solid">
															<select id="NivelDeAlerta"> 
																<option value="1" style="background-color: red; ">ROJA</option>
																<option value="2" style="background-color: orange;">NARANJA</option>
																<option value="3" style="background-color: yellow;">AMARILLA</option>
																<option value="4" style="background-color: #38BF34;">VERDE</option>
																<option value="5" style="background-color: #4F81BC">AZUL</option>
															</select>
													</th>
													<th class="solid">
														<select id="Estado"> 
															<option value="1">Baja California Norte</option>
															<option value="2">Baja California Sur</option>
															<option value="3">Sinaloa</option>
														</select>
															<select id="Region">
																<option value="-1">Todo el Edo</option>
																<option value="0">Centro</option>
																<option value="1">Norte</option>
																<option value="2">Noreste</option>
																<option value="3">Este</option>
																<option value="4">Sureste</option>
																<option value="5">Sur</option>
																<option value="6">Suroeste</option>
																<option value="7">Oeste</option>
																<option value="8">Noroeste</option>
															</select>
															<button id="filatest" type="button" class="btn btn-outline-danger btn-sm botoncito" title="Elimina una por una las filas"><ion-icon name="close"></ion-icon></button>
															<button id="filatest" type="button" class="btn btn-outline-info btn-sm rotate-90"><ion-icon name="swap"></ion-icon></button>
													</th>
											</tr>-->
										</table>
										<button  id="bt_add1" type="button" class="btn btn-outline-info btn-sm" title="Agregar una región"><ion-icon name="add"></ion-icon></button>
									</div>
								<div class="solid" style="background-color: #DBBE99">CICLÓN ALEJÁNDOSE</div>
								<div class="solid">
									<div class="solid">
									<table id="tablaEdos2" style=" border-collapse: collapse; width: 100%; text-align: center;">
										<thead>
											<tr id="Encabezado">
												<th class="solid" style="background-color: #D9D9D9">Nivel de Alerta</th>
												<th class="solid" style="background-color: #D9D9D9">Región afectada</th>
											</tr>
										</thead>
										<tbody></tbody>
								 		<!--<tr id="filatest">
											<th class="solid">
													<select id="NivelDeAlerta"> 
														<option value="1" style="background-color: red; ">ROJA</option>
														<option value="2" style="background-color: orange;">NARANJA</option>
														<option value="3" style="background-color: yellow;">AMARILLA</option>
														<option value="4" style="background-color: #38BF34;">VERDE</option>
														<option value="5" style="background-color: #4F81BC">AZUL</option>
													</select>
											</th>
											<th class="solid">
													<select id="Estado"> 
														<option value="">Baja California Norte</option>
														<option value="">Baja California Sur</option>
														<option value="">Sinaloa</option>
													</select>
													<select id="Region"> 
														<option value="">Norte</option>
														<option value="">Centro</option>
														<option value="">Sur</option>
													</select>
													<button id="filatest" type="button" class="btn btn-outline-danger btn-sm botoncito" title="Elimina una por una las filas"><ion-icon name="close"></ion-icon></button>
											</th>
										</tr>-->
									</table>
									<button id="bt_add2" type="button" class="btn btn-outline-info btn-sm" title="Agregar una región"><ion-icon name="add"></ion-icon></button>
								</div>
								<center>
									<button class="btn btn-outline-success" id="GuardaTabla">Guardar datos</button>	
								</center>
								</div>	
							</div>	
						</div>
				</div>
				<div class="solid">
					<div>
						<div class="tituloTable EditInfo">INFORMACIÓN GENERAL
							<button id="ButtonInfo" type="button" class="btn btn-primary"><span class="glyphicon glyphicon-edit"></span> <ion-icon name="create"></ion-icon> Editar información</button> 
						</div>
							<div id="cargaInfo">
								<div class="dataH"> HORA: <element class="regularTxt" id="hora"></element></div>
								<div class="dataH"> COORDENADAS: <element class="regularTxt" id="coords"></element> </div>
								<div class="dataH"> LOCALIZACIÓN: <element class="regularTxt" id="loc"></element> </div>
								<div class="dataH"> DESPLAZAMIENTO: <element class="regularTxt" id="despl"></element> </div>
								<div class="dataH"> VIENTOS MÁXIMOS SOSTENIDOS: <element class="regularTxt" id="viento"></element> </div>
								<div class="dataH"> RACHAS DE VIENTO MÁXIMAS: <element class="regularTxt" id="racha"></element> </div>
								<div class="dataH"> PRESIÓN BAROMÉTRICA: <element class="regularTxt" id="presion"></element> </div>
								<div id="mas-info" >Para más información consulte el aviso más reciente del Servicio Meteorológico Nacional.</div>
							</div>
							<div id="entradaInfo">
								<div class="dataH"> HORA:  <input id="hour" class="InputInfo" type="Text" name="nameEvent" size="15" placeholder="Hora del evento" > </div>
								<div class="dataH"> COORDENADAS:  <input id="coordinates" class="InputInfo"type="Text" name="nameEvent" size="20" placeholder="Coordenadas del evento" ></div>
								<div class="dataH"> LOCALIZACIÓN:  <input id="location" class="InputInfo"type="Text" name="nameEvent" size="20" placeholder="Localización del evento" > </div>
								<div class="dataH"> DESPLAZAMIENTO: <input id="displacement" class="InputInfo"type="Text" name="nameEvent" size="20" placeholder="Desplazamiento del evento" > </div>
								<div class="dataH"> VIENTOS MÁXIMOS SOSTENIDOS:  <input id="max-winds-s" class="InputInfo"type="Text" name="nameEvent" size="20" placeholder="Vientos máximos del evento" > </div>
								<div class="dataH"> RACHAS DE VIENTO MÁXIMAS:  <input id="max-wind" class="InputInfo"type="Text" name="nameEvent" size="15" placeholder="Viento del evento" > </div>
								<div class="dataH"> PRESIÓN BAROMÉTRICA: <input id="pressure" class="InputInfo" type="Text" name="nameEvent" size="15" placeholder="Presión barométrica alcanzada" > </div>
								<textarea  id="more-info" class='autoExpand comentarios regularTxt' placeholder='Información adicional'>Para más información consulte el aviso más reciente del Servicio Meteorológico Nacional.</textarea>
								<center>
									<button class="btn btn-outline-success" id="GuardaInfo">Guardar Información</button>
								</center>	
							</div>
						
					</div>
				</div>
				<div class="solid">
					<div class="tituloTable">ZONAS DE VIGILANCIA NHC-SMN</div>
						<textarea id="zonas" class='autoExpand comentarios regularTxt' placeholder='Escribe aquí las zonas establecidas para este sistema'></textarea>
						<p id="zonasp"  class='comentarios regularTxt'></p>
				</div>
			</div> 
			<div class="tableDataR">
				<div class="solid">
					<div id="capturaMapa" class="tituloTable">PRONÓSTICO DE TRAYECTORIA 
						<button id="capture" type="button" class="btn btn-primary"><span class="glyphicon glyphicon-edit"></span> <ion-icon name="camera"></ion-icon> Obtener captura</button> 
						<button id="mapa_ciclon" type="button" class="btn btn-danger"><ion-icon name="map"></ion-icon> Vista mapa</button>
						<button id="abort" type="button" class="btn btn-danger"><ion-icon name="close-circle"></ion-icon>Cancelar subida</button>
						<button id="uploadImg" type="button" class="btn btn-primary"> <ion-icon name="image"></ion-icon> Subir trayectoria</button> 
						<div id="customFileLangDiv" style="display:none;" class="custom-file">
							<input type="file" class="custom-file-input" id="customFileLang">
							<label class="custom-file-label" for="customFileLang">Seleccionar Archivo</label>
						</div>	
					</div>
					<div id="mapaDiv">
						<div id="map-container">
							<div id="stormSelection">
								<div class="title">Ciclón tropical</div>
								<div class="options">
									<select name="stormsActive" id="stormsActive">
										<option value="">Cargando</option>
									</select>
								</div>
								<div style="display: grid;grid-template-columns:auto auto;margin-top:3px;">
									<button id="toggleWinds" class="btn btn-secondary" style="padding: 1px;">
										<img src="img/wind.png" alt="vientos" width="25px" height="25px">
									</button>
									<span style="font-size: 0.75em; padding:5px 0 5px 2px;">Vientos de 34Kt</span>
								</div>
							</div>
							<div id="map"></div>
						</div>
						<img id="imagen" class="js-screenshot-image"/>
						<img id="mapaTemp" src="#"  alt="nuevo mapa" style="width:100%; height:100%;display:none;">				
					</div>		
				</div>

				<div class="solid">
				<div class="tituloTable">COMENTARIOS</div>
				<textarea id="comments" class='autoExpand comentarios regularTxt' placeholder='Escribe aquí los comentarios'></textarea>
				<p id="commentsp"  class='comentarios regularTxt'></p>
				</div>
			</div>
		</div>
		<div class="disable_on_print" align="center">
			<div class="finalSIAT">
				<input type="checkbox" name="finalSIAT" id="finalSIAT">
				<label for="finalSIAT">Boletín Final</label>
			</div>
			<div>
			    <input type=file id="media" name="media" multiple>
			</div>

			<div class="progress">
			  <div id="progressBar" class="progress-bar" role="progressbar" aria-valuenow="0" aria-valuemin="0" aria-valuemax="100" style="width: 0%;">
			    0%
			  </div>
			</div>

			<div id="filesUploaded"></div>
		</div>
		
			<div class="tituloEfectos">
			EFECTOS
			</div>
			<br class="disable_on_print" >
			<div id="efectos" class="solid">
					<div class="tituloTable solido">Viento</div>
						<textarea id="efectoViento" data-efectoId="1" data-limit-rows="true" max-rows="3" rows="1" class='autoExpand comentarios regularTxt' placeholder='Escribe aquí '></textarea>
						<p id="efectoVientop"  class='comentarios regularTxt'></p>
					<div class="tituloTable solido">Lluvia</div>
						<textarea id="efectoLluvia" data-efectoId="2" data-limit-rows="true" max-rows="3" rows="1" class='autoExpand comentarios regularTxt' placeholder='Escribe aquí '></textarea>
						<p id="efectoLluviap"  class='comentarios regularTxt'></p>
					<div class="tituloTable solido">Oleaje elevado</div>
						<textarea id="efectoOleaje" data-efectoId="3" data-limit-rows="true" max-rows="3" rows="1" class='autoExpand comentarios regularTxt' placeholder='Escribe aquí '></textarea>
						<p id="efectoOleajep"  class='comentarios regularTxt'></p>
					<div class="tituloTable solido">Marea de tormenta</div>
						<textarea id="efectoMarea" data-efectoId="4" data-limit-rows="true" max-rows="3" rows="1" class=' autoExpand comentarios regularTxt' placeholder='Escribe aquí '></textarea>
						<p id="efectoMareap"  class='comentarios regularTxt'></p>
			</div>
		<br>
		<div id="enable_on_print" style="display:none;">
			<div class="titulo">
				ALERTA DE <element  class="TitleTipo"></element> EN EL OCÉANO <element  class="TitleOceano"></element>
			</div>
			<div id="efectos" class="solid">
					<div class="tituloTable solido">Cierre de puertos</div>
					<element class="regularTxt">Consulte a la Unidad de Capitanías de Puerto y Asuntos Marítimos de la Secretaría de Marina para conocer más información sobre el cierre de puertos por condiciones meteorológicas adversas en el siguiente enlace:
					<a href="https://www.gob.mx/semar/unicapam/acciones-y-programas/estado-operacional-de-puertos">https://www.gob.mx/semar/unicapam/acciones-y-programas/estado-operacional-de-puertos</a></element> 
					<div class="tituloTable solido">Riesgo por inestabilidad de laderas</div>
					<element class="regularTxt">Consulte el Atlas Nacional de Riesgos del Centro Nacional de Prevención de Desastres para más información: <br>
	&#9679 Riesgo por inestabilidad de laderas: <br><a href="http://www.atlasnacionalderiesgos.gob.mx/archivo/inestabilidad-laderas.html">http://www.atlasnacionalderiesgos.gob.mx/archivo/inestabilidad-laderas.html 
	</a><br><a href="http://www.atlasnacionalderiesgos.gob.mx/archivo/indicadores-municipales.html 
	">http://www.atlasnacionalderiesgos.gob.mx/archivo/indicadores-municipales.html</a></element> 
					<div class="tituloTable solido">Riesgo por inundaciones</div>
					<element class="regularTxt">Consulte el Atlas Nacional de Riesgos del Centro Nacional de Prevención de Desastres para más información: <br>
	<a href="http://www.atlasnacionalderiesgos.gob.mx/app/mapa/?capa=vulnInund">http://www.atlasnacionalderiesgos.gob.mx/app/mapa/?capa=vulnInund 
	</a><br><a href="http://www.atlasnacionalderiesgos.gob.mx/app/mapa/?capa=peligroInund">http://www.atlasnacionalderiesgos.gob.mx/app/mapa/?capa=peligroInund</a></element> 
			</div>
			<div class="tituloEfectos">
				<u>RECOMENDACIONES POR LA EVOLUCIÓN DEL CICLÓN TROPICAL</u>
			</div>
			<br class="disable_on_print">	
			<div class="QR_box">
				<div style="margin: 10px;">
					<strong>POBLACIÓN EN GENERAL</strong> – Mantenerse informada sobre las condiciones meteorológicas en sus lugares de residencia, tener presente su plan familiar de protección civil y atender las recomendaciones del Sistema Nacional de Protección Civil.
					<br><strong>NAVEGACIÓN MARÍTIMA</strong> – Precauciones en inmediaciones de este sistema, atender indicaciones de Capitanías de Puerto, Secretaría de Marina-Armada de México y autoridades de Protección Civil. 
					<br><strong>NAVEGACIÓN AÉREA</strong> – Precauciones en las inmediaciones de este sistema, atender indicaciones del Servicio a la Navegación del Espacio Aéreo Mexicano.
					<br><strong>MEDIOS DE COMUNICACIÓN</strong> – Atender y difundir información emitida por el SINAPROC y fuentes oficiales sobre la temporada de ciclones tropicales y lluvias.
					<br><strong>UNIDADES ESTATALES DE PROTECCIÓN CIVIL</strong> – Atender la evolución de este ciclón tropical, notificar a integrantes del SINAPROC en ámbitos estatales y municipales, así como considerar las siguientes recomendaciones de acuerdo al nivel de  alerta del Sistema de Alerta Temprana para Ciclones Tropicales (SIAT-CT):
				</div>
				<div>
					<a href="http://www.cenapred.unam.mx/es/Publicaciones/archivos/264-INFOGRAFACICLNACERCNDOSE.PDF"><img src="img/QR_1.PNG" width="100%"></a>
					<a href="http://www.cenapred.gob.mx/es/Publicaciones/archivos/264-INFOGRAFACICLNALEJNDOSE.PDF"><img src="img/QR_2.PNG" href="" width="100%"></a>
				</div>
			</div>
			<hr style="height:5px; visibility:hidden; margin:0px" />
			<img src="img/bloque.png" width="100%">
			<!--NUEVA PAGINA-->
			<br>
			<div id="pag_3" class="titulo" style="page-break-before: always;">
				ALERTA DE <element  class="TitleTipo"></element> EN EL OCÉANO <element  class="TitleOceano"></element>
			</div>
			<br>
			<div class="tituloEfectos">
				<u>RECOMENDACIONES POR LA EVOLUCIÓN DEL CICLÓN TROPICAL</u>
			</div>
			<br>
			<div class="QR_box">
				<div style="margin: 10px;">
					<strong>VIENTO FUERTE:</strong>
	 				<br>
					<br>&#9679 Extreme precauciones ante presencia de vientos fuertes y ponga especial atención a construcciones de material endeble, así como posibles afectaciones en espectaculares y tendido eléctrico.
					<br>&#9679 Extremar precauciones al tránsito vehicular en carreteras y caminos rurales, vados y puentes  serranos, así como zonas urbanas, si es necesario buscar rutas alternas.
					<br>&#9679 En caso de estar transitando por la calle, extreme precauciones ya que las ráfagas de viento pueden arrastrar o convertir objetos en proyectiles, busque refugio en casas y edificios de construcción sólida.
					<br>&#9679 En su domicilio mantenga abiertas algunas de las ventanas (preferentemente a sotavento), y evita permanecer en habitaciones enfrentadas a la dirección de donde sopla el viento que tenga ventanales. Permanezca alejado de las ventanas y en caso de ser necesario puede protegerse debajo de muebles sólidos y pesados o escaleras interiores.
					<br>
					<br><strong>LLUVIAS E INUNDACIONES:</strong>
					<br>
					<br>&#9679 Extreme precauciones al transitar por brechas y caminos rurales ante baja visibilidad, terreno resbaladizo, posibles deslaves de sierras o avenidas súbitas de agua con material de arrastre.
					<br>&#9679 No transite por zonas inundadas; ya que puede haber sumergidos cables con energía eléctrica, no se acerque a postes o cables de electricidad.
					<br>&#9679 No intente cruzar cauces de ríos, arroyos, vados y zonas bajas porque puede ser arrastrado por el agua.
					<br>&#9679 Si viaja en su vehículo, extreme precaución al desplazarse en carreteras especialmente en zonas de sierra y costa; así como en vados y brechas, debido a la presencia de vientos y lluvias, no se confíe del potencial y peso de su vehículo especialmente si es todo terreno.
					<br>&#9679 No cruce puentes si el agua lo pasa por encima.
					<br>&#9679 No restablezca la energía eléctrica hasta que esté seguro de que no hay cortos circuitos. Si tiene duda sobre el estado de su casa, solicite el apoyo de las autoridades, mientras tanto no la utilice.
					<br>&#9679 No tome líquidos ni alimentos que hayan estado en contacto con aguas contaminadas o anegadas; siga las indicaciones de sanidad que dicten las autoridades.
					<br>&#9679 Evite que el agua quede estancada, ya que proliferan los mosquitos transmisores de enfermedades.
					<br>&#9679 En caso de tormentas eléctricas procure no utilizar equipos eléctricos y electrónicos, si se encuentra en el exterior procure buscar refugio en alguna edificación, si está viajando quédese en el interior de su automóvil.
					<br>
					<br><strong>OLEAJE ELEVADO:</strong>
					<br>
					<br>&#9679 Extremar precauciones a la navegación por la presencia de oleaje elevado, así como la realización de actividades turísticas, recreativas y comerciales en el mar y zona de playas.
					<br>&#9679 Extreme precauciones y manténgase informado sobre las acciones que las autoridades marítimas y portuarias establezcan.
				</div>
				<div>
					<table style="border: none;  width: 100%; height: 100%; text-align: center;">
						<tr><th style="border: none;"><a href="http://sina.conagua.gob.mx/sina/almacenamientoPresas.php"><img src="img/QR_3.PNG" width="100%"></a></th></tr>
						<tr><th style="border: none;"><a href="http://www.cenapred.gob.mx/es/Publicaciones/archivos/278-INFOGRAFATEMPORADADELLUVIAS(PARAAUTORIDADES).PDF"><img src="img/QR_4.PNG"  width="100%"></a></th></tr>
						<tr><th style="border: none;"><a href="http://www.cenapred.gob.mx/es/Publicaciones/archivos/302-INFOGRAFATORMENTASELCTRICAS.PDF"><img src="img/QR_5.PNG"  width="100%"></a></th></tr>
					</table>
				</div>
			</div>

			<div id="pag_4" class="titulo" style="page-break-before: always;">
				ALERTA DE <element  class="TitleTipo"></element> EN EL OCÉANO <element  class="TitleOceano"></element>
			</div>
			<hr style="height:5px; visibility:hidden; margin:0px" />
			<div class="DosRenglones">
				<div class="QR_box2">
					<div style="margin: 10px;">
						<strong>MAREA DE TORMENTA:</strong>
		 				<br>
						<br>&#9679 En caso de presencia de marea de tormenta, aléjese de la costa y resguárdese por la presencia de corrientes de arrastre tierra adentro, por encima de la línea de costa.
						<br>
						<br>
						<br>
						<br><strong>INESTABILIDAD DE LADERAS:</strong>
						<br>
						<br>&#9679 En caso de peligro inminente, desaloje el área inmediatamente y no trate de salvar sus pertenencias. Usted y su familia son más importantes.
						<br>&#9679 Considere evacuar su hogar si vive en un área que es susceptible a movimientos de ladera, teniendo en cuenta que puede hacerlo sin peligro.
						<br>&#9679 Esté atento a cualquier sonido producido por escombros en movimiento, tales como árboles derrumbándose o peñascos que chocan uno con otros.
						<br>&#9679 Si vive cerca de un canal o arroyo, manténgase alerta a cualquier cambio súbito en los niveles y turbulencia del agua. Estos cambios pueden indicar que han ocurrido movimientos.
						<br>&#9679 Cuando esté conduciendo bajo condiciones de tormenta preste atención a los taludes en las carreteras, ya que estos son muy propensos a caídos de rocas, flujos y deslizamientos.
						<br>&#9679 Manténgase alerta por si ve lodo y rocas sobre la carretera, grietas o deformaciones sobre el pavimento, ya que éstos pueden indicar la presencia de un movimiento de ladera y no intente cruzar.
						<br>&#9679 Evite que el agua de lluvia se infiltre en el subsuelo de las laderas, dando mantenimiento a zanjas, cunetas o contracunetas ubicadas en los cortes de las laderas para que no se acumule el agua.
						<br>&#9679 Cuide que no haya descargas o fugas de agua en las casas ubicadas sobre laderas, para evitar la infiltración del subsuelo.
						<br>
						<br>
						<br>
					</div>
					<div>
						<table style="border: none;  width: 100%; height: 100%; text-align: center;">
							<tr><th style="border: none;"><a href="https://www.cenapred.gob.mx/es/Publicaciones/archivos/259-INFOGRAFAENCASODEINUNDACIN.PDF"><img src="img/QR_6.PNG" width="100%"></a></th></tr>
							<tr><th style="border: none;"><a href="https://www.gob.mx/cms/uploads/attachment/file/110289/308-INFOGRAFAINUNDACIONESSBITAS.PDF"><img src="img/QR_7.PNG"  width="100%"></a></th></tr>
							<tr><th style="border: none;"><a href="http://www.cenapred.gob.mx/es/Publicaciones/archivos/281-INFOGRAFALADERASINESTABLES.PDF"><img src="img/QR_8.PNG"  width="100%"></a></th></tr>
						</table>
					</div>	
				</div>
				<div>
					<table style="border: none; width:100%; height: 100%; text-align: center;">
						<td  style="border: none;"><img src="img/911.PNG" width="40%"></td>
						<td  style="border: none;"><a href="https://www.gob.mx/sspc/documentos/manual-del-sistema-de-alerta-temprana-para-ciclones-tropicales-siat-ct-2019"><img src="img/manual.PNG"  width="40%"></a></td>
						<td  style="border: none;"><a href="https://www.gob.mx/sspc/documentos/regionalizacion-para-alertas-hidrometeorologicas-2019"><img src="img/regiones.PNG"  width="40%"></a></td>
					</table>
				</div>
			</div>
			<div>
				<table class="regularTxt tablaAutores">
					<!--18:00 h del 03 de junio del 2019-->
					<td>Validez del boletín: <span id="fechaValidez"></span></td>
					<td>ELABORÓ: <div id="autores"></div> </td>
				</table>
			</div>
			<hr style="height:5px; visibility:hidden; margin:0px" />
			<div style="border: none;"  class="tituloTable"><center>ENLACES OFICIALES RELACIONADOS:</center></div>
			<hr style="height:5px; visibility:hidden; margin:0px" />
			<div>
				<table class="footer_box" align="center" >
					<td><a href="https://meteorologia.semar.gob.mx/"><img src="img/footer1.png" width="100%"></a></td>
					<td><a href="http://sina.conagua.gob.mx/sina/almacenamientoPresas.php"><img src="img/footer2.png" width="100%"></a></td>
					<td><div class="col">
							<div class="row">
								<u><a href="http://smn.cna.gob.mx/">SERVICIO METEOROLÓGICO NACIONAL</a></u>
							</div>
							<div class="row">
								<u><a href="http://sina.conagua.gob.mx/sina/almacenamientoPresas.php">SUBDIRECCIÓN GENERAL TÉCNICA</a></u>
							</div>
							<div class="row">
								<u><a href="http://sina.conagua.gob.mx/sina/almacenamientoPresas.php">SUBDIRECCIÓN GENERAL DE PLANEACIÓN</a></u>
							</div>
						</div>
					</td>
					<td><a href="https://www.gob.mx/cenapred"><img src="img/footer3.png" width="100%"></a></td>
					<td><a href="https://capma.seneam.gob.mx/"><img src="img/footer4.png" width="100%"></a></td>
				</table>
			</div>
			<hr style="height:3px; visibility:hidden; margin:0px" />
			<img width="100%" src="img/footerDiv.png"/>
			<div class="textFooter">
				<center>
					DIRECCIÓN DE ADMINISTRACIÓN DE EMERGENCIAS / SUBDIRECCIÓN DE METEOROLOGÍA<br>
					<u>
						<a id="link" href="https://www.gob.mx/sspc/documentos/alertamientos-de-proteccioncivil-atiende-recomendaciones-del-sinaproc-mayo-2019">https://www.gob.mx/sspc/documentos/alertamientos-de-proteccioncivil-atiende-recomendaciones-del-sinaproc-mayo-2019</a>
					</u>
					<br>
					Tel: 01 55 5128-0000 ext. 36346
				</center>
			</div>
		</div>
	</div> <!--  Div del BOX -->
	
	
	<!-- Button of actions -->
	<center>
	<button class="btn btn-success" id="guardarInfo" >Guardar Boletín</button>
	
	<button type="button" class="btn btn-outline-success" id="vistaPrevia" style="display: none;">Generar Vista previa del PDF</button>

	
	<button type="button" class="btn btn-outline-success" id="old-pdf">Generar PDF viejo</button>
	<button type="button" class="btn btn-outline-success" id="pdf">Generar PDF nuevo</button>
	<button type="button" class="btn btn-outline-success disabled" id="pdfError">Generar PDF</button>	
	<button type="button" data-toggle="modal" data-target="#confirm" class="btn btn-outline-danger" id="lastOne">Ultimo boletín</button>
	</center>

	<div style="margin: 0 25% 2em 0;">
	<?php include("pdf/plantilla.html"); ?>
	</div>

	<?php getFooter(); ?>

	<script id="stormsActive-template" type="text/x-handlebars-template">
		{{#each storms as |storm|}}
			{{#if @first}}
				<option value="">Selecciona</option>
			{{/if}}
			<option value="{{storm.stormname}}" data-layerid="{{storm.layerid}}">{{storm.stormname}} ({{storm.service}})</option>
		{{else}}
			<option value="">Sin ciclones</option>
		{{/each}}
	</script>

	<script id="autoresDefault-template" type="text/x-handlebars-template">
		{{#each autores as |autor|}}
			{{#if @last}}
				<span class="autor" data-autorId={{autor.idAutor}}>{{autor.nombre}}</span>
			{{else}}
				<span class="autor" data-autorId={{autor.idAutor}}>{{autor.nombre}}</span>,<br/>
			{{/if}}
		{{/each}}
	</script>

	<script id="years-template" type="text/x-handlebars-template">
        <select name="" id="aniosEventos">
            {{#each this as |year|}}
                {{#if @first}}
                    <option value="">Selecciona</option>
                {{/if}}
                <option value="{{year}}" data-start="01/01/{{year}}" data-end="01/01/{{#addInt year 1}}{{/addInt}}">Temporada {{year}}</option>
            {{else}}
                <option value="">Sin años disponibles para consulta</option>
            {{/each}}
        </select>
	</script>

	<script id="activeEvents-template" type="text/x-handlebars-template">
		<select id="activeEventsOptions">
			{{#each activeEvents as |event|}}
				{{#if @first}}
					<option value="">Selecciona</option>
				{{/if}}
				<option value="{{event.idBoletin}}">{{event.nombre}}</option>
			{{else}}
				<option value="">Sin eventos</option>
			{{/each}}
		</select>
	</script>

	<script id="filesUploaded-template" type="text/x-handlebars-template">
		<ul id="filesUploadedList" class="filesList">
			{{#each files as |file|}}
			<li class="file-item"><span data-fileUrl="{{file.url}}" data-fileExt="{{file.ext}}">{{file.name}}</span><button data-fileUrl="{{file.url}}" class="deleteFile">Borrar</button></li>
			{{/each}}
		</ul>
	</script>	

	<script src="./JS/cargaEdos.js"></script>
	<script src="./JS/regiones.js"></script>
	<script src="./JS/funciones.js"></script>
	<script src="./JS/fileUpload.js"></script>
	<script type="module" src="./JS/StaticText.js"></script>
	<script src="./JS/map.js"></script>	
	<script src="./JS/hbHelpers.js"></script>
	<script src="./JS/seguimiento.js"></script>

	<script src="/js/nav-gob.js"></script>
</body>
</html>

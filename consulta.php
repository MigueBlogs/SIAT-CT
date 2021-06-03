<?php
    require_once "pagina_fns.php";
    
    session_start();
?>

<!DOCTYPE html>
<html lang="es">
<head>
    <link rel="shortcut icon" href="http://www.atlasnacionalderiesgos.gob.mx/Imagenes/Logos/cenapred_icon.ico"/>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0, user-scalable=no">
    <meta http-equiv="X-UA-Compatible" content="ie=edge">
    <title>Consulta SIAT-CT</title>

    <script src="http://code.jquery.com/jquery-3.3.1.min.js"  integrity="sha256-FgpCb/KJQlLNfOu91ta32o/NMZxltwRo8QtmkMRdAu8="  crossorigin="anonymous"></script>
    <script src="./lib/handlebars.js"></script>
    <script src="//d3js.org/d3.v4.min.js"></script>

    <link rel="stylesheet" href="https://js.arcgis.com/4.17/esri/css/main.css">
    <script src="https://js.arcgis.com/4.17/"></script>

    <link rel="stylesheet" href="./css/consulta.css">
</head>
<body>
    <iframe id="iFrame-nav-gob" src="/nav.html" frameborder="0" style="width: 100%;height: 60px;margin-bottom: -4px;"></iframe>
    <?php includeNav(); ?>
    <div class="mainContainer" style="margin-bottom: 2em;">
        <h1>Boletín SIAT-CT</h1>

        <div class="filters">
            <div id="years"></div>
            <div id="storms"></div>
        </div>
        <div class="tropicalCyclone">
            <div id="cycloneNameContainer"></div>
            <div class="cycloneBody">
                <section id="tropicalCicloneInfo"></section>

                <section class="section" id="alertZones">
                    <div class="zones">
                        <div id="regionsTable" class="tableContainer"></div>
                        <div class="mapContainer">
                            <div class="activationButton"><span class="icon-mexico"></span> Mostrar regiones en el mapa</div>
                            <div id="map"></div>
                        </div>
                    </div>
                </section>

                <section class="section" id="eventInfo"></section>
                <section class="section" id="comments"></section>
                <section class="section" id="effects"></section>
            </div>
        </div>
        <div id="enable_on_print">
			
            <div class="tituloEfectos">
                RECOMENDACIONES POR LA EVOLUCIÓN DEL CICLÓN TROPICAL
            </div>
            <div>
                <ul>
                    <li><strong>POBLACIÓN EN GENERAL</strong> – Mantenerse informada sobre las condiciones meteorológicas en sus lugares de residencia, tener presente su plan familiar de protección civil y atender las recomendaciones del Sistema Nacional de Protección Civil.</li>
                    <li><strong>NAVEGACIÓN MARÍTIMA</strong> – Precauciones en inmediaciones de este sistema, atender indicaciones de Capitanías de Puerto, Secretaría de Marina-Armada de México y autoridades de Protección Civil. </li>
                    <li><strong>NAVEGACIÓN AÉREA</strong> – Precauciones en las inmediaciones de este sistema, atender indicaciones del Servicio a la Navegación del Espacio Aéreo Mexicano.</li>
                    <li><strong>MEDIOS DE COMUNICACIÓN</strong> – Atender y difundir información emitida por el SINAPROC y fuentes oficiales sobre la temporada de ciclones tropicales y lluvias.</li>
                    <li><strong>UNIDADES ESTATALES DE PROTECCIÓN CIVIL</strong> – Atender la evolución de este ciclón tropical, notificar a integrantes del SINAPROC en ámbitos estatales y municipales, así como considerar las siguientes recomendaciones de acuerdo al nivel de  alerta del Sistema de Alerta Temprana para Ciclones Tropicales (SIAT-CT):</li>
                </ul>
                <!-- <img src="img/bloque.png" width="100%"> -->
            </div>
            <div class="niveles">
                <div class="tituloTable">NIVELES DE ALERTA SIAT-CT</div>
                <strong style="color: red;text-shadow: 0 1px black;">ROJA:</strong> Mantener en resguardo total a la población y autoridades. Restringir toda actividad manteniéndose en sesión permanente los consejos estatales y municipales de protección civil, así como las instancias de coordinación y comunicación. Reforzar la información por conducto de los medios de comunicación masiva sobre el impacto del fenómeno y la necesidad de permanecer bajo resguardo. <br>
                <strong style="color: orange;text-shadow: 0 1px black;">NARANJA:</strong> Evacuación de las zonas de riesgo, puesta en operación de los refugios temporales. Instalación de los consejos estatales y municipales de protección civil, así como instalación en sesión permanente de las instancias de coordinación y comunicación. Reforzamiento del alertamiento por conducto de los medios de comunicación masiva sobre el fenómeno específico y el inminente impacto. <br>
                <strong style="color: yellow;text-shadow: 1px 1px black;">AMARILLA:</strong> Valorar posibilidad de instalar consejos estatales y municipales de protección civil, preparar posibles refugios temporales, en islas valorar y considerar inicio de evacuación y en su caso desplegar personal y recursos. <br>
                <strong style="color: green;text-shadow: 0 1px black;">VERDE:</strong> Instalar centros estatales y municipales de coordinación y comunicación, revisar directorios de comunicaciones y el inventario de recursos materiales y humanos, planes y procedimientos de comunicación y operaciones, revisar listado y condiciones de operatividad de los refugios temporales, identificar instalaciones de emergencia. <br>
                <strong style="color: blue;text-shadow: 0 1px black;">AZUL:</strong> Activar procedimientos internos de comunicaciones, mantener alto nivel de atención a información	oficial.
            </div>
            <br>
            <div class="tituloEfectos" style="margin-top: 1em;">
                <u>RECOMENDACIONES</u>
            </div>
            <button type="button" class="active collapsible">VIENTO FUERTE</button>
            <div class="content" style="display: block;">
                <ul>
                    <li>Extreme precauciones ante presencia de vientos fuertes y ponga especial atención a construcciones de material endeble, así como posibles afectaciones en espectaculares y tendido eléctrico.</li>
                    <li>Extremar precauciones al tránsito vehicular en carreteras y caminos rurales, vados y puentes  serranos, así como zonas urbanas, si es necesario buscar rutas alternas.</li>
                    <li>En caso de estar transitando por la calle, extreme precauciones ya que las ráfagas de viento pueden arrastrar o convertir objetos en proyectiles, busque refugio en casas y edificios de construcción sólida.</li>
                    <li>En su domicilio mantenga abiertas algunas de las ventanas (preferentemente a sotavento), y evita permanecer en habitaciones enfrentadas a la dirección de donde sopla el viento que tenga ventanales. Permanezca alejado de las ventanas y en caso de ser necesario puede protegerse debajo de muebles sólidos y pesados o escaleras interiores.</li>
                </ul>
            </div>
            <button type="button" class="collapsible">LLUVIAS E INUNDACIONES</button>
            <div class="content">
                <ul>
                    <li>Extreme precauciones al transitar por brechas y caminos rurales ante baja visibilidad, terreno resbaladizo, posibles deslaves de sierras o avenidas súbitas de agua con material de arrastre.</li>
                    <li>No transite por zonas inundadas; ya que puede haber sumergidos cables con energía eléctrica, no se acerque a postes o cables de electricidad.</li>
                    <li>No intente cruzar cauces de ríos, arroyos, vados y zonas bajas porque puede ser arrastrado por el agua.</li>
                    <li>Si viaja en su vehículo, extreme precaución al desplazarse en carreteras especialmente en zonas de sierra y costa; así como en vados y brechas, debido a la presencia de vientos y lluvias, no se confíe del potencial y peso de su vehículo especialmente si es todo terreno.</li>
                    <li>No cruce puentes si el agua lo pasa por encima.</li>
                    <li>No restablezca la energía eléctrica hasta que esté seguro de que no hay cortos circuitos. Si tiene duda sobre el estado de su casa, solicite el apoyo de las autoridades, mientras tanto no la utilice.</li>
                    <li>No tome líquidos ni alimentos que hayan estado en contacto con aguas contaminadas o anegadas; siga las indicaciones de sanidad que dicten las autoridades.</li>
                    <li>Evite que el agua quede estancada, ya que proliferan los mosquitos transmisores de enfermedades.</li>
                    <li>En caso de tormentas eléctricas procure no utilizar equipos eléctricos y electrónicos, si se encuentra en el exterior procure buscar refugio en alguna edificación, si está viajando quédese en el interior de su automóvil.</li>
                </ul>
            </div>
            <button type="button" class="collapsible">OLEAJE ELEVADO</button>
            <div class="content">
                <ul>
                    <li>Extremar precauciones a la navegación por la presencia de oleaje elevado, así como la realización de actividades turísticas, recreativas y comerciales en el mar y zona de playas.</li>
                    <li>Extreme precauciones y manténgase informado sobre las acciones que las autoridades marítimas y portuarias establezcan.</li>
                </ul>
            </div>
            <button type="button" class="collapsible">MAREA DE TORMENTA</button>
            <div class="content">
                <ul>
                    <li>En caso de presencia de marea de tormenta, aléjese de la costa y resguárdese por la presencia de corrientes de arrastre tierra adentro, por encima de la línea de costa.</li>
                </ul>
            </div>
            <button type="button" class="collapsible">INESTABILIDAD DE LADERAS</button>
            <div class="content">
                <ul>
                    <li>En caso de peligro inminente, desaloje el área inmediatamente y no trate de salvar sus pertenencias. Usted y su familia son más importantes.</li>
                    <li>Considere evacuar su hogar si vive en un área que es susceptible a movimientos de ladera, teniendo en cuenta que puede hacerlo sin peligro.</li>
                    <li>Esté atento a cualquier sonido producido por escombros en movimiento, tales como árboles derrumbándose o peñascos que chocan uno con otros.</li>
                    <li>Si vive cerca de un canal o arroyo, manténgase alerta a cualquier cambio súbito en los niveles y turbulencia del agua. Estos cambios pueden indicar que han ocurrido movimientos.</li>
                    <li>Cuando esté conduciendo bajo condiciones de tormenta preste atención a los taludes en las carreteras, ya que estos son muy propensos a caídos de rocas, flujos y deslizamientos.</li>
                    <li>Manténgase alerta por si ve lodo y rocas sobre la carretera, grietas o deformaciones sobre el pavimento, ya que éstos pueden indicar la presencia de un movimiento de ladera y no intente cruzar.</li>
                    <li>Evite que el agua de lluvia se infiltre en el subsuelo de las laderas, dando mantenimiento a zanjas, cunetas o contracunetas ubicadas en los cortes de las laderas para que no se acumule el agua.</li>
                    <li>Cuide que no haya descargas o fugas de agua en las casas ubicadas sobre laderas, para evitar la infiltración del subsuelo.</li>
                </ul>
            </div>
            <br>
            <div class="tituloEfectos" style="margin-top: 1em;">
                <u>INFOGRAFÍAS</u>
            </div>

            <button type="button" class="collapsible">CICLÓN ACERCÁNDOSE</button>
            <div class="content img">
                <img src="img/boletines/INFOGRAFIACICLONACERCANDOSE1.jpg">
                <img src="img/boletines/INFOGRAFIACICLONACERCANDOSE2.jpg">
                <a href="http://www.cenapred.unam.mx/es/Publicaciones/archivos/264-INFOGRAFACICLNACERCNDOSE.PDF" target="_blank" rel="noopener noreferrer">Ver infografía original</a>
            </div>

            <button type="button" class="collapsible">CICLÓN ALEJÁNDOSE</button>
            <div class="content img">
                <img src="img/boletines/INFOGRAFIACICLONALEJANDOSE1.jpg">
                <img src="img/boletines/INFOGRAFIACICLONALEJANDOSE2.jpg">
                <a href="http://www.cenapred.gob.mx/es/Publicaciones/archivos/264-INFOGRAFACICLNALEJNDOSE.PDF" target="_blank" rel="noopener noreferrer">Ver infografía original</a>
            </div>

            <button type="button" class="collapsible">LLUVIAS</button>
            <div class="content img">
                <img src="img/boletines/INFOGRAFIATEMPORADADELLUVIAS(PARAAUTORIDADES).jpg">
                <a href="http://www.cenapred.gob.mx/es/Publicaciones/archivos/278-INFOGRAFATEMPORADADELLUVIAS(PARAAUTORIDADES).PDF" target="_blank" rel="noopener noreferrer">Ver infografía original</a>
            </div>

            <button type="button" class="collapsible">INUNDACIONES</button>
            <div class="content img">
                <img src="img/boletines/INFOGRAFIAENCASODEINUNDACION.jpg">
                <a href="https://www.cenapred.gob.mx/es/Publicaciones/archivos/259-INFOGRAFAENCASODEINUNDACIN.PDF" target="_blank" rel="noopener noreferrer">Ver infografía original</a>
            </div>

            <button type="button" class="collapsible">INUNDACIONES SÚBITAS</button>
            <div class="content img">
                <img src="img/boletines/INFOGRAFIAINUNDACIONESSUBITAS1.jpg">
                <img src="img/boletines/INFOGRAFIAINUNDACIONESSUBITAS2.jpg">
                <a href="https://www.gob.mx/cms/uploads/attachment/file/110289/308-INFOGRAFAINUNDACIONESSBITAS.PDF" target="_blank" rel="noopener noreferrer">Ver infografía original</a>
            </div>

            <button type="button" class="collapsible">LADERAS</button>
            <div class="content img">
                <img src="img/boletines/INFOGRAFIALADERASINESTABLES1.jpg">
                <img src="img/boletines/INFOGRAFIALADERASINESTABLES2.jpg">
                <a href="http://www.cenapred.gob.mx/es/Publicaciones/archivos/281-INFOGRAFALADERASINESTABLES.PDF" target="_blank" rel="noopener noreferrer">Ver infografía original</a>
            </div>

            <button type="button" class="collapsible">TORMENTAS ELÉCTRICAS</button>
            <div class="content img">
                <img src="img/boletines/INFOGRAFIATORMENTASELECTRICAS1.jpg">
                <img src="img/boletines/INFOGRAFIATORMENTASELECTRICAS2.jpg">
                <a href="http://www.cenapred.gob.mx/es/Publicaciones/archivos/302-INFOGRAFATORMENTASELCTRICAS.PDF" target="_blank" rel="noopener noreferrer">Ver infografía original</a>
            </div>
            <br>
            <div class="tituloEfectos" style="margin-top: 1em;">
                <u>ENLACES OFICIALES RELACIONADOS</u>
            </div>
            <table class="enlaces-img">
                <td  style="border: none;"><img src="img/911.PNG" width="100%"></td>
                <td  style="border: none;"><a href="https://www.gob.mx/sspc/documentos/manual-del-sistema-de-alerta-temprana-para-ciclones-tropicales-siat-ct-2019"><img src="img/manual.PNG"  width="100%"></a></td>
                <td  style="border: none;"><a href="https://www.gob.mx/sspc/documentos/regionalizacion-para-alertas-hidrometeorologicas-2019"><img src="img/regiones.PNG"  width="100%"></a></td>
            </table>

            <div>
                <div class="tituloTable">
                    Cierre de puertos
                </div>
                <div class="regularTxt">
                    Consulte a la Unidad de Capitanías de Puerto y Asuntos Marítimos de la Secretaría de Marina para conocer más información sobre el cierre de puertos por condiciones meteorológicas adversas en el siguiente enlace:
                    <a href="https://www.gob.mx/semar/unicapam/acciones-y-programas/estado-operacional-de-puertos">https://www.gob.mx/semar/unicapam/acciones-y-programas/estado-operacional-de-puertos</a>
                </div> 
                <div class="tituloTable">
                    Riesgo por inestabilidad de laderas
                </div>
                <div class="regularTxt">
                    Consulte el Atlas Nacional de Riesgos del Centro Nacional de Prevención de Desastres para más información:
                    <ul>
                        <li>Riesgo por inestabilidad de laderas: <a href="http://www.atlasnacionalderiesgos.gob.mx/archivo/inestabilidad-laderas.html">http://www.atlasnacionalderiesgos.gob.mx/archivo/inestabilidad-laderas.html</a></li>
                        <li>Indicadores municipales: <a href="http://www.atlasnacionalderiesgos.gob.mx/archivo/indicadores-municipales.html">http://www.atlasnacionalderiesgos.gob.mx/archivo/indicadores-municipales.html</a></li>
                    </ul>
                </div> 
                <div class="tituloTable">
                    Riesgo por inundaciones
                </div>
                <div class="regularTxt">
                    Consulte el Atlas Nacional de Riesgos del Centro Nacional de Prevención de Desastres para más información:
                    <a href="http://www.atlasnacionalderiesgos.gob.mx/app/mapa/?capa=vulnInund">http://www.atlasnacionalderiesgos.gob.mx/app/mapa/?capa=vulnInund</a>
                    <a href="http://www.atlasnacionalderiesgos.gob.mx/app/mapa/?capa=peligroInund">http://www.atlasnacionalderiesgos.gob.mx/app/mapa/?capa=peligroInund</a>
                </div>
                <div class="tituloTable">
                    Monitoreo de Presas
                </div>
                <div class="regularTxt">
                    Consulte el Sistema Nacional de Información del Agua para más información:
                    <a href="http://sina.conagua.gob.mx/sina/almacenamientoPresas.php">http://sina.conagua.gob.mx/sina/almacenamientoPresas.php</a>
                </div>
                <div style="text-align: center;margin:0 1em;">
                    <table class="footer_box" style="width: 100%;" >
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
            </div>
                
            <img width="100%" src="img/footerDiv.png"/>
            <div class="textFooter">
                DIRECCIÓN DE ADMINISTRACIÓN DE EMERGENCIAS / SUBDIRECCIÓN DE METEOROLOGÍA<br>
                <u>
                    <a id="link" href="https://www.gob.mx/sspc/documentos/alertamientos-de-proteccioncivil-atiende-recomendaciones-del-sinaproc-mayo-2019">https://www.gob.mx/sspc/documentos/alertamientos-de-proteccioncivil-atiende-recomendaciones-del-sinaproc-mayo-2019</a>
                </u>
                <br>
                Tel: 01 55 5128-0000 ext. 36346
            </div>
        </div>
    </div>
    <script>
        $('.collapsible').click(function(){
            $(this).toggleClass("active");
            var content = $(this).next();
            if (content.is(":visible")) {
                content.hide();
            } else {
                content.show();
            }
        })
    </script>

    <script id="cycloneName-template" type="text/x-handlebars-template">
        <h2 id="cycloneName">
            <div class="titleContainer">
                {{#if this.previous}}
                    <span class="icon-circle-left arrow" data-idBoletin="{{this.previous.idBoletin}}"></span>
                {{else}}
                    <span class="icon-circle-left arrow disable"></span>
                {{/if}}
                <span><span id="tcType">{{this.categoria}}</span> <span id="tcName">{{this.nombre}}</span></span>
                {{#if this.next}}
                    <span class="icon-circle-right arrow" data-idBoletin="{{this.next.idBoletin}}"></span>
                {{else}}
                    <span class="icon-circle-right arrow disable"></span>
                {{/if}}
            </div>
        </h2>
        <h3 id="tcDateHour"><span id="tcDate">{{#fechaLarga this.fecha}}{{/fechaLarga}}</span>, <span id="tcHour">{{this.hora}}</span></h3>
    </script>

    <script id="tropicalCicloneInfo-template" type="text/x-handlebars-template">
        <div class="tcInfo">
            <div><strong>Localización:</strong> <span id="tcPosition">{{this.localizacion}}</span></div>
            <div><strong>Desplazamiento:</strong> <span id="tcMovement">{{this.desplazamiento}}</span></div>
            <div><strong>Vientos Máximos Sostenidos:</strong> <span id="tcMaxWind">{{this.sostenidos}}</span></div>
            <div><strong>Rachas de viento máximas:</strong> <span id="tcMaxWindStreak">{{this.rachas}}</span></div>
        </div>
    </script>

    <script id="regionsTable-template" type="text/x-handlebars-template">
        <h3>Regiones de alertamiento</h3>
        <div class="table">
            <div class="table-section">
                <div class="table-header title">Ciclón Acercándose</div>
                <div class="table-group">
                    <div class="table-row bgRedSIAT">PELIGRO MÁXIMO</div>
                    <div class="table-row" id="redZonesAc">{{#getRegiones this.alertas "1" "5"}}{{/getRegiones}}</div>
                </div>
                <div class="table-group">
                    <div class="table-row bgOrangeSIAT">PELIGRO ALTO</div>
                    <div class="table-row" id="orangeZonesAc">{{#getRegiones this.alertas "1" "4"}}{{/getRegiones}}</div>
                </div>
                <div class="table-group">
                    <div class="table-row bgYellowSIAT">PELIGRO MEDIO</div>
                    <div class="table-row" id="yellowZonesAc">{{#getRegiones this.alertas "1" "3"}}{{/getRegiones}}</div>
                </div>
                <div class="table-group">
                    <div class="table-row bgGreenSIAT">PELIGRO BAJO</div>
                    <div class="table-row" id="greenZonesAc">{{#getRegiones this.alertas "1" "2"}}{{/getRegiones}}</div>
                </div>
                <div class="table-group">
                    <div class="table-row bgBlueSIAT">PELIGRO MUY BAJO</div>
                    <div class="table-row" id="blueZonesAc">{{#getRegiones this.alertas "1" "1"}}{{/getRegiones}}</div>
                </div>
            </div>
            <div class="table-section">
                <div class="table-header title">Ciclón Alejándose</div>
                <div class="table-group">
                    <div class="table-row bgRedSIAT">PELIGRO MÁXIMO</div>
                    <div class="table-row" id="redZonesAl">{{#getRegiones this.alertas "2" "5"}}{{/getRegiones}}</div>
                </div>
                <div class="table-group">
                    <div class="table-row bgOrangeSIAT">PELIGRO ALTO</div>
                    <div class="table-row" id="orangeZonesAl">{{#getRegiones this.alertas "2" "4"}}{{/getRegiones}}</div>
                </div>
                <div class="table-group">
                    <div class="table-row bgYellowSIAT">PELIGRO MEDIO</div>
                    <div class="table-row" id="yellowZonesAl">{{#getRegiones this.alertas "2" "3"}}{{/getRegiones}}</div>
                </div>
                <div class="table-group">
                    <div class="table-row bgGreenSIAT">PELIGRO BAJO</div>
                    <div class="table-row" id="greenZonesAl">{{#getRegiones this.alertas "2" "2"}}{{/getRegiones}}</div>
                </div>
                <div class="table-group">
                    <div class="table-row bgBlueSIAT">PELIGRO MUY BAJO</div>
                    <div class="table-row" id="blueZonesAl">{{#getRegiones this.alertas "2" "1"}}{{/getRegiones}}</div>
                </div>
            </div>
        </div>
    </script>

    <script id="eventInfo-template" type="text/x-handlebars-template">
        <div class="infoSection">
            <div class="infoElement"><strong>Estados alertados:</strong> <span id="noStates">{{#getEstados this.alertas}}{{/getEstados}}</span></div>
            <div class="infoElement">Municipios alertados: <span id="noCounties">{{#getMunicipios this.alertas}}{{/getMunicipios}}</span></div>
            <div class="infoElement">
                <ul id="statesList" class="list">
                   {{#getListaEstados this.alertas}}{{/getListaEstados}}
                </ul>
            </div>
        </div>
        <div class="infoSection">
            <div class="infoElement charts">
                <div id="countyChart"></div>
                <div id="warningChart"></div>
            </div>
        </div>
        <!-- <div class="infoSection">
            <div class="infoElement">Población expuesta: <span id="population"></span></div>
            <div class="infoElement"></div>
        </div>
        <div class="infoSection">
            <div class="infoElement">Vivienda expuesta: <span id="houses"></span></div>
            <div class="infoElement"></div>
        </div> -->
    </script>

    <script id="effects-template" type="text/x-handlebars-template">
        <h3>Efectos</h3>
        <div class="effectsInfo">
            <div class="infoSection">
                <div class="infoElement"><strong>Viento</strong></div>
                <div class="infoElement" id="wind">
                    <ul class="list">
                        {{#getEfectos this.efectos 0}}{{/getEfectos}}
                    </ul>
                </div>
            </div>
            <div class="infoSection">
                <div class="infoElement"><strong>Lluvia</strong></div>
                <div class="infoElement" id="rain">
                    <ul class="list">
                        {{#getEfectos this.efectos 1}}{{/getEfectos}}
                    </ul>
                </div>
            </div>
            <div class="infoSection">
                <div class="infoElement"><strong>Oleaje</strong></div>
                <div class="infoElement" id="surf">
                    <ul class="list">
                        {{#getEfectos this.efectos 2}}{{/getEfectos}}
                    </ul>
                </div>
            </div>
            <div class="infoSection">
                <div class="infoElement"><strong>Marea de tormenta</strong></div>
                <div class="infoElement" id="stormSurge">
                    <ul class="list">
                        {{#getEfectos this.efectos 3}}{{/getEfectos}}
                    </ul>
                </div>
            </div>
        </div>
    </script>

    <script id="comments-template" type="text/x-handlebars-template">
        <h3>Comentarios</h3>
        <div class="infoSection">
            <div class="infoElement" id="commentsText">
                <ul class="list">
                    {{#getComentarios this.comentarios}}{{/getComentarios}}   
                </ul>
            </div>
        </div>
    </script>

    <script id="storms-template" type="text/x-handlebars-template">
        <select name="" id="ciclonesTropicales">
            {{#each storms as |storm|}}
                {{#if @first}}
                    <option value="">Selecciona</option>
                {{/if}}
                <option value="{{storm.nombre}}" data-idBoletin="{{storm.idBoletin}}">{{storm.nombre}} ( {{#fechaLarga this.fecha}}{{/fechaLarga}} )</option>
            {{else}}
                <option value="">Sin ciclones</option>
            {{/each}}
        </select>
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
    
    <script src="./JS/mapConsulta.js"></script>
    <script src="./JS/chartConsulta.js"></script>
    <script src="./JS/hbHelpers.js"></script>

    <iframe id="MyIframe" src="/footer.html" scrolling="no" width="100%" height="425.5px" style="border: 0px;"></iframe>
    <script src="/js/nav-gob.js"></script>
    <script src="/js/footer.js"></script>
</body>
</html>
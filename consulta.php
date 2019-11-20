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

    <link rel="stylesheet" href="https://js.arcgis.com/4.13/esri/css/main.css">
    <script src="https://js.arcgis.com/4.13/"></script>

    <link rel="stylesheet" href="./css/consulta.css">
</head>
<body>
    <?php includeNav(); ?>
    <div class="mainContainer">
        <h1>Boletín SIAT-CT</h1>

        <div id="years"></div>
        <div id="storms"></div>
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
        <section class="section" id="sistemasExpuestos">
            <h3>Análisis de sistemas expuestos</h3>
            <div class="infoSection" id="table-analysis">
                <table>
                    <thead>
                        <tr>
                            <th>Peligro mínimo</th>
                            <th>Peligro bajo</th>
                            <th>Peligro medio</th>
                            <th>Peligro alto</th>
                            <th>Peligro máximo</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr>
                            <td><div data-nivel="AZUL" class="button">Calcular</div></td>
                            <td><div data-nivel="VERDE" class="button">Calcular</div></td>
                            <td><div data-nivel="AMARILLA" class="button">Calcular</div></td>
                            <td><div data-nivel="NARANJA" class="button">Calcular</div></td>
                            <td><div data-nivel="ROJA" class="button">Calcular</div></td>
                        </tr>
                    </tbody>
                </table>
            </div>
            <div id="exposition"></div>
        </section>
        <section class="section" id="comments"></section>
        <section class="section" id="effects"></section>

        <!-- <section class="section" id="recomendations">
            <h3>Recomendaciones</h3>
        </section> -->
    </div>

    <script id="tropicalCicloneInfo-template" type="text/x-handlebars-template">
        <h2>
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
            <div class="infoElement">
                <ul id="statesList" class="list">
                   {{#getListaEstados this.alertas}}{{/getListaEstados}}
                </ul>
            </div>
        </div>
        <div class="infoSection">
            <div class="infoElement">Municipios alertados: <span id="noCounties">{{#getMunicipios this.alertas}}{{/getMunicipios}}</span></div>
            <div class="infoElement charts">
                <div id="countyChart"></div>
                <div id="warningChart"></div>
            </div>
        </div>
        <!-- <div class="infoSection">
            <div class="infoElement">Población expuesta: <span id="population"></span></div>
            <div class="infoElement"></div>
        </div> -->
        <!-- <div class="infoSection">
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
        <select name="" id="aniosDisponibles">
            {{#each this}}
                {{#if @first}}
                    <option value="">Selecciona año</option>
                {{/if}}
                <option value="{{this}}">{{this}}</option>
            {{else}}
                <option value="">Sin años disponibles</option>
            {{/each}}
        </select>
	</script>

    <script id="noexposition-template" type="text/x-handlebars-template">
        <h3>{{this.nivel}}</h3>
        <div class="novalue">Sin datos de exposición</div>
	</script>

    <script id="exposition-template" type="text/x-handlebars-template">
        <h3>{{this.nivel}}</h3>
        {{#with this.resultados}}
            <ul class="exposition-list">
                <li class="exposition-element">
                    <div>
                        <div class="description">
                            <div class="image icon-people"></div>
                            <div class="text">Población</div>
                        </div>
                        <div class="value">{{#agregarComas Poblacion}}{{/agregarComas}}</div>
                    </div>
                </li>
                <li class="exposition-element">
                    <div>
                        <div class="description">
                            <div class="image icon-vivienda"></div>
                            <div class="text">Viviendas</div>
                        </div>
                        <div class="value">{{#agregarComas Viviendas}}{{/agregarComas}}</div>
                    </div>
                </li>
                <li class="exposition-element">
                    <div>
                        <div class="description">
                            <div class="image icon-hospital"></div>
                            <div class="text">Establecimientos de salud</div>
                        </div>
                        <div class="value">{{#agregarComas Hospitales}}{{/agregarComas}}</div>
                    </div>
                </li>
                <li class="exposition-element">
                    <div>
                        <div class="description">
                            <div class="image icon-escuela"></div>
                            <div class="text">Centros Educativos</div>
                        </div>
                        <div class="value">{{#agregarComas Escuelas}}{{/agregarComas}}</div>
                    </div>
                </li>
                <li class="exposition-element">
                    <div>
                        <div class="description">
                            <div class="image icon-hotel"></div>
                            <div class="text">Hoteles</div>
                        </div>
                        <div class="value">{{#agregarComas Hoteles}}{{/agregarComas}}</div>
                    </div>
                </li>
                <li class="exposition-element">
                    <div>
                        <div class="description">
                            <div class="image icon-banco"></div>
                            <div class="text">Bancos</div>
                        </div>
                        <div class="value">{{#agregarComas Bancos}}{{/agregarComas}}</div>
                    </div>
                </li>
                <li class="exposition-element">
                    <div>
                        <div class="description">
                            <div class="image icon-gasolina"></div>
                            <div class="text">Gasolineras</div>
                        </div>
                        <div class="value">{{#agregarComas Gasolineras}}{{/agregarComas}}</div>
                    </div>
                </li>
                <li class="exposition-element">
                    <div>
                        <div class="description">
                            <div class="image icon-presa"></div>
                            <div class="text">Presas</div>
                        </div>
                        <div class="value">{{#agregarComas Presas}}{{/agregarComas}}</div>
                    </div>
                </li>
                <li class="exposition-element">
                    <div>
                        <div class="description">
                            <div class="image icon-ganado"></div>
                            <div class="text">Unidades Pecuarias</div>
                        </div>
                        <div class="value">{{#agregarComas Ganaderias}}{{/agregarComas}}</div>
                    </div>
                </li>
            </ul>           
        {{/with}}
	</script>
    
    <script src="./JS/mapConsulta.js"></script>
    <script src="./JS/chartConsulta.js"></script>
    <script src="./JS/analisis.js"></script>
    <script src="./JS/hbHelpers.js"></script>
</body>
</html>
<?php
    session_start();
    require("pagina_fns.php");
?>

<!DOCTYPE html>
<html lang="es">
<head>
    <link rel="shortcut icon" href="http://www.atlasnacionalderiesgos.gob.mx/Imagenes/Logos/cenapred_icon.ico"/>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0, user-scalable=no">
    <meta http-equiv="X-UA-Compatible" content="ie=edge">
    <title>SIAT-CT</title>

    <script src="http://code.jquery.com/jquery-3.3.1.min.js"  integrity="sha256-FgpCb/KJQlLNfOu91ta32o/NMZxltwRo8QtmkMRdAu8="  crossorigin="anonymous"></script>
    <script src="./lib/handlebars.js"></script>

    <link rel="stylesheet" href="./css/index.css">
    <link rel="stylesheet" href="/css/fixStylesAlternative.css">
    <link rel="stylesheet" href="/css/onlyfornav.css"
    
</head>
<body>
    <iframe id="iFrame-nav-gob" src="/nav.html" frameborder="0" style="width: 100%;height: 60px;margin-bottom: -5px;"></iframe>
    <?php includeNav(); ?>
    <div class="main-container" style="margin: 0 0 2em 0;">
        <h1>Sistema de Alerta Temprana para Ciclones Tropicales<br/>(SIAT-CT)</h1>
        <div id="image-bg">
            <img src="./img/encabezado-bg.png" alt="Sistema de Alerta Temprana para Ciclones Tropicales (SIAT-CT)">
        </div>

        <section class="news-container">
            <h2 class="title"><span>Últimos eventos</span></h2>
            <div id="latest-events-container" class="cards"></div>
        </section>

        <section class="container">
            <article>
                <h2 class="title"><span>¿Qué es el SIAT-CT?</span></h2>
                <div class="text">
                    En el año 2000 el <strong>Si</strong>stema de <strong>A</strong>lerta <strong>T</strong>emprana para <strong>C</strong>iclones <strong>T</strong>ropicales <strong>(SIAT-CT)</strong> como una herramienta de coordinación en el alertamiento a la población y en la acción institucional, ante la amenaza ciclónica, que se sustenta en la interacción de los principales actores del Sistema Nacional de Protección Civil (SINAPROC): la sociedad civil y sus organizaciones; las instituciones de investigación del fenómeno hidrometeorológico e inclusive quienes estudian sus efectos sociales; los medios de comunicación masiva y la estructura gubernamental del SINAPROC.
                </div>
                <div class="text">
                    El SIAT-CT, tiene sus antecedentes primarios en los grandes desastres provocados en el pasado por fenómenos hidrometeorológicos; sin embargo es hasta los ocurridos en el año de 1999, cuando graves afectaciones en los estados de Puebla, Veracruz, Hidalgo y Tabasco, hicieron reflexionar de la necesidad de mejorar la coordinación de acciones para prevenir y mitigar grandes catástrofes.
                </div>
                <div class="text">
                    En el año 2017, la <strong>Coordinación Nacional de Protección Civil</strong>, a través de la <strong>Dirección General de Protección Civil (DGPC)</strong>, en colaboración con el <strong>Grupo Interinstitucional de Análisis y Coordinación para Ciclones Tropicales (GIAC-CT)</strong>, conformado por especialistas en Meteorología, Hidrología, Riesgos por Inundaciones y Riesgos por Inestabilidad de Laderas pertenecientes a las Secretarías de Gobernación, Defensa Nacional, Marina, Medio Ambiente y Recursos Naturales, Comunicaciones y Transportes así como de la Comisión Nacional de Electricidad, analizaron e implementaron la integración de información de fuentes oficiales como complemento a los niveles de alerta establecidos en caso de un ciclón tropical, con el fin de fortalecer el SIAT-CT.
                </div>
                <div class="text">
                    Así mismo, se solicitó la opinión de las autoridades estatales de protección civil de todas las entidades federativas para conocer las necesidades y puntos por fortalecer del boletín de alerta del SIAT CT y consensar la regionalización de los estados de la república con el fin de precisar de manera clara y detallada los niveles de alerta establecidos por la evolución de un ciclón tropical, cuando la alerta amerite acotar una o varias regiones del estado.
                </div>
            </article>

            <article>
                <h2 class="title"><span>Objetivo</span></h2>
                <div class="text">
                    Ser un mecanismo de alertamiento y coordinación que de manera consensuada genere una respuesta organizada del SINAPROC a la amenaza que constituye un ciclón tropical, mitigando los efectos de este agente perturbador.
                </div>
            </article>

            <article>
                <h2 class="title"><span>Aspectos técnicos</span></h2>
                <div class="text">
                    El SIAT-CT se basa en dos Tablas de Alertamiento que consideran los siguientes parámetros:
                    <ul>
                        <li>Intensidad del ciclón tropical según la Escala Saffir-Simpson.</li>
                        <li>Intensidad del ciclón tropical según la Escala de Circulación.</li>
                        <li>Velocidad de traslación del ciclón tropical.</li>
                        <li>Distancia del ciclón con respecto a la costa nacional o área afectable.</li>
                        <li>Tiempo estimado de llegada del ciclón a la costa nacional o área afectable.</li>
                    </ul>
                </div>

                <div class="simbologia">
                    <ul>
                        <li><span class="dot blue"></span>Peligro Muy Bajo</li>
                        <li><span class="dot green"></span>Peligro Bajo</li>
                        <li><span class="dot yellow"></span>Peligro Medio</li>
                        <li><span class="dot orange"></span>Peligro Alto</li>
                        <li><span class="dot red"></span>Peligro Máximo</li>
                    </ul>
                </div>
                <div class="semaforos">
                    <h3>Tabla de acercamiento</h3>
                    <div class="table-container">
                        <table class="table" cellpadding="0" cellspacing="0">
                            <thead>
                                <tr>
                                    <th>Promedio de escalas</th>
                                    <th>> 72h</th>
                                    <th>72h - 60h</th>
                                    <th>60h - 48h</th>
                                    <th>48h - 36h</th>
                                    <th>36h - 24h</th>
                                    <th>24h - 18h</th>
                                    <th>18h - 12h</th>
                                    <th>12h - 6h</th>
                                    <th>< 6h</th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr>
                                    <td>0 a 0.99</td>
                                    <td><span class="background blue"></span></td>
                                    <td><span class="background green"></span></td>
                                    <td><span class="background green"></span></td>
                                    <td><span class="background green"></span></td>
                                    <td><span class="background green"></span></td>
                                    <td><span class="background yellow"></span></td>
                                    <td><span class="background yellow"></span></td>
                                    <td><span class="background orange"></span></td>
                                    <td><span class="background red"></span></td>
                                </tr>
                                <tr>
                                    <td>1 a 1.99</td>
                                    <td><span class="background blue"></span></td>
                                    <td><span class="background green"></span></td>
                                    <td><span class="background green"></span></td>
                                    <td><span class="background green"></span></td>
                                    <td><span class="background yellow"></span></td>
                                    <td><span class="background yellow"></span></td>
                                    <td><span class="background orange"></span></td>
                                    <td><span class="background orange"></span></td>
                                    <td><span class="background red"></span></td>
                                </tr>
                                <tr>
                                    <td>2 a 2.99</td>
                                    <td><span class="background blue"></span></td>
                                    <td><span class="background green"></span></td>
                                    <td><span class="background green"></span></td>
                                    <td><span class="background yellow"></span></td>
                                    <td><span class="background yellow"></span></td>
                                    <td><span class="background orange"></span></td>
                                    <td><span class="background orange"></span></td>
                                    <td><span class="background orange"></span></td>
                                    <td><span class="background red"></span></td>
                                </tr>
                                <tr>
                                    <td>3 a 3.99</td>
                                    <td><span class="background blue"></span></td>
                                    <td><span class="background green"></span></td>
                                    <td><span class="background green"></span></td>
                                    <td><span class="background yellow"></span></td>
                                    <td><span class="background yellow"></span></td>
                                    <td><span class="background orange"></span></td>
                                    <td><span class="background orange"></span></td>
                                    <td><span class="background orange"></span></td>
                                    <td><span class="background red"></span></td>
                                </tr>
                                <tr>
                                    <td>4 a 4.99</td>
                                    <td><span class="background blue"></span></td>
                                    <td><span class="background green"></span></td>
                                    <td><span class="background yellow"></span></td>
                                    <td><span class="background yellow"></span></td>
                                    <td><span class="background orange"></span></td>
                                    <td><span class="background orange"></span></td>
                                    <td><span class="background orange"></span></td>
                                    <td><span class="background red"></span></td>
                                    <td><span class="background red"></span></td>
                                </tr>
                                <tr>
                                    <td>5</td>
                                    <td><span class="background blue"></span></td>
                                    <td><span class="background green"></span></td>
                                    <td><span class="background yellow"></span></td>
                                    <td><span class="background yellow"></span></td>
                                    <td><span class="background orange"></span></td>
                                    <td><span class="background orange"></span></td>
                                    <td><span class="background red"></span></td>
                                    <td><span class="background red"></span></td>
                                    <td><span class="background red"></span></td>
                                </tr>
                            </tbody>
                        </table>
                    </div>

                    <h3>Tabla de alejamiento</h3>
                    <div class="table-container">
                        <table class="table" cellpadding="0" cellspacing="0">
                            <thead>
                                <tr>
                                    <th>Promedio de escalas</th>
                                    <th>0km a 100km</th>
                                    <th>100km a 150km</th>
                                    <th>150km a 200km</th>
                                    <th>200km a 250km</th>
                                    <th>250km a 300km</th>
                                    <th>300km a 350km</th>
                                    <th>350km a 400km</th>
                                    <th>400km a 500km</th>
                                    <th>500km a 750km</th>
                                    <th>Más de 750 km</th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr>
                                    <td>0 a 0.99</td>
                                    <td><span class="background red"></span></td>
                                    <td><span class="background orange"></span></td>
                                    <td><span class="background orange"></span></td>
                                    <td><span class="background yellow"></span></td>
                                    <td><span class="background yellow"></span></td>
                                    <td><span class="background yellow"></span></td>
                                    <td><span class="background green"></span></td>
                                    <td><span class="background green"></span></td>
                                    <td><span class="background green"></span></td>
                                    <td><span class="background blue"></span></td>
                                </tr>
                                <tr>
                                    <td>1 a 1.99</td>
                                    <td><span class="background red"></span></td>
                                    <td><span class="background orange"></span></td>
                                    <td><span class="background orange"></span></td>
                                    <td><span class="background orange"></span></td>
                                    <td><span class="background yellow"></span></td>
                                    <td><span class="background yellow"></span></td>
                                    <td><span class="background yellow"></span></td>
                                    <td><span class="background green"></span></td>
                                    <td><span class="background green"></span></td>
                                    <td><span class="background blue"></span></td>
                                </tr>
                                <tr>
                                    <td>2 a 2.99</td>
                                    <td><span class="background red"></span></td>
                                    <td><span class="background red"></span></td>
                                    <td><span class="background orange"></span></td>
                                    <td><span class="background orange"></span></td>
                                    <td><span class="background yellow"></span></td>
                                    <td><span class="background yellow"></span></td>
                                    <td><span class="background yellow"></span></td>
                                    <td><span class="background green"></span></td>
                                    <td><span class="background green"></span></td>
                                    <td><span class="background blue"></span></td>
                                </tr>
                                <tr>
                                    <td>3 a 3.99</td>
                                    <td><span class="background red"></span></td>
                                    <td><span class="background red"></span></td>
                                    <td><span class="background orange"></span></td>
                                    <td><span class="background orange"></span></td>
                                    <td><span class="background orange"></span></td>
                                    <td><span class="background yellow"></span></td>
                                    <td><span class="background yellow"></span></td>
                                    <td><span class="background yellow"></span></td>
                                    <td><span class="background green"></span></td>
                                    <td><span class="background blue"></span></td>
                                </tr>
                                <tr>
                                    <td>4 a 4.99</td>
                                    <td><span class="background red"></span></td>
                                    <td><span class="background red"></span></td>
                                    <td><span class="background red"></span></td>
                                    <td><span class="background orange"></span></td>
                                    <td><span class="background orange"></span></td>
                                    <td><span class="background orange"></span></td>
                                    <td><span class="background yellow"></span></td>
                                    <td><span class="background yellow"></span></td>
                                    <td><span class="background green"></span></td>
                                    <td><span class="background blue"></span></td>
                                </tr>
                                <tr>
                                    <td>5</td>
                                    <td><span class="background red"></span></td>
                                    <td><span class="background red"></span></td>
                                    <td><span class="background red"></span></td>
                                    <td><span class="background red"></span></td>
                                    <td><span class="background orange"></span></td>
                                    <td><span class="background orange"></span></td>
                                    <td><span class="background orange"></span></td>
                                    <td><span class="background yellow"></span></td>
                                    <td><span class="background green"></span></td>
                                    <td><span class="background blue"></span></td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                </div>
            </article>
        </section>
    </div>
    <iframe id="MyIframe" src="/footer.html" scrolling="no" width="100%" height="425.5px" style="border: 0px;"></iframe>

    <script src="./JS/index.js"></script>

    <script id="storms-template" type="text/x-handlebars-template">
		{{#each storms as |evento|}}
			<div class="card">
                <div class="text">
                    <a href="http://www.preparados.cenapred.unam.mx/SIAT-CT/consulta.php?idBoletin={{evento.idBoletin}}">
                        <div>{{evento.categoria}} {{evento.nombre}}</div>
                        <div>Océano {{evento.oceano}}</div>
                    </a>
                </div>
            </div>
		{{/each}}
	</script>

    <script src="/js/nav-gob.js"></script>
    <script src="/js/gobiernoSub.js"></script>
    <script src="/js/mainSub.js"></script>
    <!-- myplugins.js complementa las funciones del toggle en el menú sel sub nav bar -->
    <script src="/js/myplugins.js"></script>
    <script src="/js/footer.js"></script>
</body>
</html>
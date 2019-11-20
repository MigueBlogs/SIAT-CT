var activeEvents = {
    chartDrawing: null
}

$(function() {
    var eventoActual = {
        currentId: "",
        allIds: []
    };

    var analisisRealizado;
    var analisisSistemasExpuestos = {};

    initMap();
    getYears()

    var queryParams = getAllUrlParams();
    if(queryParams.hasOwnProperty("idBoletin")) getSeguimiento(queryParams["idBoletin"]);

    function initMap() {
        require([
            "esri/Map",
            "esri/views/MapView",
            "esri/geometry/geometryEngineAsync",
            "esri/config"
        ], function(
            Map,
            MapView,
            geometryEngineAsync,
            esriConfig
        ) {
            esriConfig.request.proxyUrl = "http://rmgir.cenapred.gob.mx/proxy/proxy.php";

            var map = new Map({
                basemap: "hybrid"
            });

            var view = new MapView({
                container: "map",
                map: map,
                center: [-101.608429, 23.200961],
                zoom: 5
            });

            const redProp = {
                id: "statesRed",
                opacity: 0,
                outFields: ["*"],
                renderer: {
                    type: "simple",
                    symbol: {
                              type: "simple-fill",  
                              color: "red",
                              style: "solid",
                              outline: {  
                                color: "white",
                                width: 0.5},
                            },
                        },
                definitionExpression: "1 = 0"
            };
            const orangeProp = {
                id: "statesOrange",
                opacity: 0,
                showLabels: true,
                outFields: ["*"],
                renderer: {
                    type: "simple",
                    symbol: {
                              type: "simple-fill", 
                              color: "#FFA500",
                              style: "solid",
                              outline: { 
                                color: "white",
                                width: 0.5
                                },
                            },
                        },
                definitionExpression: "1 = 0"
            };

            const yellowProp = {
                id: "statesYellow",
                opacity: 0,
                showLabels: true,
                outFields: ["*"],
                renderer: {
                    type: "simple",
                    symbol: {
                              type: "simple-fill",
                              color: "#FFFF00",
                              style: "solid",
                              outline: { 
                                color: "white",
                                width: 0.5
                                },
                            },
                        },
                definitionExpression: "1 = 0"
            };
            const greenProp = {
                id: "statesGreen",
                opacity: 0,
                showLabels: true,
                outFields: ["*"],
                renderer: {
                    type: "simple",
                    symbol: {
                              type: "simple-fill",
                              color: "#38BF34",
                              style: "solid",
                              outline: { 
                                color: "white",
                                width: 0.5
                                },
                            },
                        },
                definitionExpression: "1 = 0"
            };
            const blueProp = {
                id: "statesBlue",
                opacity: 0,
                showLabels: true,
                outFields: ["*"],
                renderer: {
                    type: "simple",
                    symbol: {
                              type: "simple-fill", 
                              color: "#4F81BC",
                              style: "solid",
                              outline: {  
                                color: "white",
                                width: 0.5
                                },
                            },
                        },
                definitionExpression: "1 = 0"
            };

            const urlMunicipios = "http://rmgir.proyectomesoamerica.org/server/rest/services/DGPC/Regionalizacion_SIAT_CT/MapServer/0";
            addFeatureLayer(map, urlMunicipios, redProp);
            addFeatureLayer(map, urlMunicipios, orangeProp);
            addFeatureLayer(map, urlMunicipios, yellowProp);
            addFeatureLayer(map, urlMunicipios, greenProp);
            addFeatureLayer(map, urlMunicipios, blueProp);

            document.addEventListener("analisis", function(e) {
                var nivel = e.detail;
                var layer;

                $("#exposition").html("<div class='loading'><img class='loader' src='./img/loadingAnalisis.gif'/><div class='text'>Cargando Región...</div></div>");

                switch(nivel) {
                    case "AZUL":
                        layer = map.findLayerById("statesBlue");
                        break;
                    case "VERDE":
                        layer = map.findLayerById("statesGreen");
                        break;
                    case "AMARILLA":
                        layer = map.findLayerById("statesYellow");                        
                        break;
                    case "NARANJA":
                        layer = map.findLayerById("statesOrange");
                        break;
                    case "ROJA":
                        layer = map.findLayerById("statesRed");
                        break;
                }

                layer.queryFeatures().then(function(result) {
                    var geometries = result["features"].map(function(feature) { return feature["geometry"]; });
                    geometryEngineAsync.union(geometries).then(function(unionResult) {
                        if(!unionResult) {
                            var niveles = {
                                "AZUL": "Peligro mínimo",
                                "VERDE": "Peligro bajo",
                                "AMARILLA": "Peligro medio",
                                "NARANJA": "Peligro alto",
                                "ROJA": "Peligro máximo"
                            };
                            var templateSource = $("#noexposition-template").html();
                            var template = Handlebars.compile(templateSource);
                            var outputHTML = template({nivel: niveles[nivel]});
                            $("#exposition").html(outputHTML);
                        } else {
                            $("#exposition").html("<div class='loading'><img class='loader' src='./img/loadingAnalisis.gif'/><div class='text'>Realizando análisis...</div></div>");
                            realizarAnalisis(unionResult, [], nivel);
                        }
                    });
                });
            });

            document.addEventListener("alerts", function(e){
                var alerts = e.detail;
                var query;

                Object.keys(alerts).forEach(function(alert) {
                    var layer;
                    switch(alert) {
                        case "AZUL":
                            layer = map.findLayerById("statesBlue");
                            break;
                        case "VERDE":
                            layer = map.findLayerById("statesGreen");
                            break;
                        case "AMARILLA":
                            layer = map.findLayerById("statesYellow");                        
                            break;
                        case "NARANJA":
                            layer = map.findLayerById("statesOrange");
                            break;
                        case "ROJA":
                            layer = map.findLayerById("statesRed");
                            break;
                    }

                    if(alerts[alert][0] == "" && alerts[alert][1] == "") query = "1=0";
                    else if(alerts[alert][0] != "" && alerts[alert][1] != "") query = alerts[alert][0] + " OR " + alerts[alert][1];
                    else if(alerts[alert][0] == "") query = alerts[alert][1];
                    else if(alerts[alert][1] == "") query = alerts[alert][0];
                    
                    layer.definitionExpression = query;
                    query == "1=0" ? layer.opacity = 0 : layer.opacity = 0.6;
                    layer.refresh();
                });
            });
        });
    }

    function addFeatureLayer(map, url, properties, renderer = null) {
        require([
            "esri/layers/FeatureLayer"
        ], function(
            FeatureLayer
        ) {
            const layer = new FeatureLayer(url, properties);
            map.add(layer);
        });
    }

    function getEventInfo(idBoletin) {
        $.ajax({
            type: "GET",
            url: "./consulta_fns.php",
            data: { 
                evento: true,
                idBoletin: idBoletin
            },
            dataType: "json",
            success: function(result) {
                result["current"] = idBoletin;
                var idsBoletin = eventoActual["allIds"].map(function(boletin) { return boletin.idBoletin });
                result["next"] = idsBoletin.indexOf(idBoletin) < idsBoletin.length - 1 ? eventoActual["allIds"][idsBoletin.indexOf(idBoletin) + 1] : "";
                result["previous"] = idsBoletin.indexOf(idBoletin) > 0 ? eventoActual["allIds"][idsBoletin.indexOf(idBoletin) - 1] : "";
                
                var templateSource = $("#tropicalCicloneInfo-template").html();
                var template = Handlebars.compile(templateSource);
                var outputHTML = template(result);
                $("#tropicalCicloneInfo").html(outputHTML);

                var templateSource = $("#regionsTable-template").html();
                var template = Handlebars.compile(templateSource);
                var outputHTML = template(result);
                $("#regionsTable").html(outputHTML);

                var templateSource = $("#eventInfo-template").html();
                var template = Handlebars.compile(templateSource);
                var outputHTML = template(result);
                $("#eventInfo").html(outputHTML);

                var templateSource = $("#effects-template").html();
                var template = Handlebars.compile(templateSource);
                var outputHTML = template(result);
                $("#effects").html(outputHTML);

                var templateSource = $("#comments-template").html();
                var template = Handlebars.compile(templateSource);
                var outputHTML = template(result);
                $("#comments").html(outputHTML);

                $(".arrow").on("click", function() {
                    var idBoletin = $(this).attr("data-idBoletin");
                    clearTimeout(activeEvents["chartDrawing"]);
                    $("#exposition").html("");
                    analisisSistemasExpuestos = {};

                    getEventInfo(idBoletin);
                });

                var alertas = getAlertamiento(result);
                var event = new CustomEvent('alerts', { detail: alertas });
                document.dispatchEvent(event);
            },
            error: function(error) {

            }
        });
    }

    function getAlertamiento(obj) {
        if(!obj.hasOwnProperty("alertas")) return "";

        const alertas = obj["alertas"];
        const tiposAlerta = Object.keys(obj["alertas"]);
        const coloresAlerta = { 
            "AZUL": [], 
            "VERDE": [],
            "AMARILLA": [],
            "NARANJA": [],
            "ROJA": [] 
        };
        var query = "";

        tiposAlerta.forEach(function(tipoAlerta) {
            const nivelesAlerta = Object.keys(alertas[tipoAlerta]);
            nivelesAlerta.forEach(function(nivelAlerta) {
                const estados = Object.keys(alertas[tipoAlerta][nivelAlerta]);
                query = "";

                estados.forEach(function(estado, idxEstado) {
                    query += "MUNID IN (";
                    alertas[tipoAlerta][nivelAlerta][estado]["municipios"].forEach(function(municipio, idxMunicipio) {
                        query += "'" + parseInt(municipio["clave"]) + "'";
                        if(idxMunicipio < alertas[tipoAlerta][nivelAlerta][estado]["municipios"].length - 1) query += ","
                    });
                    query += ")";
                    if(idxEstado < estados.length - 1) query += " OR ";
                });

                coloresAlerta[nivelAlerta].push(query);
            });
        });

        return coloresAlerta;
    }

    function getAllUrlParams(url) {
        var queryString = url ? url.split('?')[1] : window.location.search.slice(1);
        var obj = {};
        
        if (queryString) {
            queryString = queryString.split('#')[0];
            var arr = queryString.split('&');
        
            for (var i = 0; i < arr.length; i++) {
                var a = arr[i].split('=');
                var paramName = a[0];
                var paramValue = typeof (a[1]) === 'undefined' ? true : a[1];

                // paramName = paramName.toLowerCase();
                // if (typeof paramValue === 'string') paramValue = paramValue.toLowerCase();
        
                if (paramName.match(/\[(\d+)?\]$/)) {
                    var key = paramName.replace(/\[(\d+)?\]/, '');
                    if (!obj[key]) obj[key] = [];
                    if (paramName.match(/\[\d+\]$/)) {
                        var index = /\[(\d+)\]/.exec(paramName)[1];
                        obj[key][index] = paramValue;
                    } else {
                        obj[key].push(paramValue);
                    }
                } else {
                    if (!obj[paramName]) {
                        obj[paramName] = paramValue;
                    } else if (obj[paramName] && typeof obj[paramName] === 'string'){
                        obj[paramName] = [obj[paramName]];
                        obj[paramName].push(paramValue);
                    } else {
                        obj[paramName].push(paramValue);
                    }
                }
            }
        }

        return obj;
    }

    function getSeguimiento(idBoletin) {
        $.ajax({
            type: "GET",
            url: "./siat_fns.php",
            data: { 
                getSeguimiento: true,
                idBoletin: idBoletin
            },
            dataType: "json",
            success: function(result) {
                eventoActual["allIds"] = result;
                eventoActual["currentId"] = result[0];
                
                $("#exposition").html("");
                analisisSistemasExpuestos = {};

                getEventInfo(idBoletin);
            }, error: function(result) {

            }
        });
    }

    function getTropicalCiclones(fechaInicio = "", fechaFin = "") {
        var parameters = { eventos: true };
        if(fechaInicio) parameters["startDate"] = fechaInicio;
        if(fechaFin) parameters["endDate"] = fechaFin;

        $.ajax({
            type: "GET",
            url: "./siat_fns.php",
            data: parameters,
            dataType: "json",
            success: function(result) {
                var templateSource = $("#storms-template").html();
                var template = Handlebars.compile(templateSource);
                var outputHTML = template({storms: result});
                $("#storms").html(outputHTML);

                $("#ciclonesTropicales").on("change", function() {
                    var idBoletin = $("#ciclonesTropicales option:selected").attr("data-idBoletin");
                    if(!idBoletin) return;

                    getSeguimiento(idBoletin);
                });
            }, error: function(result) {

            }
        });
    }

    function getYears() {
        $.ajax({
            type: "GET",
            url: "./siat_fns.php",
            data: { 
                years: true
            },
            dataType: "json",
            success: function(result) {
                var templateSource = $("#years-template").html();
                var template = Handlebars.compile(templateSource);
                var outputHTML = template(result);
                $("#years").html(outputHTML);

                $("#aniosDisponibles").on("change", function() {
                    debugger
                    var fechaInicio = "01/01/" + $(this).val();
                    var fechaFin = "01/01/" + (parseInt($(this).val()) + 1);
                    getTropicalCiclones(fechaInicio, fechaFin);
                });
            }, error: function(result) {

            }
        });
    }

    $("#table-analysis .button").on("click", function(e) {
        var nivel = $(this).attr("data-nivel");

        if(!analisisSistemasExpuestos.hasOwnProperty(nivel)) {
            var event = new CustomEvent('analisis', { detail: nivel });
            document.dispatchEvent(event);
        } else {
            var event = new CustomEvent('analisis-completo', { detail: {resultados: analisisSistemasExpuestos[nivel], nivel: nivel} });
            document.dispatchEvent(event);
        }
        
    });

    document.addEventListener("analisis-completo", function(e) {
        var resultados = e["detail"]["resultados"];
        var nivel = e["detail"]["nivel"];
        var niveles = {
            "AZUL": "Peligro mínimo",
            "VERDE": "Peligro bajo",
            "AMARILLA": "Peligro medio",
            "NARANJA": "Peligro alto",
            "ROJA": "Peligro máximo"
        }

        analisisSistemasExpuestos[nivel] = resultados;

        var templateSource = $("#exposition-template").html();
        var template = Handlebars.compile(templateSource);
        var outputHTML = template({resultados: resultados, nivel: niveles[nivel]});
        $("#exposition").html(outputHTML);
    });
});
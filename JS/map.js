var captured=false;
window.captured;
$(function() {
    function loadMap(container) {
        require([
            "esri/Map",
            "esri/views/MapView",
            "esri/config"
        ], function(
            Map,
            MapView,
            esriConfig
        ) {
            esriConfig.request.proxyUrl = "http://rmgir.cenapred.gob.mx/proxy/proxy.php";

            var map = new Map({
                basemap: "hybrid"
            });
      
            var view = new MapView({
                container: container,
                map: map,
                center: [-101.608429, 23.200961],
                zoom: 5
            });

            view["ui"]["components"] = ["attributtion"];
            view.when(function() {
                loadCiclones(map);
                loadKMLLayer(map, view, "https://www.nhc.noaa.gov/storm_graphics/api/AL072017_002Aadv_CONE.kmz", {id: "willa_cone"});

                const viewUpdating = view.watch("updating", function(){
                    viewUpdating.remove();

                    searchCicloneCones(map, view);
                });
            });

            // the button that triggers screen shot
            const screenshotBtn = document.getElementById("capture");

            var area = {
                x: 200,
                y: 30,
                width: 400,
                height: 300
              };
           
            screenshotBtn.addEventListener("click", function() {    
               
                view
                    .takeScreenshot({ format: "png", quality:100 })
                    .then(function(screenshot) {
                      showPreview(screenshot);
              });
                    if(guardadoGlobal){
                        $("#pdfError").hide();
                        $("#pdf").show();
                    }
                    window.captured=true;
            });
            
           

            $('#mapa_ciclon').click(function() {
                $('.js-screenshot-image').hide();
                $('#map-container').show();
                if(guardadoGlobal){
                    $("#pdfError").show();
                    $("#pdf").hide();
                }  
                 window.captured=false;
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

    function addMapImageLayer(map, options) {
        require([
            "esri/layers/MapImageLayer",
            "esri/layers/support/Sublayer"
        ], function(
            MapImageLayer
        ) {
            const layer = new MapImageLayer(options);
            map.add(layer);
        });
    }

    function addImageToMapImage(map, layerId, imageUrl, imageOptions, type) {
        require([
            "esri/geometry/Extent",
            "esri/layers/support/MapImage"
        ], function(
            Extent,
            MapImage
        ) {
            var tipos = {
                "topClouds": new Extent({
                    xmax: -44.5,
                    xmin: -122.5,
                    ymax: 35,
                    ymin: -2,
                    spatialReference: new SpatialReference(4326)
                }),
                "rgbClouds": new Extent({
                    xmax: -78.9325,
                    xmin: -125.19056,
                    ymax: 34.7925,
                    ymin: 6.295,
                    spatialReference: new SpatialReference(4326)
                })
            };
          
            var image = new MapImage({
                'extent': tipos[layerId],
                'href': imageUrl
            });
            
            if(!map.findLayerById(layerId)) return
            
            map.findLayerById(layerId).addImage(image);
            var images = map.findLayerById(layerId).getImages();
            if(images.length >= 3) map.findLayerById(layerId).removeImage(images[0]);

        });
    }

    function loadKMLLayer(map, mapView, url, properties, renderer = null) {
        require([
            "esri/layers/KMLLayer"
        ], function(
            KMLLayer
        ) {
            const layer = new KMLLayer(url, properties);
            map.add(layer);

            mapView
                .whenLayerView(layer)
                .then(function(layerView) {
                    const handler = mapView.watch("updating", function() {
                        handler.remove();
                        const layerViewCreated = new CustomEvent("kml-added", {
                            detail: {
                                map: map,
                                view: mapView,
                                id: layerView["layer"]["id"],
                                geometries: {
                                    polygons: layerView["allVisiblePolygons"]["items"],
                                    points: layerView["allVisiblePoints"]["items"],
                                    polylines: layerView["allVisiblePolylines"]["items"]
                                }
                            }
                        });
    
                        document.dispatchEvent(layerViewCreated);
                    });
                });
        });
    }

    function searchCicloneCones(map, mapView) {
        const conesLayers = map.layers["items"].filter(function(item) {
            return item["id"].indexOf("Cone") != -1;
        });

        var activeConesPromises = [];
        var activeCones = [];
        conesLayers.forEach(function(layer) {
            activeConesPromises.push(layer.queryFeatures());
        });

        Promise.all(activeConesPromises).then(function(results) {
            results.forEach(function(result, resultIdx) {
                if(result["features"].length) {
                    activeCones.push({
                        stormname: result["features"][0]["attributes"]["stormname"],
                        stormtype: result["features"][0]["attributes"]["stormtype"],
                        geometry: result["features"][0]["geometry"],
                        layerid: conesLayers[resultIdx]["id"]
                    });
                }
            });

            var templateSource = $("#stormsActive-template").html();
            var template = Handlebars.compile(templateSource);
            var outputHTML = template({storms: activeCones});
            $("#stormsActive").html(outputHTML);

            $("#stormsActive").on("change", function() {
                require([
                    "esri/tasks/GeometryService",
                    "esri/tasks/support/ProjectParameters"
                ], function(
                    GeometryService,
                    ProjectParameters
                ) {
                    var layerid = $("#stormsActive option:selected").attr("data-layerid");

                    //si no hay Evento en la selección
                    if(!layerid) {
                        $("#type").text("");
                        $("#sea").text("");
                        $("#name").text("");
                        $(".TitleOceano").text("");
                        $(".TitleTipo").text('');
                        $('#tablaEdos1 > tbody').html("");
	                    $('#tablaEdos2 > tbody').html("");
                        $("#regiones").hide();
                        $("#mostrar").hide();
                        $('#tablaEditar').show();
                        return;
                    }else{//si existe el evento muestra la tabla correspondiente
                        $("#regiones").hide();
                        $("#mostrar").hide();
                        $('#tablaEditar').show();
                    }

                    var layer = map.findLayerById(layerid);
                    var coneActive = activeCones.filter(function(activeCone) { if(activeCone["layerid"] == layerid) return activeCone; })[0];

                    var geometryService = new GeometryService({ url: "http://rmgir.proyectomesoamerica.org/server/rest/services/Utilities/Geometry/GeometryServer" });
                    var params = new ProjectParameters({
                        geometries: [coneActive["geometry"]["extent"]],
                        outSpatialReference: mapView["spatialReference"]
                    });

                    geometryService.project(params).then(function(result) {
                        mapView.goTo(result[0]);

                        $("#type").text(getCicloneType(coneActive["stormtype"]));
                        $("#name").text(coneActive["stormname"]);
                        $("#sea").text(getSea(coneActive["layerid"]) + " / ");
                        tituloSecundario();
                        const oceano = getSea(coneActive["layerid"]) == "EP" ? "PACÍFICO" : "ATLÁNTICO"; 
                        $(".TitleOceano").text(oceano);
                        queryRegions(map, mapView, [coneActive["geometry"]], "objectid");
                    });
                })
            });
        });
    }

    function getCicloneType(type) {
        if(type == "TS") return "TT";
        else if(type == "TD") return "DT";
        else if(type == "H") return "Huracán";
        else return "NA";
    }

    function getSea(layerId) {
        if(layerId.indexOf("EP") != -1) return "EP";
        else return "AT";
    }

    function getQuery(array, objectidName = "OBJECTID"){
        if(array.length <= 1000)
            return  objectidName + " IN (" + array.join(',') + ")";
    
        return objectidName + " IN (" + array.splice(0, 1000).join(",") + ") OR " + getQuery(array, objectidName);
    }

    function queryRegions(map, mapView, geometries, objectidField) {
        require([
            "esri/tasks/QueryTask",
            "esri/tasks/support/Query"
        ], function(
            QueryTask,
            Query
        ) {
            const layerUrl = "http://rmgir.proyectomesoamerica.org/server/rest/services/DGPC/Regionalizacion_SIAT_CT/MapServer/0";
            var queryTask = new QueryTask({ url: layerUrl });
            var regionsLocated = [];
            var queryPromises = [];

            geometries.forEach(function(geometry) {
                var query = new Query();
                query.geometry = geometry;
                query.spatialRelationship = "intersects";

                queryPromises.push(queryTask.executeForIds(query));
            });

            Promise.all(queryPromises).then(function(results) {
                var featuresPromises = [];
                results.forEach(function(result) {
                    if(!result) return

                    const outFields = ["Regional_1", "Regional_2"];
                    var query = new Query();
                    query.where = getQuery(result, objectidField);
                    query.returnGeometry = false;
                    query.outFields = outFields;
                    query.returnDistinctValues = true;

                    featuresPromises.push(queryTask.execute(query));
                });

                Promise.all(featuresPromises).then(function(featureResults) {
                    var eventRegions = {};
                    featureResults.forEach(function(featureResult) {
                        featureResult["features"].forEach(function(feature) {
                            const attributes = feature["attributes"];
                            const edosMalos = {
                                "COAHUILA DE ZARAGOZA": "COAHUILA", 
                                "DISTRITO FEDERAL": "CIUDAD DE MÉXICO",
                                "MEXICO": "MÉXICO",
                                "MICHOACAN DE OCAMPO": "MICHOACÁN",
                                "NUEVO LEON": "NUEVO LEÓN",
                                "QUERETARO DE ARTEAGA": "QUERÉTARO",
                                "SAN LUIS POTOSI": "SAN LUIS POTOSÍ",
                                "VERACRUZ-LLAVE": "VERACRUZ",
                                "YUCATAN": "YUCATÁN"
                            };

                            var edo = attributes["Regional_1"];

                            if(edo in edosMalos) edo = edosMalos[edo];
                            if(!eventRegions[edo]) eventRegions[edo] = {};
                            if(!eventRegions[edo][attributes["Regional_2"]]) eventRegions[edo][attributes["Regional_2"]] = 0;
    
                            eventRegions[edo][attributes["Regional_2"]]++;
                        });
    
                        regionsLocated.push(eventRegions);
                    });
                    
                    console.log(regionsLocated);
                    loadEdo(regionsLocated[0]);
                });
            });
            
        });
    }

    function loadSatesColored(map){

    }

    function loadCiclones(map) {
        const activeHurricanesEPUrls = [
            {
                "name": "EP1",
                "layers": {
                    "forecastCone": "https://idpgis.ncep.noaa.gov/arcgis/rest/services/NWS_Forecasts_Guidance_Warnings/NHC_E_Pac_trop_cyclones/MapServer/6",
                    "forecastPoints": "https://idpgis.ncep.noaa.gov/arcgis/rest/services/NWS_Forecasts_Guidance_Warnings/NHC_E_Pac_trop_cyclones/MapServer/4",
                    "forecastTrack": "https://idpgis.ncep.noaa.gov/arcgis/rest/services/NWS_Forecasts_Guidance_Warnings/NHC_E_Pac_trop_cyclones/MapServer/5",
                    "watchWarnings": "https://idpgis.ncep.noaa.gov/arcgis/rest/services/NWS_Forecasts_Guidance_Warnings/NHC_E_Pac_trop_cyclones/MapServer/7",
                    "pastTrack": "https://idpgis.ncep.noaa.gov/arcgis/rest/services/NWS_Forecasts_Guidance_Warnings/NHC_E_Pac_trop_cyclones/MapServer/9",
                    "pastPoints": "https://idpgis.ncep.noaa.gov/arcgis/rest/services/NWS_Forecasts_Guidance_Warnings/NHC_E_Pac_trop_cyclones/MapServer/8"
                }
            },{
                "name": "EP2",
                "layers": {
                    "forecastCone": "https://idpgis.ncep.noaa.gov/arcgis/rest/services/NWS_Forecasts_Guidance_Warnings/NHC_E_Pac_trop_cyclones/MapServer/16",
                    "forecastPoints": "https://idpgis.ncep.noaa.gov/arcgis/rest/services/NWS_Forecasts_Guidance_Warnings/NHC_E_Pac_trop_cyclones/MapServer/14",
                    "forecastTrack": "https://idpgis.ncep.noaa.gov/arcgis/rest/services/NWS_Forecasts_Guidance_Warnings/NHC_E_Pac_trop_cyclones/MapServer/15",
                    "watchWarnings": "https://idpgis.ncep.noaa.gov/arcgis/rest/services/NWS_Forecasts_Guidance_Warnings/NHC_E_Pac_trop_cyclones/MapServer/17",
                    "pastTrack": "https://idpgis.ncep.noaa.gov/arcgis/rest/services/NWS_Forecasts_Guidance_Warnings/NHC_E_Pac_trop_cyclones/MapServer/19",
                    "pastPoints": "https://idpgis.ncep.noaa.gov/arcgis/rest/services/NWS_Forecasts_Guidance_Warnings/NHC_E_Pac_trop_cyclones/MapServer/18"
                }
            },{
                "name": "EP3",
                "layers": {
                    "forecastCone": "https://idpgis.ncep.noaa.gov/arcgis/rest/services/NWS_Forecasts_Guidance_Warnings/NHC_E_Pac_trop_cyclones/MapServer/26",
                    "forecastPoints": "https://idpgis.ncep.noaa.gov/arcgis/rest/services/NWS_Forecasts_Guidance_Warnings/NHC_E_Pac_trop_cyclones/MapServer/24",
                    "forecastTrack": "https://idpgis.ncep.noaa.gov/arcgis/rest/services/NWS_Forecasts_Guidance_Warnings/NHC_E_Pac_trop_cyclones/MapServer/25",
                    "watchWarnings": "https://idpgis.ncep.noaa.gov/arcgis/rest/services/NWS_Forecasts_Guidance_Warnings/NHC_E_Pac_trop_cyclones/MapServer/27",
                    "pastTrack": "https://idpgis.ncep.noaa.gov/arcgis/rest/services/NWS_Forecasts_Guidance_Warnings/NHC_E_Pac_trop_cyclones/MapServer/29",
                    "pastPoints": "https://idpgis.ncep.noaa.gov/arcgis/rest/services/NWS_Forecasts_Guidance_Warnings/NHC_E_Pac_trop_cyclones/MapServer/28",
                }
            },{
                "name": "EP4",
                "layers": {
                    "forecastCone": "https://idpgis.ncep.noaa.gov/arcgis/rest/services/NWS_Forecasts_Guidance_Warnings/NHC_E_Pac_trop_cyclones/MapServer/36",
                    "forecastPoints": "https://idpgis.ncep.noaa.gov/arcgis/rest/services/NWS_Forecasts_Guidance_Warnings/NHC_E_Pac_trop_cyclones/MapServer/34",
                    "forecastTrack": "https://idpgis.ncep.noaa.gov/arcgis/rest/services/NWS_Forecasts_Guidance_Warnings/NHC_E_Pac_trop_cyclones/MapServer/35",
                    "watchWarnings": "https://idpgis.ncep.noaa.gov/arcgis/rest/services/NWS_Forecasts_Guidance_Warnings/NHC_E_Pac_trop_cyclones/MapServer/37",
                    "pastTrack": "https://idpgis.ncep.noaa.gov/arcgis/rest/services/NWS_Forecasts_Guidance_Warnings/NHC_E_Pac_trop_cyclones/MapServer/39",
                    "pastPoints": "https://idpgis.ncep.noaa.gov/arcgis/rest/services/NWS_Forecasts_Guidance_Warnings/NHC_E_Pac_trop_cyclones/MapServer/38",
                }
            },{
                "name": "EP5",
                "layers": {
                    "forecastCone": "https://idpgis.ncep.noaa.gov/arcgis/rest/services/NWS_Forecasts_Guidance_Warnings/NHC_E_Pac_trop_cyclones/MapServer/46",
                    "forecastPoints": "https://idpgis.ncep.noaa.gov/arcgis/rest/services/NWS_Forecasts_Guidance_Warnings/NHC_E_Pac_trop_cyclones/MapServer/44",
                    "forecastTrack": "https://idpgis.ncep.noaa.gov/arcgis/rest/services/NWS_Forecasts_Guidance_Warnings/NHC_E_Pac_trop_cyclones/MapServer/45",
                    "watchWarnings": "https://idpgis.ncep.noaa.gov/arcgis/rest/services/NWS_Forecasts_Guidance_Warnings/NHC_E_Pac_trop_cyclones/MapServer/47",
                    "pastTrack": "https://idpgis.ncep.noaa.gov/arcgis/rest/services/NWS_Forecasts_Guidance_Warnings/NHC_E_Pac_trop_cyclones/MapServer/49",
                    "pastPoints": "https://idpgis.ncep.noaa.gov/arcgis/rest/services/NWS_Forecasts_Guidance_Warnings/NHC_E_Pac_trop_cyclones/MapServer/48",
                }
            }
        ];

        const activeHurricanesATUrls = [
            {
                "name": "AT1",
                "layers": {
                    "forecastCone": "https://idpgis.ncep.noaa.gov/arcgis/rest/services/NWS_Forecasts_Guidance_Warnings/NHC_Atl_trop_cyclones/MapServer/6",
                    "forecastPoints": "https://idpgis.ncep.noaa.gov/arcgis/rest/services/NWS_Forecasts_Guidance_Warnings/NHC_Atl_trop_cyclones/MapServer/4",
                    "forecastTrack": "https://idpgis.ncep.noaa.gov/arcgis/rest/services/NWS_Forecasts_Guidance_Warnings/NHC_Atl_trop_cyclones/MapServer/5",
                    "watchWarnings": "https://idpgis.ncep.noaa.gov/arcgis/rest/services/NWS_Forecasts_Guidance_Warnings/NHC_Atl_trop_cyclones/MapServer/7",
                    "pastTrack": "https://idpgis.ncep.noaa.gov/arcgis/rest/services/NWS_Forecasts_Guidance_Warnings/NHC_Atl_trop_cyclones/MapServer/9",
                    "pastPoints": "https://idpgis.ncep.noaa.gov/arcgis/rest/services/NWS_Forecasts_Guidance_Warnings/NHC_Atl_trop_cyclones/MapServer/8",
                }
            },{
                "name": "AT2",
                "layers": {
                    "forecastCone": "https://idpgis.ncep.noaa.gov/arcgis/rest/services/NWS_Forecasts_Guidance_Warnings/NHC_Atl_trop_cyclones/MapServer/17",
                    "forecastPoints": "https://idpgis.ncep.noaa.gov/arcgis/rest/services/NWS_Forecasts_Guidance_Warnings/NHC_Atl_trop_cyclones/MapServer/15",
                    "forecastTrack": "https://idpgis.ncep.noaa.gov/arcgis/rest/services/NWS_Forecasts_Guidance_Warnings/NHC_Atl_trop_cyclones/MapServer/16",
                    "watchWarnings": "https://idpgis.ncep.noaa.gov/arcgis/rest/services/NWS_Forecasts_Guidance_Warnings/NHC_Atl_trop_cyclones/MapServer/18",
                    "pastTrack": "https://idpgis.ncep.noaa.gov/arcgis/rest/services/NWS_Forecasts_Guidance_Warnings/NHC_Atl_trop_cyclones/MapServer/20",
                    "pastPoints": "https://idpgis.ncep.noaa.gov/arcgis/rest/services/NWS_Forecasts_Guidance_Warnings/NHC_Atl_trop_cyclones/MapServer/19",
                }
            },{
                "name": "AT3",
                "layers": {
                    "forecastCone": "https://idpgis.ncep.noaa.gov/arcgis/rest/services/NWS_Forecasts_Guidance_Warnings/NHC_Atl_trop_cyclones/MapServer/28",
                    "forecastPoints": "https://idpgis.ncep.noaa.gov/arcgis/rest/services/NWS_Forecasts_Guidance_Warnings/NHC_Atl_trop_cyclones/MapServer/26",
                    "forecastTrack": "https://idpgis.ncep.noaa.gov/arcgis/rest/services/NWS_Forecasts_Guidance_Warnings/NHC_Atl_trop_cyclones/MapServer/27",
                    "watchWarnings": "https://idpgis.ncep.noaa.gov/arcgis/rest/services/NWS_Forecasts_Guidance_Warnings/NHC_Atl_trop_cyclones/MapServer/29",
                    "pastTrack": "https://idpgis.ncep.noaa.gov/arcgis/rest/services/NWS_Forecasts_Guidance_Warnings/NHC_Atl_trop_cyclones/MapServer/31",
                    "pastPoints": "https://idpgis.ncep.noaa.gov/arcgis/rest/services/NWS_Forecasts_Guidance_Warnings/NHC_Atl_trop_cyclones/MapServer/30",
                }
            },{
                "name": "AT4",
                "layers": {
                    "forecastCone": "https://idpgis.ncep.noaa.gov/arcgis/rest/services/NWS_Forecasts_Guidance_Warnings/NHC_Atl_trop_cyclones/MapServer/39",
                    "forecastPoints": "https://idpgis.ncep.noaa.gov/arcgis/rest/services/NWS_Forecasts_Guidance_Warnings/NHC_Atl_trop_cyclones/MapServer/37",
                    "forecastTrack": "https://idpgis.ncep.noaa.gov/arcgis/rest/services/NWS_Forecasts_Guidance_Warnings/NHC_Atl_trop_cyclones/MapServer/38",
                    "watchWarnings": "https://idpgis.ncep.noaa.gov/arcgis/rest/services/NWS_Forecasts_Guidance_Warnings/NHC_Atl_trop_cyclones/MapServer/40",
                    "pastTrack": "https://idpgis.ncep.noaa.gov/arcgis/rest/services/NWS_Forecasts_Guidance_Warnings/NHC_Atl_trop_cyclones/MapServer/42",
                    "pastPoints": "https://idpgis.ncep.noaa.gov/arcgis/rest/services/NWS_Forecasts_Guidance_Warnings/NHC_Atl_trop_cyclones/MapServer/41",
                }
            },{
                "name": "AT5",
                "layers": {
                    "forecastCone": "https://idpgis.ncep.noaa.gov/arcgis/rest/services/NWS_Forecasts_Guidance_Warnings/NHC_Atl_trop_cyclones/MapServer/50",
                    "forecastPoints": "https://idpgis.ncep.noaa.gov/arcgis/rest/services/NWS_Forecasts_Guidance_Warnings/NHC_Atl_trop_cyclones/MapServer/48",
                    "forecastTrack": "https://idpgis.ncep.noaa.gov/arcgis/rest/services/NWS_Forecasts_Guidance_Warnings/NHC_Atl_trop_cyclones/MapServer/49",
                    "watchWarnings": "https://idpgis.ncep.noaa.gov/arcgis/rest/services/NWS_Forecasts_Guidance_Warnings/NHC_Atl_trop_cyclones/MapServer/51",
                    "pastTrack": "https://idpgis.ncep.noaa.gov/arcgis/rest/services/NWS_Forecasts_Guidance_Warnings/NHC_Atl_trop_cyclones/MapServer/53",
                    "pastPoints": "https://idpgis.ncep.noaa.gov/arcgis/rest/services/NWS_Forecasts_Guidance_Warnings/NHC_Atl_trop_cyclones/MapServer/52",
                }
            }
        ];

        const forecastPointsLabelClass = {
            symbol: {
                type: "text",
                color: "white",
                haloColor: "black",
                font: {
                    family: "Arial",
                    size: 9,
                    weight: "bold"
                }
            },
            labelPlacement: "above-center",
            labelExpressionInfo: {
                expression: "$feature.STORMNAME + IIF($feature.SSNUM != 0, ' ,Cat ' + $feature.SSNUM, '') + ' ,' + $feature.DATELBL"
            }
        };

        const pointDepressionSymbol = {
            type: "picture-marker",
            url: "./img/ciclones/depresion.png",
            width: "20px",
            height: "20px"
        };

        const pointStormSymbol = {
            type: "picture-marker",
            url: "./img/ciclones/tormenta.png",
            width: "20px",
            height: "20px"
        };

        const pointHurricaneSymbol = {
            type: "picture-marker",
            url: "./img/ciclones/huracan.png",
            width: "20px",
            height: "20px"
        };

        var forecastPointsRenderer = {
            type: "unique-value",
            field: "DVLBL",
            uniqueValueInfos: [
              {
                value: "D",
                symbol: pointDepressionSymbol
              }, {
                value: "S",
                symbol: pointStormSymbol
              }, {
                value: "H",
                symbol: pointHurricaneSymbol
              }, {
                value: "M",
                symbol: pointHurricaneSymbol
              }
            ]
        };

        const forecastTrackRenderer = {
            type: "simple",
            symbol: {
                type: "simple-line",
                color: "#079BFF",
                width: "3px",
                style: "dash"
            }
        };

        const pastTrackRenderer = {
            type: "simple",
            symbol: {
                type: "simple-line",
                color: "#079BFF",
                width: "1px",
                style: "solid"
            }
        };

        const pastTrackPointSymbol = {
            type: "picture-marker",
            url: "./img/ciclones/pastTrack.png",
            width: "8px",
            height: "8px"
        }

        const pastTrackPointRenderer = {
            type: "simple",
            symbol: pastTrackPointSymbol
        }

        activeHurricanesEPUrls.forEach(function(hurricaneEvent) {
            const name = hurricaneEvent["name"];
            const layers = hurricaneEvent["layers"];
            Object.keys(layers).forEach(function(type) {
                const layerId = name + "_" + type;
                var properties = {
                    id: layerId,  
                    opacity: 0.8,
                    refreshInterval: 10,
                    showLabels: true,
                    outFields: ["*"]
                };

                if(type == "forecastPoints") {
                    properties["labelingInfo"] = [forecastPointsLabelClass];
                    properties["renderer"] = forecastPointsRenderer;
                } else if(type == "forecastTrack") {
                    properties["renderer"] = forecastTrackRenderer;
                } else if(type == "pastTrack") {
                    properties["renderer"] = pastTrackRenderer;
                } else if(type == "pastPoints") {
                    properties["renderer"] = pastTrackPointRenderer;
                }

                addFeatureLayer(map, layers[type], properties);
            });
        });

        activeHurricanesATUrls.forEach(function(hurricaneEvent) {
            const name = hurricaneEvent["name"];
            const layers = hurricaneEvent["layers"];
            Object.keys(layers).forEach(function(type) {
                const layerId = name + "_" + type;
                const properties = {
                    id: layerId,  
                    opacity: 0.8,
                    refreshInterval: 10,
                    showLabels: true,
                    outFields: ["*"]
                };

                if(type == "forecastPoints") {
                    properties["labelingInfo"] = [forecastPointsLabelClass];
                    properties["renderer"] = forecastPointsRenderer;
                } else if(type == "forecastTrack") {
                    properties["renderer"] = forecastTrackRenderer;
                } else if(type == "pastTrack") {
                    properties["renderer"] = pastTrackRenderer;
                } else if(type == "pastPoints") {
                    properties["renderer"] = pastTrackPointRenderer;
                }

                addFeatureLayer(map, layers[type], properties);
            });
        });

        /*
        MODIFICAR PARA CUANDO GUARDE LOS DATOS DE LA TABLA DE REGIONES
        const propertiesStates = {
            id: "states",  
            opacity: 0.8,
            showLabels: true,
            outFields: ["*"],
            renderer: estatesRender,
            definitionExpression: "1 = 0"
        };

        const url = "http://rmgir.proyectomesoamerica.org/server/rest/services/DGPC/Regionalizacion_SIAT_CT/MapServer/0";
        addFeatureLayer(map, url, propertiesStates);

        const layer = map.findLayerById("states");
        layer.definitionExpression = '<>':
        layer.refresh();
        */
    }

    document.addEventListener("kml-added", function(evt) {
        //debugger
        const layerDetail = evt["detail"];
        const geometries = layerDetail["geometries"]["polygons"].map(function(polygon){ return polygon["geometry"]; });

        queryRegions(layerDetail["map"], layerDetail["view"], geometries, "FID");
    });

    function showPreview(screenshot) {
        $('.js-screenshot-image').show();
        const screenshotImage = document.getElementsByClassName("js-screenshot-image")[0];
        screenshotImage.width = screenshot.data.width;
        screenshotImage.height = screenshot.data.height;
        screenshotImage.src = screenshot.dataUrl;
        //$('#imagen').css("width","100%");
        //$('#imagen').css("height","100%");
    
        $('#map-container').hide();
    }

    loadMap("map");
});

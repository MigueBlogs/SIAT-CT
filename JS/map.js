$(function() {
    function loadMap(container) {
        require([
            "esri/Map",
            "esri/views/MapView"
        ], function(Map, MapView) {
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
                addFeatureLayer(map, "http://rmgir.proyectomesoamerica.org/server/rest/services/DGPC/Regionalizacion_SIAT_CT/MapServer/0", {id: "regionalizacion", outFields: ["Regional_1", "Regional_2"], visible: true});
                loadKMLLayer(map, view, "https://www.nhc.noaa.gov/storm_graphics/api/AL072017_001Aadv_CONE.kmz", {id: "willa_cone"});
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
            });
            
           

            $('#mapa_ciclon').click(function() {
                $('.js-screenshot-image').hide();
                $('#map-container').show();
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

    function searchCicloneCones(map) {
        const conesLayers = map.layers["items"].filter(function(item) {
            return item["id"].indexOf("Cone") != -1;
        });

        var activeConesPromises = [];
        var activeCones = [];
        conesLayers.forEach(function(layer) {
            activeConesPromises.push(layer.queryFeatures());
        });

        Promise.all(activeConesPromises).then(function(results) {
            results.forEach(function(result) {
                if(result["features"].length) activeCones.push(result["features"][0]);
            });

            if(activeCones.length) queryRegions(map, activeCones);
        });
    }

    function getQuery(array, objectidName = "OBJECTID"){
        if(array.length <= 1000)
            return  objectidName + " IN (" + array.join(',') + ")";
    
        return objectidName + " IN (" + array.splice(0, 1000).join(",") + ") OR " + getQuery(array, objectidName);
    }

    function queryRegions(map, geometries) {
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
                    const outFields = ["Regional_1", "Regional_2"];
                    var query = new Query();
                    query.where = getQuery(result, "FID");
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
                            if(!eventRegions[attributes["Regional_1"]]) eventRegions[attributes["Regional_1"]] = {};
                            if(!eventRegions[attributes["Regional_1"]][attributes["Regional_2"]]) eventRegions[attributes["Regional_1"]][attributes["Regional_2"]] = 0;
    
                            eventRegions[attributes["Regional_1"]][attributes["Regional_2"]]++;
                        });
    
                        regionsLocated.push(eventRegions);
                    });
                    
                    console.log(regionsLocated);
                   loadEdo(regionsLocated[0]);
                });
            });
            
        });
    }

    window.searchCicloneCones = searchCicloneCones;

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
                    "pastPoints": "https://idpgis.ncep.noaa.gov/arcgis/rest/services/NWS_Forecasts_Guidance_Warnings/NHC_E_Pac_trop_cyclones/MapServer/8",
                }
            },{
                "name": "EP2",
                "layers": {
                    "forecastCone": "https://idpgis.ncep.noaa.gov/arcgis/rest/services/NWS_Forecasts_Guidance_Warnings/NHC_E_Pac_trop_cyclones/MapServer/16",
                    "forecastPoints": "https://idpgis.ncep.noaa.gov/arcgis/rest/services/NWS_Forecasts_Guidance_Warnings/NHC_E_Pac_trop_cyclones/MapServer/14",
                    "forecastTrack": "https://idpgis.ncep.noaa.gov/arcgis/rest/services/NWS_Forecasts_Guidance_Warnings/NHC_E_Pac_trop_cyclones/MapServer/15",
                    "watchWarnings": "https://idpgis.ncep.noaa.gov/arcgis/rest/services/NWS_Forecasts_Guidance_Warnings/NHC_E_Pac_trop_cyclones/MapServer/17",
                    "pastTrack": "https://idpgis.ncep.noaa.gov/arcgis/rest/services/NWS_Forecasts_Guidance_Warnings/NHC_E_Pac_trop_cyclones/MapServer/19",
                    "pastPoints": "https://idpgis.ncep.noaa.gov/arcgis/rest/services/NWS_Forecasts_Guidance_Warnings/NHC_E_Pac_trop_cyclones/MapServer/18",
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
                    opacity: 0.5,
                    showLabels: true,
                    outFields: ["*"]
                };

                addFeatureLayer(map, layers[type], properties);
            });
        });
    }

    document.addEventListener("kml-added", function(evt) {
        //debugger
        const layerDetail = evt["detail"];
        const geometries = layerDetail["geometries"]["polygons"].map(function(polygon){ return polygon["geometry"]; });

        queryRegions(layerDetail["map"], geometries);
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

    loadMap("map-container");
});

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

        activeHurricanesEPUrls.forEach(function(hurricaneEvent) {
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

        // require([
        //     "esri/layers/FeatureLayer"
        // ], function(
        //     FeatureLayer
        // ) {
            
        
        //     noaaAlt1.setRefreshInterval(10);
        //     noaaAlt2.setRefreshInterval(10);
        //     noaaAlt3.setRefreshInterval(10);
        //     noaaAlt4.setRefreshInterval(10);
        //     noaaAlt5.setRefreshInterval(10);
        //     noaaAlt6.setRefreshInterval(10);
        //     noaaAlt7.setRefreshInterval(10);
        //     noaaAlt8.setRefreshInterval(10);
        //     noaaAlt9.setRefreshInterval(10);
        //     noaaAlt10.setRefreshInterval(10);
        //     noaaAlt11.setRefreshInterval(10);
        //     noaaAlt12.setRefreshInterval(10);
        //     noaaAlt13.setRefreshInterval(10);
        //     noaaAlt14.setRefreshInterval(10);
        //     noaaAlt15.setRefreshInterval(10);
        //     noaaAlt16.setRefreshInterval(10);
        //     noaaAlt17.setRefreshInterval(10);
        //     noaaAlt18.setRefreshInterval(10);
        //     noaaAlt19.setRefreshInterval(10);
        //     noaaAlt20.setRefreshInterval(10);
        //     noaaAlt21.setRefreshInterval(10);
        //     noaaAlt22.setRefreshInterval(10);
        //     noaaAlt23.setRefreshInterval(10);
        //     noaaAlt24.setRefreshInterval(10);    
        //     noaaAlt25.setRefreshInterval(10);
        
        //     var defaultSymbol;
        //     var renderPastPosition = new UniqueValueRenderer(defaultSymbol,"basin");
        //     renderPastPosition.addValue("ep", new PictureMarkerSymbol('imagenes/imgTrack.png',8,8));
        //     renderPastPosition.addValue("al", new PictureMarkerSymbol('imagenes/imgTrack.png',8,8));
        
        //     noaaAlt5.setRenderer(renderPastPosition);
        //     noaaAlt10.setRenderer(renderPastPosition);
        //     noaaAlt15.setRenderer(renderPastPosition);
        //     noaaAlt20.setRenderer(renderPastPosition);
        //     noaaAlt25.setRenderer(renderPastPosition);
        
        //     var renderForecastPosition = new UniqueValueRenderer(defaultSymbol,"dvlbl");
        
        //     renderForecastPosition.addValue("S", new PictureMarkerSymbol('imagenes/imgS.png',40,40));
        //     renderForecastPosition.addValue("D", new PictureMarkerSymbol('imagenes/imgD.png',40,40));
        //     renderForecastPosition.addValue("H", new PictureMarkerSymbol('imagenes/imgH.png',40,40));
        //     renderForecastPosition.addValue("M", new PictureMarkerSymbol('imagenes/imgH.png',40,40));
        
        //     noaaAlt1.setRenderer(renderForecastPosition);
        //     noaaAlt6.setRenderer(renderForecastPosition);
        //     noaaAlt11.setRenderer(renderForecastPosition);
        //     noaaAlt16.setRenderer(renderForecastPosition);
        //     noaaAlt21.setRenderer(renderForecastPosition);
        
        //     var lineColor = new Color("#079BFF");
        //     var lineStyleDash = new SimpleLineSymbol("dash", lineColor, 2.5);
        //     var lineStyleSolid = new SimpleLineSymbol("solid", lineColor, 2.5);
        
        //     var lineRenderDash = new SimpleRenderer(lineStyleDash);
        //     var lineRenderSolid = new SimpleRenderer(lineStyleSolid);
        
        //     /*Label de la posición huracan*/
        //     var positionLayerLabel = new TextSymbol().setColor(new Color([255,255,255]));
        //     positionLayerLabel.font.setSize("10pt");
        //     positionLayerLabel.font.setFamily("arial");
        //     var jsonPosition = {
        //         "labelExpressionInfo": {"value": "{stormname}, Cat. {ssnum}, {datelbl}, {tcdvlp}"}
        //     };
        //     var labelClass = new LabelClass(jsonPosition);
        //     labelClass.symbol = positionLayerLabel;
        
        //     noaaAlt1.setLabelingInfo([ labelClass ]);
        //     noaaAlt6.setLabelingInfo([ labelClass ]);
        //     noaaAlt11.setLabelingInfo([ labelClass ]);
        //     noaaAlt16.setLabelingInfo([ labelClass ]);
        //     noaaAlt21.setLabelingInfo([ labelClass ]);    
        
        //     noaaAlt2.setRenderer(lineRenderDash);
        //     noaaAlt7.setRenderer(lineRenderDash);
        //     noaaAlt12.setRenderer(lineRenderDash);
        //     noaaAlt17.setRenderer(lineRenderDash);
        //     noaaAlt22.setRenderer(lineRenderDash);
        
        //     noaaAlt26.setRenderer(lineRenderSolid);
        //     noaaAlt27.setRenderer(lineRenderSolid);
        //     noaaAlt28.setRenderer(lineRenderSolid);
        //     noaaAlt29.setRenderer(lineRenderSolid);
        //     noaaAlt30.setRenderer(lineRenderSolid);
        
        //     map.addLayers([
        //         noaaAlt3,noaaAlt2,noaaAlt1,noaaAlt4,noaaAlt26,noaaAlt5,
        //         noaaAlt8,noaaAlt7,noaaAlt6,noaaAlt9,noaaAlt27,noaaAlt10,
        //         noaaAlt13,noaaAlt12,noaaAlt11,noaaAlt14,noaaAlt28,noaaAlt15,
        //         noaaAlt18,noaaAlt17,noaaAlt16, noaaAlt19,noaaAlt29,noaaAlt20,
        //         noaaAlt23,noaaAlt22,noaaAlt21,noaaAlt24,noaaAlt30,noaaAlt25,
        //     ]);  
        // });
    }

    document.addEventListener("kml-added", function(evt) {
        debugger
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

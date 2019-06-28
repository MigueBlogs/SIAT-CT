$(function() {
    function loadMap(container) {
        require([
            "esri/Map",
            "esri/views/MapView"
        ], function(Map, MapView) {
            const map = new Map({
                basemap: "hybrid"
            });
      
            var view = new MapView({
                container: container,
                map: map,
                center: [-101.608429, 23.200961],
                zoom: 4
            });
    
            view["ui"]["components"] = ["attributtion"];

            loadCiclones(map);

            // the button that triggers screen shot
            const screenshotBtn = document.getElementById("pdf");

            var area = {
                x:200,
                y:30,
                width: 400,
                height: 300
              };
            screenshotBtn.addEventListener("mouseenter", function() {
            $("#map-container").css("width","400px");
            $("#map-container").css("height","300px");    
                view
                    .takeScreenshot({ format: "png", quality:100 })
                    .then(function(screenshot) {
                      showPreview(screenshot);
                  });
            });

            /**/screenshotBtn.addEventListener("mouseleave", function() {
                $('.js-screenshot-image').hide();
                $('#map-container').show();
                //console.log("mouseleave");
                  
            });
        });
    }


/*
      function showPreview(screenshot) {
           $('.js-screenshot-image').show();
          const screenshotImage = document.getElementsByClassName("js-screenshot-image")[0];
          screenshotImage.width = screenshot.data.width;
          screenshotImage.height = screenshot.data.height;
          screenshotImage.src = screenshot.dataUrl;
          $('#viewDiv').hide();
          generaPdf();
          console.log("ya cambie la imagen");
        }

      
        const screenshotBtn = document.getElementById("pdf");

        screenshotBtn.addEventListener("click", function() {
            view
                .takeScreenshot({format: "png" })
                .then(function(screenshot) {
                  showPreview(screenshot);
              });
        });
  */




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
                    "forecastCone": "https://idpgis.ncep.noaa.gov/arcgis/rest/services/NWS_Forecasts_Guidance_Warnings/NHC_Atl_trop_cyclones/MapServer/16",
                    "forecastPoints": "https://idpgis.ncep.noaa.gov/arcgis/rest/services/NWS_Forecasts_Guidance_Warnings/NHC_Atl_trop_cyclones/MapServer/14",
                    "forecastTrack": "https://idpgis.ncep.noaa.gov/arcgis/rest/services/NWS_Forecasts_Guidance_Warnings/NHC_Atl_trop_cyclones/MapServer/15",
                    "watchWarnings": "https://idpgis.ncep.noaa.gov/arcgis/rest/services/NWS_Forecasts_Guidance_Warnings/NHC_Atl_trop_cyclones/MapServer/17",
                    "pastTrack": "https://idpgis.ncep.noaa.gov/arcgis/rest/services/NWS_Forecasts_Guidance_Warnings/NHC_Atl_trop_cyclones/MapServer/19",
                    "pastPoints": "https://idpgis.ncep.noaa.gov/arcgis/rest/services/NWS_Forecasts_Guidance_Warnings/NHC_Atl_trop_cyclones/MapServer/18",
                }
            },{
                "name": "AT3",
                "layers": {
                    "forecastCone": "https://idpgis.ncep.noaa.gov/arcgis/rest/services/NWS_Forecasts_Guidance_Warnings/NHC_Atl_trop_cyclones/MapServer/26",
                    "forecastPoints": "https://idpgis.ncep.noaa.gov/arcgis/rest/services/NWS_Forecasts_Guidance_Warnings/NHC_Atl_trop_cyclones/MapServer/24",
                    "forecastTrack": "https://idpgis.ncep.noaa.gov/arcgis/rest/services/NWS_Forecasts_Guidance_Warnings/NHC_Atl_trop_cyclones/MapServer/25",
                    "watchWarnings": "https://idpgis.ncep.noaa.gov/arcgis/rest/services/NWS_Forecasts_Guidance_Warnings/NHC_Atl_trop_cyclones/MapServer/27",
                    "pastTrack": "https://idpgis.ncep.noaa.gov/arcgis/rest/services/NWS_Forecasts_Guidance_Warnings/NHC_Atl_trop_cyclones/MapServer/29",
                    "pastPoints": "https://idpgis.ncep.noaa.gov/arcgis/rest/services/NWS_Forecasts_Guidance_Warnings/NHC_Atl_trop_cyclones/MapServer/28",
                }
            },{
                "name": "AT4",
                "layers": {
                    "forecastCone": "https://idpgis.ncep.noaa.gov/arcgis/rest/services/NWS_Forecasts_Guidance_Warnings/NHC_Atl_trop_cyclones/MapServer/36",
                    "forecastPoints": "https://idpgis.ncep.noaa.gov/arcgis/rest/services/NWS_Forecasts_Guidance_Warnings/NHC_Atl_trop_cyclones/MapServer/34",
                    "forecastTrack": "https://idpgis.ncep.noaa.gov/arcgis/rest/services/NWS_Forecasts_Guidance_Warnings/NHC_Atl_trop_cyclones/MapServer/35",
                    "watchWarnings": "https://idpgis.ncep.noaa.gov/arcgis/rest/services/NWS_Forecasts_Guidance_Warnings/NHC_Atl_trop_cyclones/MapServer/37",
                    "pastTrack": "https://idpgis.ncep.noaa.gov/arcgis/rest/services/NWS_Forecasts_Guidance_Warnings/NHC_Atl_trop_cyclones/MapServer/39",
                    "pastPoints": "https://idpgis.ncep.noaa.gov/arcgis/rest/services/NWS_Forecasts_Guidance_Warnings/NHC_Atl_trop_cyclones/MapServer/38",
                }
            },{
                "name": "AT5",
                "layers": {
                    "forecastCone": "https://idpgis.ncep.noaa.gov/arcgis/rest/services/NWS_Forecasts_Guidance_Warnings/NHC_Atl_trop_cyclones/MapServer/46",
                    "forecastPoints": "https://idpgis.ncep.noaa.gov/arcgis/rest/services/NWS_Forecasts_Guidance_Warnings/NHC_Atl_trop_cyclones/MapServer/44",
                    "forecastTrack": "https://idpgis.ncep.noaa.gov/arcgis/rest/services/NWS_Forecasts_Guidance_Warnings/NHC_Atl_trop_cyclones/MapServer/45",
                    "watchWarnings": "https://idpgis.ncep.noaa.gov/arcgis/rest/services/NWS_Forecasts_Guidance_Warnings/NHC_Atl_trop_cyclones/MapServer/47",
                    "pastTrack": "https://idpgis.ncep.noaa.gov/arcgis/rest/services/NWS_Forecasts_Guidance_Warnings/NHC_Atl_trop_cyclones/MapServer/49",
                    "pastPoints": "https://idpgis.ncep.noaa.gov/arcgis/rest/services/NWS_Forecasts_Guidance_Warnings/NHC_Atl_trop_cyclones/MapServer/48",
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


    function showPreview(screenshot) {
              
              $('.js-screenshot-image').show();
              const screenshotImage = document.getElementsByClassName("js-screenshot-image")[0];
              screenshotImage.width = screenshot.data.width;
              screenshotImage.height = screenshot.data.height;
              screenshotImage.src = screenshot.dataUrl;

              $('#map-container').hide();
            }

    loadMap("map-container");
});

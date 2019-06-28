/*$(function() {
	require([
	      "esri/WebScene",
	      "esri/views/SceneView"
	    ], function(WebScene, SceneView) {

	      var webscene = new WebScene({
	        basemap: "satellite"
	      });

	      var view = new SceneView({
	        container: "viewDiv",
	        map: webscene,
	        center: [-102.12,23.56],
	        zoom: 5
	      });

	      function showPreview(screenshot) {
	          $('.js-screenshot-image').show();
	          const screenshotImage = document.getElementsByClassName("js-screenshot-image")[0];
	          //screenshotImage.width = screenshot.data.width;
	          //screenshotImage.height = screenshot.data.height;
	          screenshotImage.src = screenshot.dataUrl;
	          $('#viewDiv').hide();
	        }

	       // the button that triggers screen shot
	        const screenshotBtn = document.getElementById("pdf");
	        
	        screenshotBtn.addEventListener("mouseenter", function() {
	        	view
	                .takeScreenshot({ format: "png" })
	                .then(function(screenshot) {
	                  // display a preview of the image
	                  showPreview(screenshot);

	              });
	        });

	        screenshotBtn.addEventListener("mouseleave", function() {
	        	$('.js-screenshot-image').hide();
	        	$('#viewDiv').show();
	        });

	    });
});*/
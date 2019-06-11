var texto = {"numero":"1"};


var output = document.getElementById('Number');
output.innerHTML = texto.numero;

/*var infoGen={"hora": "17:30 (22:30 GMT)", 
			"coords": "28.8°Norte 68.7° Oeste.",
			"loc": "A 540 km al suroeste de Bermuda y a 2,010 km al este-noreste de las costas de Quintana Roo."
			"despl": "Hacia el norte (350°) a 22km/h."
			"viento": "65 km/h."
			"racha":"85 km/h."};*/
function loadJSON(callback) {   

    var xobj = new XMLHttpRequest();
        xobj.overrideMimeType("application/json");
	    xobj.open('GET', 'JS/info.json', true); // Replace 'my_data' with the path to your file
	    xobj.onreadystatechange = function () {
          if (xobj.readyState == 4 && xobj.status == "200") {
            // Required use of an anonymous callback as .open will NOT return a value but simply returns undefined in asynchronous mode
            callback(xobj.responseText);
          }
    };
    xobj.send(null);  
 }

function readJSON(path) {
    var xhr = new XMLHttpRequest();
    xhr.open('GET', path, true);
    xhr.responseType = 'blob';
    xhr.onload = function(e) { 
      if (this.status == 200) {
          var file = new File([this.response], 'temp');
          var fileReader = new FileReader();
          fileReader.addEventListener('load', function(){
               //do stuff with fileReader.result
          });
          fileReader.readAsText(file);
      } 
    }
    xhr.send();
}


//var data;
//
$.getJSON('JS/info.json',function(data){
	//console.log(data);
	var output = document.getElementById('info');
	output.innerHTML = data.hora;
});


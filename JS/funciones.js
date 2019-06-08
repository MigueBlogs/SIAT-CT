var dt = new Date();
var fecha = {weekday: 'long', year: 'numeric', month: 'long', day: 'numeric'}
var hora = {hour:'2-digit', minute:'2-digit'}
document.getElementById("datetime").innerHTML = dt.toLocaleString("es-MX",fecha)+' / '+dt.toLocaleString("es-MX",hora)+' h';
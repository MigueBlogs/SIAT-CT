function id_a_estado(id_option){
    switch(id_option){
        case "0":
            return 'C';
        case "1":
            return 'N';
        case "2":
            return 'NE';
        case "3":
            return 'E';
        case "4":
            return 'SE';
        case "5":
            return 'S';
        case "6":
            return 'SW';
        case "7":
            return 'W';
        case "8":
            return 'NW';
        default:
            return 'T';
    }
}

function alerta_a_id(region){
    switch (region) {
        case "AZUL":
            return 1;
        case "VERDE":
            return 2;
        case "AMARILLA":
            return 3;
        case "NARANJA":
            return 4;
        case "ROJA":
            return 5;
        default:
            return -1;
    }
}

function get_regions() {
    let estados;
    $.getJSON('JS/estados.json', function(data){
        estados = data;
    });
    let data = {};

    $('#tablaEdos1 > tbody > tr').each(function(){
        // si es el encabezado, saltarlo
        if ($(this).attr('id') === 'Encabezado'){
            return;
        }
        const nivel_alerta = $(this).find('#NivelDeAlerta option:selected').text();
        const tipo = 'acercándose';

        const estado = $(this).find('#Estado option:selected').text();

        const id_reg = $(this).find('#Region option:selected').val();

        let region = id_a_estado(id_reg);

        // guardado de datos
        if (!(estado in data)){
            data[estado] = {};
        }
        if (!(tipo in data[estado])){
            data[estado][tipo] = {};
        }
        if (!(nivel_alerta in data[estado][tipo])){
            data[estado][tipo][nivel_alerta] = [];
        }
        data[estado][tipo][nivel_alerta].push(region);

    });
    $('#tablaEdos2 > tbody > tr').each(function(){
        // si es el encabezado, saltarlo
        if ($(this).attr('id') === 'Encabezado'){
            return;
        }
        const nivel_alerta = $(this).find('#NivelDeAlerta option:selected').text();
        const tipo = 'alejándose';

        const estado = $(this).find('#Estado option:selected').text();

        const id_reg = $(this).find('#Region option:selected').val();

        let region = id_a_estado(id_reg);

        // guardado de datos
        if (!(estado in data)){
            data[estado] = {};
        }
        if (!(tipo in data[estado])){
            data[estado][tipo] = {};
        }
        if (!(nivel_alerta in data[estado][tipo])){
            data[estado][tipo][nivel_alerta] = [];
        }
        data[estado][tipo][nivel_alerta].push(region);

    });

    return data;
}

function get_regiones() {

    let estados;
    $.ajax({
        url: 'JS/estados.json',
        dataType: 'json',
        async: false,
        success: function(json){
            estados = json;
        }
    });

    let data = {};

    $('#tablaEdos1 > tbody > tr').each(function(){
        // si es el encabezado, saltarlo
        if ($(this).attr('id') === 'Encabezado'){
            return;
        }
        const nivel_alerta = $(this).find('#NivelDeAlerta option:selected').text();
        const tipo = 1;

        const estado = $(this).find('#Estado option:selected').text();

        const id_reg = $(this).find('#Region option:selected').val();

        let region = id_a_estado(id_reg);

        // guardado de datos
        if (!(estado in data)){
            data[estado] = [];
        }
        let id_estado;
        $.each(estados, function( index, value ) {
            if (value['nombre'] === estado){
                id_estado = value['id'];
            }
        });
        data[estado].push({
            tipo: tipo,
            region: region,
            nivel_alerta: alerta_a_id(nivel_alerta),
            estado: id_estado
        });

    });
    $('#tablaEdos2 > tbody > tr').each(function(){
        // si es el encabezado, saltarlo
        if ($(this).attr('id') === 'Encabezado'){
            return;
        }
        const nivel_alerta = $(this).find('#NivelDeAlerta option:selected').text();
        const tipo = 2;

        const estado = $(this).find('#Estado option:selected').text();

        const id_reg = $(this).find('#Region option:selected').val();

        let region = id_a_estado(id_reg);

        // guardado de datos
        if (!(estado in data)){
            data[estado] = [];
        }
        let id_estado;
        $.each(estados, function( index, value ) {
            if (value['nombre'] === estado){
                id_estado = value['id'];
            }
        });
        data[estado].push({
            tipo: tipo,
            region: region,
            nivel_alerta: alerta_a_id(nivel_alerta),
            estado: id_estado
        });

    });

    return data;
}
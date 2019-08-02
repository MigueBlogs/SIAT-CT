let id_a_estado = function (id_option){
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
};


let get_regiones = function () {
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
        // if(id_reg==='-1'){
        //     region = 'T';
        // }else{
        //     region= find3.text();
        // }
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
        // if(id_reg==='-1'){
        //     region = 'T';
        // }else{
        //     region= find3.text();
        // }
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
};
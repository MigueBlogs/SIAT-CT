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

        const find3 = $(this).find('#Region option:selected');
        const id_reg = find3.val();

        let region;
        if(id_reg==='-1'){
            region = 'T';
        }else{
            region= find3.text();
        }
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

        const find3 = $(this).find('#Region option:selected');
        const id_reg = find3.val();

        let region;
        if(id_reg==='-1'){
            region = 'T';
        }else{
            region= find3.text();
        }
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
var idBoletinSeguimiento;

$(function() {
    function getSeguimiento(idBoletin) {
        $.ajax({
            type: "GET",
            url: "./siat_fns.php",
            data: {
                idBoletin: idBoletin,
                getSeguimiento: true
            },
            dataType: "json",
            success: function(data) {
                var noAlertamiento = data.length + 1;
                $("#Number").text(noAlertamiento);

                var ultimoBoletin = data[data.length - 1];
                debugger
                idBoletinSeguimiento = ultimoBoletin["idBoletin"];
            },
            error: function(error) {
                console.log(error);
            }
        });
    }

    function getEventInfo(idBoletin) {
        $.ajax({
            type: "GET",
            url: "./siat_fns.php",
            data: {
                idBoletin: idBoletin,
                getEventInfo: true
            },
            dataType: "json",
            success: function(data) {
                console.log(data);
            },
            error: function(error) {
                console.log(error);
            }
        });
    }

    $("#next").on("click", function() {
        if($("#seguimientoOption").prop('checked') && $("#activeEventsOptions option:selected").val() != "") {
            let idBoletin = $("#activeEventsOptions option:selected").val();
            getSeguimiento(idBoletin);
        } else {
            $("#activeEvents").html('');
        }
    });
});
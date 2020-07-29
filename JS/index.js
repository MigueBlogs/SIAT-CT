$(function() {
    function getTropicalCiclones() {
        $.ajax({
            type: "GET",
            url: "./siat_fns.php",
            data: { 
                eventos: true
            },
            dataType: "json",
            success: function(result) {
                var templateSource = $("#storms-template").html();
                var template = Handlebars.compile(templateSource);
                var storms = result.map(r => r[0]);
                var outputHTML = template({storms: storms.splice(0,4)});
                $("#latest-events-container").html(outputHTML);
            }, error: function(result) {

            }
        });
    }

    getTropicalCiclones();
});
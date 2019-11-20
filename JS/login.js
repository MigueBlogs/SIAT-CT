$(function() {
    var loginErrorEvent;

    $("#enviar").on("click", function(e){
        e.preventDefault();
        var username = $("#username").val().trim();
        var pwd = $("#pwd").val().trim();

        if(username != "" && pwd != "") {
            var data = { login: "", username: username, pwd: pwd };
            $.ajax({
                url: "./login_fns.php",
                method: "POST",
                data: data,
                dataType: "json",
                success: function(data) {
                    var status = data["status"];
                    if(status != 1) {
                        var message = data["message"];
                        $("#message").text(message);
                        $("form")[0].reset();

                        clearTimeout(loginErrorEvent);

                        loginErrorEvent = window.setTimeout(function() {
                            $("#message").text("");
                        }, 3000);
                    } else if(status == 1) {
                        window.location.href = "//" + window.location.hostname + "/SIAT-CT";
                    }

                },
                error: function() {
    
                }
            });
        }
    });
});
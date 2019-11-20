<?php
    session_start();
    require_once("pagina_fns.php");
?>
<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta http-equiv="X-UA-Compatible" content="ie=edge">
    <title>Inicio de Sesión</title>

    <script  src="https://code.jquery.com/jquery-3.3.1.min.js"  integrity="sha256-FgpCb/KJQlLNfOu91ta32o/NMZxltwRo8QtmkMRdAu8="  crossorigin="anonymous"></script>
    <link rel="stylesheet" href="./css/login.css">
</head>
<body>
    <?php includeNav(); ?>
    <div class="main-container">
        <form  class="login-form" method="POST">
            <div class="form-header">
                <h1>Inicio de sesión</h1>
                <h3 id="message"></h3>
            </div>
            <div class="form-control">
                <label for="username">Usuario</label>
                <input type="text" name="username" id="username" placeholder="correo">
            </div>
            <div class="form-control">
                <label for="pwd">Constraseña</label>
                <input type="password" name="pwd" id="pwd" placeholder="contraseña">
            </div>
            <div class="form-control">
                <button id="enviar" type="submit">Enviar</button>
            </div>
        </form>
    </div>
    <script src="./JS/login.js"></script>
</body>
</html>
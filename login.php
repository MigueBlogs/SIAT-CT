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
    <iframe id="iFrame-nav-gob" src="/nav.html" frameborder="0" style="width: 100%;height: 60px;margin-bottom: -5px;"></iframe>
    <?php includeNav(); ?>
    <div class="main-container" style="margin-top: 0;height: calc(100vh - 130px);">
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

    <iframe id="MyIframe" src="/footer.html" scrolling="no" width="100%" height="425.5px" style="border: 0px;"></iframe>
    <script src="/js/nav-gob.js"></script>
    <script src="/js/footer.js"></script>
</body>
</html>
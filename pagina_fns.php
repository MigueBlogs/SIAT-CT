<?php
    function includeNav() {
        ?>
         <!-- IMPORTANTE AGREGAR REPARADOR DE ESTILOS -->
        <link rel="stylesheet" href="/css/fixStylesAlternative.css">
        <link rel="stylesheet" href="/css/onlyfornav.css">
        <!-- sección de sub NavBar -->
        <nav id="mainNav" class="navbar navbar-inverse sub-navbar navbar-fixed-top">
            <div class="container containerNavBar">
            <div class="navbar-header">
                <button type="button" class="navbar-toggle collapsed" data-toggle="collapse" data-target="#subenlaces">
                <span class="sr-only">Interruptor de Navegación</span>
                <span class="icon-bar"></span>
                <span class="icon-bar"></span>
                <span class="icon-bar"></span>
                </button>
                <a href="http://www.preparados.gob.mx/">
                    <img id="chimali" src="http://www.atlasnacionalderiesgos.gob.mx/Imagenes/Logos/chimali.png" alt="Coordinación Nacional de Protección Civil">
                </a>
            </div>
            <div class="collapse navbar-collapse fixPosition" id="subenlaces">
                <ul class="nav navbar-nav navbar-right">
                <li><a href="./">Inicio</a></li>
                <li><a href="./consulta.php">Consulta</a></li>
                <?php
                    if(isset($_SESSION['username'])) {
                ?>
                    <li><a href="alta.php" class="sessionActive">Nuevo</a></li>
                    <li><a href="logout.php" class="sessionActive logout" style="background-color:#9D2449;color:white;">Salir</a></li>
                <?php
                    }
                ?>
                </ul>
            </div>
            </div>
        </nav>
        <!-- myplugins.js complementa las funciones del toggle en el menú sel sub nav bar -->
        <script src="/js/myplugins.js"></script>
        <?php
    }

    function getFooter() {
        ?>
        <iframe id="MyIframe" src="/footer.html" scrolling="no" width="100%" height="425.5px" style="border: 0px; margin-bottom: -5px;"></iframe>
        <script src="/js/footer.js"></script>
        <?php
    }
?>